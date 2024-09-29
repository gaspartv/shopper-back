import { HttpException, HttpStatus } from "@nestjs/common";

export class Exception {
  static execute(
    error_description: string,
    error_code: string,
    httpStatus: HttpStatus,
  ) {
    throw new HttpException(
      {
        error_code,
        error_description,
      },
      httpStatus,
    );
  }
}
