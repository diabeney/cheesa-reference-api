import { Request, Response } from "express";
import { validateObject, ErrorMsg, STATUS, TokenPayload } from "../utils";
import {
  ReferenceShape,
  RespondToReference,
  submitRequestedReference,
} from "../constants/constants";
import { ZodError } from "zod";
import { Types } from "mongoose";
import { getLecturerById } from "../db/user";
import {
  getUsersReferenceByRole,
  getReferenceById,
  RequestReference,
  updateReferenceById,
} from "../db/reference";
import {
  RequestReference as RefReqObject,
  ReferenceResponse,
} from "../types/types";
import { submitRequestEmail } from "../utils/sendEmail";
import Users from "../models/userModel";
import {
  isAcceptedMessage,
  isRejectedMessage,
  isSubmittedMessage,
  requestReferenceMessage,
} from "../utils/emailTemplate";
import Reference from "../models/reference";

type QueryFields = {
  refId: Types.ObjectId;
  accepted: string;
  status: string;
};

interface AuthQueryRequest
  extends Request<unknown, unknown, unknown, QueryFields> {
  userPayload?: TokenPayload;
}

async function handleRequestReference(
  req: Request<unknown, unknown, RefReqObject>,
  res: Response
) {
  const formObj = validateObject(req.body, ReferenceShape);

  if (formObj instanceof ZodError) {
    const { message } = formObj.issues[0];
    return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
  }
  const { quantity, lecturerId, graduateId, purposeOfReference, requests } =
    formObj;

  if (quantity !== requests.length)
    return res
      .status(400)
      .json(ErrorMsg(400, "Number of requests does not match quantity"));

  try {
    const lecturer = await getLecturerById(lecturerId);
    const graduate = await Users.findById(graduateId);

    if (!lecturer) return res.status(STATUS.NOT_FOUND.code).json(ErrorMsg(404));

    // Create a reference for each request
    for (let i = 0; i < quantity; i++) {
      const request = requests[i];

      const { destination, expectedDate, address, modeOfPostage, description } =
        request;

      const payload = {
        graduateId,
        lecturerId,
        purposeOfReference,
        destination,
        address,
        modeOfPostage,
        expectedDate: new Date(expectedDate),
        description,
      };

      const _ = await RequestReference(payload);
      const messagePayloads = {
        data: payload,
        fullName: `${graduate?.firstName} ${graduate?.lastName}`,
        programme: `${graduate?.programme}`,
        entryYear: `${graduate?.entryYear}`,
        graduationYear: `${graduate?.graduationYear}`,
      };
      const message = requestReferenceMessage(lecturer, messagePayloads);
      // Send email to lecturer that a request is made
      const dispatchedMessages = submitRequestEmail({
        to: lecturer.email,
        subject: "Request Notice from REFHUB",
        message,
      });

      if (!dispatchedMessages) return res.status(500).json(ErrorMsg(500));

      await dispatchedMessages;
    }
    res.status(201).json({ message: "Successfully created reference" });
  } catch (err) {
    console.log(err);
    res.status(500).json(ErrorMsg(500));
  }
}

async function handleViewReference(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) return res.status(400).json(ErrorMsg(400));

  try {
    const reference = await getReferenceById(id);

    if (reference instanceof Error) return res.status(404).json(ErrorMsg(404));
    res.status(200).json({ ...reference });
  } catch (err) {
    console.log(err);
    res.status(500).json(ErrorMsg(500));
  }
}

const GraduatesReferenceControllers = {
  handleGetGradReferences: async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) return res.status(400).json(ErrorMsg(400));

    try {
      const references = await getUsersReferenceByRole(id, "graduate");
      res.status(200).json({ results: references });
    } catch (err) {
      console.log(err);
      res.status(500).json(ErrorMsg(500));
    }
  },
};

