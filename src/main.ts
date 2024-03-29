import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { Request } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // hidden server info
  app.disable('x-powered-by');
  // whitelist - dtoに含まないものを排除
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // enableCors - 接続したいフロントエンドのドメインを許可する
  app.enableCors({
    // cookieで処理をするためcredentialsをtrueにしている
    credentials: true,
    origin: ['http://localhost:3000', 'https://gamers-board.vercel.app'],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: { httpOnly: true, sameSite: 'none', secure: true },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(3005);
}
bootstrap();
