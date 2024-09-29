import { IsDateString, IsEnum, IsString } from "class-validator";
import { IsBase64Image } from "../../../utils/validation-base64";
import { MeasureTypeEnum } from "../enums/measure-type.enum";

export class RequestSubmitImageDto {
  @IsBase64Image()
  image: string;

  @IsString()
  customer_code: string;

  @IsDateString()
  measure_datetime: Date;

  @IsEnum(MeasureTypeEnum, {
    message: "The measurement type must be 'WATER' or 'GAS'",
  })
  measure_type: MeasureTypeEnum;
}
