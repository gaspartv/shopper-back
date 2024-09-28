import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { RequestConfirmDto } from "./dtos/request-confirm.dto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseConfirmDto } from "./dtos/response-confirm.dto";
import { ResponseListDto } from "./dtos/response-list.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/upload")
  submitImage(
    @Body() body: RequestSubmitImageDto,
  ): Promise<ResponseSubmitImageDto> {
    return this.appService.submitImage(body);
  }

  @Patch("/confirm")
  confirm(@Body() body: RequestConfirmDto): Promise<ResponseConfirmDto> {
    return;
  }

  @Get("/:customer_code/list")
  list(
    @Param("customer_code") customer_code: string,
    @Query("measure_type") measure_type: string,
  ): Promise<ResponseListDto> {
    return;
  }
}
