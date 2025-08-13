export class ApiResponse<T = undefined> {
  private success: boolean;
  private statusCode: number;
  private message: string;
  private data: T | undefined = undefined;
  private key: string[] = []
  private totalPage: number = 0;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    key: string[] = [],
    totalPage?: number
  ) {
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
