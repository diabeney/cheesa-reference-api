import { test, expect, describe } from "vitest";
import { validateObject } from "../utils";
import { SignUpShape } from "../constants/constants";

const payloadOne = {
  firstName: "John",
  lastName: "Doe",
  email: "addoa@gmail.com",
  password: "whatsapppa",
  role: "lecturer",
};

const payloadTwo = {
  lastName: "Doe",
  email: "addoa@gmail.com",
  password: "whatsapppa",
  role: "lecturer",
};

describe("User object validation", () => {
  describe("Test a valid object with Zod", () => {
    test("where all fields are present", () => {
      expect(validateObject(payloadOne, SignUpShape)).toMatchObject(payloadOne);
    });
    test("where additional fields are added", () => {
      expect(
        validateObject({ ...payloadOne, another: "validobject" }, SignUpShape)
      ).toMatchObject(payloadOne);
    });
  });
  describe("Test an invalid object with Zod", () => {
    test("where some required fields are missing", () => {
      expect(validateObject(payloadTwo, SignUpShape)).toBeInstanceOf(Error);
    });
    test("where there is an invalid value", () => {
      expect(
        validateObject(
          { ...payloadOne, firstName: "validobject", email: "null@" },
          SignUpShape
        )
      ).toBeInstanceOf(Error);
    });
    test("where there is an invalid enum", () => {
      expect(
        validateObject(
          { ...payloadOne, firstName: "validobject", role: "invalid" },
          SignUpShape
        )
      ).toBeInstanceOf(Error);
    });
  });
});
