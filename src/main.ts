import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("");
  await app.listen(3001);
  // eslint-disable-next-line no-console
  console.log(`Users service running on http://localhost:3001`);
}

bootstrap();
