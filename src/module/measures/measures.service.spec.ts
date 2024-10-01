import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { env } from "../../configs/env";
import { GeminiService } from "../../providers/gemini/gemini.service";
import { RequestConfirmDto } from "./dtos/request-confirm.dto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseConfirmDto } from "./dtos/response-confirm.dto";
import { ResponseListDto } from "./dtos/response-list.dto";
import { ResponseMeasureDto } from "./dtos/response-measure.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { MeasuresRepository } from "./interfaces/measures.repository";
import { MeasuresService } from "./measures.service";
import { requestSubmitImageMock } from "./mocks/request-body-submit-image";

describe("MeasuresService", () => {
  let service: MeasuresService;
  let repository: MeasuresRepository;
  let geminiService: GeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasuresService,
        {
          provide: MeasuresRepository,
          useValue: {
            alreadyExists: jest.fn(),
            save: jest.fn(),
            findByMeasureId: jest.fn(),
            list: jest.fn(),
          },
        },
        {
          provide: GeminiService,
          useValue: {
            generateContentWithImages: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeasuresService>(MeasuresService);
    repository = module.get<MeasuresRepository>(MeasuresRepository);
    geminiService = module.get<GeminiService>(GeminiService);
  });

  it("should correctly process image submission", async () => {
    const request: RequestSubmitImageDto = requestSubmitImageMock;
    const response: ResponseMeasureDto = {
      measure_uuid: randomUUID(),
      measure_datetime: new Date(),
      measure_type: MeasureTypeEnum.WATER,
      has_confirmed: false,
      image_url: "image/path",
      measure_value: 10,
      customer_code: "customer1",
    };

    jest.spyOn(repository, "alreadyExists").mockResolvedValue(false);
    jest
      .spyOn(geminiService, "generateContentWithImages")
      .mockResolvedValue("10");
    jest.spyOn(repository, "save").mockResolvedValue(response);

    const result: ResponseSubmitImageDto =
      await service.handleSubmitImage(request);

    expect(result).toEqual({
      image_url: `${env.BASE_URL}/${response.image_url}`,
      measure_value: response.measure_value,
      measure_uuid: response.measure_uuid,
    });
  });

  it("should accurately confirm image submission", async () => {
    const request: RequestConfirmDto = {
      confirmed_value: 10,
      measure_uuid: randomUUID(),
    };
    const response: ResponseMeasureDto = {
      measure_uuid: request.measure_uuid,
      measure_datetime: new Date(),
      measure_type: MeasureTypeEnum.WATER,
      has_confirmed: false,
      image_url: "image/path",
      measure_value: request.confirmed_value,
      customer_code: "customer1",
    };

    jest.spyOn(repository, "findByMeasureId").mockResolvedValue(response);
    jest.spyOn(repository, "save").mockResolvedValue({
      ...response,
      has_confirmed: true,
    });

    const result: ResponseConfirmDto = await service.handleConfirm(request);
    expect(result).toEqual({ success: true });
  });

  it("should successfully retrieve the list of measures", async () => {
    const customer_code = "customer1";
    const measure_type = MeasureTypeEnum.WATER;

    const response: ResponseListDto = {
      customer_code: customer_code,
      measures: [
        {
          measure_uuid: randomUUID(),
          measure_datetime: new Date(),
          measure_type: MeasureTypeEnum.WATER,
          has_confirmed: false,
          image_url: "image/path",
        },
      ],
    };

    jest.spyOn(repository, "list").mockResolvedValue([
      {
        measure_uuid: response.measures[0].measure_uuid,
        measure_datetime: response.measures[0].measure_datetime,
        measure_type: response.measures[0].measure_type,
        has_confirmed: response.measures[0].has_confirmed,
        image_url: response.measures[0].image_url,
        measure_value: 10,
        customer_code: customer_code,
      },
    ]);

    const result: ResponseListDto = await service.handleList(
      customer_code,
      measure_type,
    );
    expect(result.customer_code).toEqual(customer_code);
    expect(result.measures).toHaveLength(1);
    expect(result.measures[0].image_url).toEqual(
      "http://localhost:3333/image/path",
    );
  });
});
