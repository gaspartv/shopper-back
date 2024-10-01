import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { ResponseMeasureDto } from "./dtos/response-measure.dto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { Measure } from "./measures.entity";
import { MeasuresPrismaRepository } from "./measures.repository";

const mockPrismaService = {
  measure: {
    upsert: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
};

describe("MeasuresPrismaRepository", () => {
  let repository: MeasuresPrismaRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasuresPrismaRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<MeasuresPrismaRepository>(MeasuresPrismaRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("save", () => {
    it("should call prisma measure upsert", async () => {
      const entity = new Measure();
      entity.create = {
        measure_datetime: new Date(),
        measure_type: MeasureTypeEnum.WATER,
        image_url: "http://localhost:3333/image.png",
        measure_value: 100,
        customer_code: "customer1",
      };

      await repository.save(entity);

      expect(prismaService.measure.upsert).toHaveBeenCalledWith({
        where: { measure_uuid: entity.id },
        update: entity.toJson,
        create: entity.toJson,
      });
    });
  });

  describe("alreadyExists", () => {
    it("should return true if a measure exists in the previous month", async () => {
      const measureDatetime = new Date();
      const measureType = MeasureTypeEnum.GAS;
      const customerCode = "customer1";

      mockPrismaService.measure.findFirst.mockResolvedValueOnce({});

      const result = await repository.alreadyExists(
        measureDatetime,
        measureType,
        customerCode,
      );

      expect(result).toBe(true);
    });

    it("should return false if no measure exists in the previous month", async () => {
      const measureDatetime = new Date();
      const measureType = MeasureTypeEnum.GAS;
      const customerCode = "customer1";

      mockPrismaService.measure.findFirst.mockResolvedValueOnce(null);

      const result = await repository.alreadyExists(
        measureDatetime,
        measureType,
        customerCode,
      );

      expect(result).toBe(false);
    });
  });

  describe("findByMeasureId", () => {
    it("should return a measure by measure_uuid", async () => {
      const measureUuid = "test-uuid";
      const mockResponse = {} as ResponseMeasureDto;

      mockPrismaService.measure.findFirst.mockResolvedValueOnce(mockResponse);

      const result = await repository.findByMeasureId(measureUuid);

      expect(result).toBe(mockResponse);
      expect(prismaService.measure.findFirst).toHaveBeenCalledWith({
        where: { measure_uuid: measureUuid },
      });
    });
  });

  describe("list", () => {
    it("should return a list of measures by customer_code and measure_type", async () => {
      const customerCode = "customer1";
      const measureType = MeasureTypeEnum.GAS;
      const mockResponse = [{}] as ResponseMeasureDto[];

      mockPrismaService.measure.findMany.mockResolvedValueOnce(mockResponse);

      const result = await repository.list(customerCode, measureType);

      expect(result).toBe(mockResponse);
      expect(prismaService.measure.findMany).toHaveBeenCalledWith({
        where: { customer_code: customerCode, measure_type: measureType },
      });
    });
  });
});
