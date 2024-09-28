import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
  );

  const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle("Shopper")
      .setDescription("API para facilitar a coleta de informação e leitura individualizada do consumo de água e gás.")
      .setVersion("1.0")
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/json",
  });

  await app.listen(3333, "0.0.0.0", () => {
    Logger.log("3333", "StartedPort");
  });
}
bootstrap().then(r => r);
