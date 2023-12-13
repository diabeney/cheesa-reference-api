function validateReqObject<T = object>(
  obj: Partial<T>,
  requiredFields: (keyof T)[]
) {
  const isInvalid = requiredFields.some(
    (field) => Object.keys(obj).indexOf(field as string) === -1 || !obj[field]
  );

  if (isInvalid) {
    return new Error("Bad Request");
  }
  return obj as T;
}

const STATUS = {
  CREATED: {
    code: 201,
    message: "Successfully Created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: "Invalid Credentials",
  },
  UNAUTHORIZED: {
    code: 403,
    message: "Not Authorized",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
};

export { validateReqObject, STATUS };
