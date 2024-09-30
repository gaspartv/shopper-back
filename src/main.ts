import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import * as express from "express";
import { join } from "path";
import { AppModule } from "./app.module";
import { env } from "./configs/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  app.use("/", express.static(join(__dirname, "..", "tmp")));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Shopper")
    .setDescription(
      "API para facilitar a coleta de informação e leitura individualizada do consumo de água e gás.",
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/json",
  });

  await app.listen(Number(env.PORT), "0.0.0.0", () => {
    Logger.log(env.PORT, "StartedPort");
  });
}
bootstrap().then((r) => r);
