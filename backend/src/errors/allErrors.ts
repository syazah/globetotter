import { StatusCodes } from "http-status-codes";

/* -------------------------------------   Custom Error Classes   ------------------------------------- */

/**
 * CustomError is a specialized error class that extends the built-in Error class.
 * It includes additional properties such as statusCode, errors, code, and stack.
 *
 * @class
 * @extends {Error}
 */
class CustomError extends Error {
  statusCode: number;
  errors?: string[];
  code?: string;
  stack?: string;

  constructor(
    message: string,
    statusCode: number,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.stack = stack;
  }
}

/**
 * Represents a BadRequest error which extends the CustomError class.
 * This error is used to indicate that the server cannot process the request
 * due to a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * @class BadRequest
 * @extends {CustomError}
 *
 * @param {string} message - The error message.
 * @param {string[]} [errors] - An optional array of error details.
 * @param {string} [code] - An optional error code.
 * @param {string} [stack] - An optional stack trace.
 */
class BadRequest extends CustomError {
  constructor(
    message: string,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message, StatusCodes.BAD_REQUEST, errors, code, stack);
  }
}

/**
 * Represents a Forbidden Error which extends the CustomError class.
 * This error is typically used to indicate that the server understood the request,
 * but refuses to authorize it, corresponding to the HTTP status code 403.
 *
 * @extends {CustomError}
 *
 * @param {string} message - A descriptive message explaining the error.
 * @param {string[]} [errors] - An optional array of error messages providing additional details.
 * @param {string} [code] - An optional error code for further categorization.
 * @param {string} [stack] - An optional stack trace for debugging purposes.
 */
class ForbiddenError extends CustomError {
  constructor(
    message: string,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message, StatusCodes.FORBIDDEN, errors, code, stack);
  }
}

/**
 * Represents a "Not Found" error, typically used when a requested resource cannot be found.
 * Extends the `CustomError` class.
 *
 * @class
 * @extends {CustomError}
 *
 * @param {string} message - A descriptive message explaining the error.
 * @param {string[]} [errors] - An optional array of error details.
 * @param {string} [code] - An optional error code.
 * @param {string} [stack] - An optional stack trace.
 */
class NotFound extends CustomError {
  constructor(
    message: string,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message, StatusCodes.NOT_FOUND, errors, code, stack);
  }
}

/**
 * Represents a validation error that extends the CustomError class.
 * This error is typically used to indicate that some form of validation has failed.
 *
 * @class ValidationError
 * @extends {CustomError}
 *
 * @param {string} message - The error message.
 * @param {string[]} [errors] - An optional array of error details.
 * @param {string} [code] - An optional error code.
 * @param {string} [stack] - An optional stack trace.
 */
class ValidationError extends CustomError {
  constructor(
    message: string,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, errors, code, stack);
  }
}

/**
 * Represents an internal server error.
 * This error is typically used to indicate that an unexpected condition was encountered
 * and no more specific message is suitable.
 *
 * @extends {CustomError}
 *
 * @param {string} message - The error message.
 * @param {string[]} [errors] - An optional array of error details.
 * @param {string} [code] - An optional error code.
 * @param {string} [stack] - An optional stack trace.
 */
class InternalServer extends CustomError {
  constructor(
    message: string,
    errors?: string[],
    code?: string,
    stack?: string
  ) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, errors, code, stack);
  }
}

export {
  CustomError,
  BadRequest,
  ForbiddenError,
  NotFound,
  ValidationError,
  InternalServer,
};