const LecturersReferenceControllers = {
  handleGetLecturerReferences: async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) return res.status(400).json(ErrorMsg(400));

    try {
      const references = await getUsersReferenceByRole(id, "lecturer");
      res.status(200).json({ results: references });
    } catch (err) {
      console.log(err);
      res.status(500).json(ErrorMsg(500));
    }
  },

  handleRespondRequest: async (req: AuthQueryRequest, res: Response) => {
    const lecturerObj = req.userPayload;
    if (!lecturerObj) return res.status(401).json(ErrorMsg(401));

    const queryParams = req.query;
    if (!queryParams) return res.status(400).json(ErrorMsg(400));

    const validatedParams = validateObject(queryParams, RespondToReference);

    if (validatedParams instanceof ZodError) {
      const { message } = validatedParams.issues[0];
      return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
    }

    try {
      const { id } = lecturerObj;

      const lecturer = await getLecturerById(id);

      const reference = await Reference.findOne<ReferenceResponse>({
        _id: validatedParams.refId,
        lecturerId: id,
      }).populate({
        path: "graduateId lecturerId",
        select: "email firstName lastName destination",
        model: Users,
      });

      if (!reference) return res.status(403).json(ErrorMsg(403));

      if (!lecturer) return res.status(403).json(ErrorMsg(403));

      const { refId, accepted: isAccepted } = validatedParams;

      const updatePayload = {
        accepted: isAccepted === "true" ? "accepted" : "declined",
      } as { accepted: "accepted" | "declined" };

      const _ = await updateReferenceById(refId, updatePayload);

      // Get Graduate Email
      if (isAccepted === "true") {
        // Send email to
        const messagePayload = {
          graduateName: `${reference?.graduateId.firstName} ${reference?.graduateId.lastName}`,
          lecturerName: `${reference?.lecturerId.firstName} ${reference?.lecturerId.lastName}`,
          destination: reference.destination,
        };
        const message = isAcceptedMessage(messagePayload);
        const dispatachedMessages = submitRequestEmail({
          to: reference.graduateId.email,
          subject: "Acceptance Notice from REFHUB",
          message,
        });

        if (!dispatachedMessages) return res.status(500).json(ErrorMsg(500));

        await dispatachedMessages;
      } else if (isAccepted === "false") {
        // Send email to graduate
        const messagePayload = {
          graduateName: `${reference?.graduateId.firstName} ${reference?.graduateId.lastName}`,
          lecturerName: `${reference?.lecturerId.firstName} ${reference?.lecturerId.lastName}`,
          destination: reference.destination,
        };
        const message = isRejectedMessage(messagePayload);
        const dispatachedMessages = submitRequestEmail({
          to: reference.graduateId.email,
          subject: "Decline Notice from REFHUB",
          message,
        });

        if (!dispatachedMessages) return res.status(500).json(ErrorMsg(500));

        await dispatachedMessages;
      }
      res.status(200).json({ message: "Successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json(ErrorMsg(500));
    }
  },

  handleSubmitRequest: async (req: AuthQueryRequest, res: Response) => {
    const lecturerObj = req.userPayload;
    if (!lecturerObj) return res.status(401).json(ErrorMsg(401));

    const queryParams = req.query;
    if (!queryParams) return res.status(400).json(ErrorMsg(400));

    const validatedParams = validateObject(
      queryParams,
      submitRequestedReference
    );

    if (validatedParams instanceof ZodError) {
      const { message } = validatedParams.issues[0];
      return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
    }

    try {
      const { id } = lecturerObj;

      const lecturer = await getLecturerById(id);

      if (!lecturer) return res.status(403).json(ErrorMsg(403));

      const reference = await Reference.findOne<ReferenceResponse>({
        _id: validatedParams.refId,
        lecturerId: id,
      }).populate({
        path: "graduateId lecturerId",
        select: "email firstName lastName destination",
        model: Users,
      });

      if (!reference) return res.status(403).json(ErrorMsg(403));

      if (reference.status === "submitted") {
        return res
          .status(403)
          .json({ message: "Reference is already submitted." });
      }

      const { refId, status: isSubmitted } = validatedParams;

      const updatePayload = {
        status: isSubmitted === "true" ? "submitted" : "not ready",
      } as { status: "submitted" | "not ready" };

      await Reference.findByIdAndUpdate(refId, updatePayload);

      // Get Graduate Email
      if (isSubmitted === "true") {
        // Send email to graduate
        const messagePayload = {
          graduateName: `${reference?.graduateId.firstName} ${reference?.graduateId.lastName}`,
          lecturerName: `${reference?.lecturerId.firstName} ${reference?.lecturerId.lastName}`,
          destination: reference.destination,
        };
        const message = isSubmittedMessage(messagePayload);
        const dispatchedMessages = submitRequestEmail({
          to: reference.graduateId.email,
          subject: "Submission Notice from REFHUB",
          message,
        });

        if (!dispatchedMessages) return res.status(500).json(ErrorMsg(500));

        await dispatchedMessages;
      }
      res.status(200).json({ message: "Successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json(ErrorMsg(500));
    }
  },
};

export { handleRequestReference, handleViewReference };
export { LecturersReferenceControllers as handleLecturers };
export { GraduatesReferenceControllers as handleGraduates };
