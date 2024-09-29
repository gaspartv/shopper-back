import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { RequestSubmitImageDto } from "./dtos/request-submit-image.dto";
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
          },
        },
      ],
    }).compile();

    controller = module.get<MeasuresController>(MeasuresController);
    service = module.get<MeasuresService>(MeasuresService);
  });

  describe("Submit image", () => {
    it("", async () => {
      const requestDto: RequestSubmitImageDto = requestSubmitImageMock;
      const responseDto: ResponseSubmitImageDto = {
        image_url: "http://localhost:3333/string-1727623308181.png",
        measure_uuid: randomUUID(),
        measure_value: 1230.5,
      };

      jest.spyOn(service, "handleSubmitImage").mockResolvedValue(responseDto);

      const result = await controller.submitImage(requestDto);
      expect(result).toEqual(responseDto);
      expect(service.handleSubmitImage).toHaveBeenCalledWith(requestDto);
    });
  });
});
