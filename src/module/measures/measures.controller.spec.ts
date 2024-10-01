import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { env } from "../../configs/env";
import { RequestConfirmDto } from "./dtos/request-confirm.dto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
import { ResponseConfirmDto } from "./dtos/response-confirm.dto";
import { ResponseSubmitImageDto } from "./dtos/response-submit-image.dto";
import { MeasuresController } from "./measures.controller";
import { MeasuresService } from "./measures.service";
import { requestSubmitImageMock } from "./mocks/request-boyd-submit-image";

describe("MeasuresController", () => {
  let controller: MeasuresController;
  let service: MeasuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasuresController],
      providers: [
        {
          provide: MeasuresService,
          useValue: {
            handleSubmitImage: jest.fn(),
            handleConfirm: jest.fn(),
            handleList: jest.fn((customerCode: string) => {
              return {
                customer_code: customerCode,
                measures: [],
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<MeasuresController>(MeasuresController);
    service = module.get<MeasuresService>(MeasuresService);
  });

  describe("Submit image", () => {
    it("Created successful", async () => {
      const requestDto: RequestSubmitImageDto = requestSubmitImageMock;
      const responseDto: ResponseSubmitImageDto = {
        image_url: `${env.BASE_URL}/string-1727623308181.png`,
        measure_uuid: randomUUID(),
        measure_value: 1230.5,
      };

      jest.spyOn(service, "handleSubmitImage").mockResolvedValue(responseDto);

      const result = await controller.submitImage(requestDto);
      expect(result).toEqual(responseDto);
      expect(service.handleSubmitImage).toHaveBeenCalledWith(requestDto);
    });
  });

  describe("Confirm", () => {
    it("Confirm successful", async () => {
      const requestDto: RequestConfirmDto = {
        measure_uuid: randomUUID(),
        confirmed_value: 1230.5,
      };
      const responseDto: ResponseConfirmDto = {
        success: true,
      };

      jest.spyOn(service, "handleConfirm").mockResolvedValue(responseDto);

      const result = await controller.confirm(requestDto);
      expect(result).toEqual(responseDto);
      expect(service.handleConfirm).toHaveBeenCalledWith(requestDto);
    });
  });

  describe("List", () => {
    it("List successful", async () => {
      const customerCode = "customer1";
      const responseDto = {
        customer_code: customerCode,
        measures: [],
      };

      jest.spyOn(service, "handleList").mockResolvedValue(responseDto);

      const result = await controller.list(customerCode);
      expect(result).toEqual(responseDto);
    });
  });
});
