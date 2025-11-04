import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./exception-filter/http-exeption.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
