import { ResponseMeasureDto } from "../dtos/response-measure.dto";
import { MeasureTypeEnum } from "../enums/measure-type.enum";
import { Measure } from "../measures.entity";

export abstract class MeasuresRepository {
  abstract save(entity: Measure): Promise<ResponseMeasureDto>;
  abstract alreadyExists(
    measure_datetime: Date,
    measure_type: MeasureTypeEnum,
    customer_code: string,
  ): Promise<boolean>;
  abstract findByMeasureId(measure_uuid: string): Promise<ResponseMeasureDto>;
  abstract list(
    customer_code: string,
    measure_type: MeasureTypeEnum,
  ): Promise<ResponseMeasureDto[]>;
}
