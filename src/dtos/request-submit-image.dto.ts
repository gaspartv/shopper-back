import {MeasureTypeEnum} from "../enums/measure-type.enum";
import {IsBase64, IsDate, IsEnum, IsString} from "class-validator";

export class SubmitImageDto {
    @IsBase64()
    image: string

    @IsString()
    customer_code: string

    @IsDate()
    measure_datetime: Date

    @IsEnum(MeasureTypeEnum, { message: 'O tipo de medida deve ser "WATER" ou "GAS"' })
    measure_type: MeasureTypeEnum
}
