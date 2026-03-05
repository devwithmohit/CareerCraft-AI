// @ts-nocheck
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
const compression = require("compression");
const helmet = require("helmet");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix — frontend calls /api/*
  app.setGlobalPrefix('api', {
    exclude: ['/', '/status', '/version', '/docs', '/docs/*path'],
  });

  // Security
  app.use(typeof helmet === 'function' ? helmet() : helmet.default());
  app.use(typeof compression === 'function' ? compression() : compression.default());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("CareerCraft AI API")
    .setDescription("AI-powered career management platform")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(` API running on http://localhost:${port}`);
  console.log(`Docs available at http://localhost:${port}/docs`);
}
bootstrap();
