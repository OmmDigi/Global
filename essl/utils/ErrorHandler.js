export class ErrorHandler {
  constructor(statusCode, message, key = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = true;
    this.key = key;
  }
}
