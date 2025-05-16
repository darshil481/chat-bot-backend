export class HttpException extends Error {
  public status: number;
  public message: string;
  public toast?: boolean;  

  constructor(status: number, message: string, toast?: boolean) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
    this.status = status;
    this.message = message;
    this.toast = toast ?? false; 
  }
}
