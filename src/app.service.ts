import { Injectable } from "@nestjs/common";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";

@Injectable()
export class AppService {
  constructor() {}

  async submitImage(
    dto: RequestSubmitImageDto,
  ): Promise<ResponseSubmitImageDto> {
    return;
  }
}
