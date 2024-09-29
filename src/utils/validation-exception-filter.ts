import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    const errorResponse = exception.getResponse() as {
      message: string | string[];
    };

    let errorDescription: string;

    if (Array.isArray(errorResponse.message)) {
      errorDescription = errorResponse.message.join(", ");
    } else {
      errorDescription = errorResponse.message;
    }

    response.status(status).json({
      error_code: "INVALID_DATA",
      error_description: errorDescription,
    });
  }
}
