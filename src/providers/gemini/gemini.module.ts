import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";

@Module({
  imports: [],
  controllers: [],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
