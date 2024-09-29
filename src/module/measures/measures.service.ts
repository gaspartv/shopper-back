import { HttpStatus, Injectable } from "@nestjs/common";
import { GeminiService } from "../../providers/gemini/gemini.service";
import { Convert } from "../../utils/convert";
import { Exception } from "../../utils/http-exception";
import { RequestConfirmDto } from "./dtos/request-confirm.dto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseConfirmDto } from "./dtos/response-confirm.dto";
import { ResponseListDto } from "./dtos/response-list.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { MeasuresRepository } from "./interfaces/measures.repository";
import { Measure } from "./measures.entity";

@Injectable()
export class MeasuresService {
  constructor(
    private readonly repository: MeasuresRepository,
    private readonly geminiService: GeminiService,
  ) {}

  async handleSubmitImage(
    dto: RequestSubmitImageDto,
  ): Promise<ResponseSubmitImageDto> {
    await this.checkIfMeasureExists(dto);
    const { filePath, name, mimeType } = await Convert.toBase64ImageAndSave(
      dto.image,
      dto.customer_code,
    );
    const measureValue = await this.getMeasureValue(filePath, mimeType);
    const measure = await this.createMeasure(dto, name, measureValue);
    return {
      image_url: `http://localhost:3333/${measure.image_url}`,
      measure_value: measure.measure_value,
      measure_uuid: measure.measure_uuid,
    };
  }

  async handleConfirm(dto: RequestConfirmDto): Promise<ResponseConfirmDto> {
    const measure = await this.measureOrThrow(dto.measure_uuid);
    if (measure.has_confirmed) {
      Exception.execute(
        "Leitura do mês já realizada",
        "CONFIRMATION_DUPLICATE",
        HttpStatus.CONFLICT,
      );
    }
    const updatedMeasure = new Measure(measure);
    updatedMeasure.setHasConfirmed(true);
    await this.repository.save(updatedMeasure);
    return { success: true };
  }

  async handleList(
    customer_code: string,
    measure_type: MeasureTypeEnum,
  ): Promise<ResponseListDto> {
    const measures = await this.repository.list(customer_code, measure_type);
    if (measures.length < 1) {
      Exception.execute(
        "Nenhuma leitura encontrada",
        "MEASURES_NOT_FOUND",
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      customer_code,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: `http://localhost:3333/${measure.image_url}`,
      })),
    };
  }

  private async measureOrThrow(measure_uuid: string) {
    const measure = await this.repository.findByMeasureId(measure_uuid);
    if (!measure) {
      Exception.execute(
        "Leitura do mês já realizada",
        "MEASURE_NOT_FOUND",
        HttpStatus.NOT_FOUND,
      );
    }
    return measure;
  }

  private async checkIfMeasureExists(dto: RequestSubmitImageDto) {
    const exists = await this.repository.alreadyExists(
      dto.measure_datetime,
      dto.measure_type,
      dto.customer_code,
    );
    if (exists) {
      Exception.execute(
        "Already exists a measure with this data",
        "DOUBLE_REPORT",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getMeasureValue(filePath: string, mimeType: string) {
    const prompt =
      "Scenario: We will develop the backend of a service that manages individualized readings of water and gas consumption. To facilitate the collection of information, the service will use AI to obtain the measurement through a photo of a meter. Return an integer value.";

    const geminiResponse = await this.geminiService.generateContentWithImages(
      filePath,
      mimeType,
      prompt,
    );

    if (!geminiResponse || isNaN(Number(geminiResponse))) {
      Exception.execute(
        "Error on generate text in gemini",
        "INVALID_DATA",
        HttpStatus.BAD_REQUEST,
      );
    }

    return parseFloat(geminiResponse);
  }

  private async createMeasure(
    dto: RequestSubmitImageDto,
    name: string,
    measureValue: number,
  ) {
    const measure = new Measure();
    measure.create({
      customer_code: dto.customer_code,
      measure_datetime: dto.measure_datetime,
      measure_type: dto.measure_type,
      image_url: name,
      measure_value: measureValue,
    });

    return this.repository.save(measure);
  }
}
