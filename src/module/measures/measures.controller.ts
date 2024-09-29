import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Exception } from "../../utils/http-exception";
import { ToUpperCasePipe } from "../../utils/to-upper-case-pipe";
import { RequestConfirmDto } from "./dtos/request-confirm.dto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseConfirmDto } from "./dtos/response-confirm.dto";
import { ResponseListDto } from "./dtos/response-list.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { MeasuresService } from "./measures.service";

@Controller()
export class MeasuresController {
  constructor(private readonly service: MeasuresService) {}

  @Post("/upload")
  @HttpCode(200)
  submitImage(
    @Body() body: RequestSubmitImageDto,
  ): Promise<ResponseSubmitImageDto> {
    return this.service.handleSubmitImage(body);
  }

  @Patch("/confirm")
  @HttpCode(200)
  confirm(@Body() body: RequestConfirmDto): Promise<ResponseConfirmDto> {
    return this.service.handleConfirm(body);
  }

  @Get("/:customer_code/list")
  list(
    @Param("customer_code") customer_code: string,
    @Query(
      "measure_type",
      new ToUpperCasePipe(),
      new ParseEnumPipe(MeasureTypeEnum, {
        optional: true,
        exceptionFactory: () =>
          Exception.execute(
            "Tipo de medição não permitida",
            "INVALID_TYPE",
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    measure_type?: MeasureTypeEnum,
  ): Promise<ResponseListDto> {
    return this.service.handleList(customer_code, measure_type);
  }
}
