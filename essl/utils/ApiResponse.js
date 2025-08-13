export class ApiResponse {
  constructor(statusCode, message, data, key = [], totalPage) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    if (data) {
      this.data = data;
    }
    this.key = key;
    this.totalPage = totalPage || 0;
  }
}
