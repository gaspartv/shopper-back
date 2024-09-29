import { Module } from "@nestjs/common";
import { GeminiModule } from "../../providers/gemini/gemini.module";
import { PrismaModule } from "../../providers/prisma/prisma.module";
import { MeasuresRepository } from "./interfaces/measures.repository";
import { MeasuresController } from "./measures.controller";
import { MeasuresPrismaRepository } from "./measures.repository";
import { MeasuresService } from "./measures.service";

@Module({
  imports: [PrismaModule, GeminiModule],
  controllers: [MeasuresController],
  providers: [
    {
      provide: MeasuresRepository,
      useClass: MeasuresPrismaRepository,
    },
    MeasuresService,
  ],
  exports: [],
})
export class MeasuresModule {}
