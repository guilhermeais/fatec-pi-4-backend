export class BaseError extends Error {
  constructor({ message, action, statusCode, isOperational }) {
    super(message);
    this.action = action;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
