import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { ResponseMeasureDto } from "./dtos/response-measure.dto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { MeasuresRepository } from "./interfaces/measures.repository";
import { Measure } from "./measures.entity";

@Injectable()
export class MeasuresPrismaRepository implements MeasuresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: Measure): Promise<ResponseMeasureDto> {
    return await this.prisma.measure.upsert({
      where: { measure_uuid: entity.id },
      update: entity.get(),
      create: entity.get(),
    });
  }

  async alreadyExists(
    measure_datetime: Date,
    measure_type: MeasureTypeEnum,
    customer_code: string,
  ): Promise<boolean> {
    const currentDate = new Date(measure_datetime);

    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const startOfPreviousMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
      1,
    );

    const endOfPreviousMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const existingMeasure = await this.prisma.measure.findFirst({
      where: {
        measure_datetime: {
          gte: startOfPreviousMonth,
          lte: endOfPreviousMonth,
        },
        measure_type,
        customer_code,
      },
    });

    return !!existingMeasure;
  }

  async findByMeasureId(measure_uuid: string): Promise<ResponseMeasureDto> {
    return await this.prisma.measure.findFirst({
      where: { measure_uuid },
    });
  }

  async list(
    customer_code: string,
    measure_type: MeasureTypeEnum,
  ): Promise<ResponseMeasureDto[]> {
    return await this.prisma.measure.findMany({
      where: {
        customer_code,
        measure_type,
      },
    });
  }
}
