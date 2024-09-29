import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { MeasuresModule } from "./module/measures/measures.module";
import { GeminiModule } from "./providers/gemini/gemini.module";
import { ValidationExceptionFilter } from "./utils/validation-exception-filter";

@Module({
  imports: [
    MeasuresModule,
    GeminiModule,
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
