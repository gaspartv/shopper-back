import { IsNumber, IsUUID } from "class-validator";

export class RequestConfirmDto {
  @IsUUID()
  measure_uuid: string;

  @IsNumber()
  confirmed_value: number;
}
