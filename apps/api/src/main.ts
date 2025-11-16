import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

export const BASE_VERSION = '1';

const PORT: number = +(process.env['PORT'] || 5000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      exposedHeaders: ['X-Stream-Type', 'ETag', 'Content-Disposition'],
      origin: (reqOrigin, callback) => {
        callback(null, reqOrigin);
      },
    },
  });

  app.enableShutdownHooks();

  if (process.env.NODE_ENV === 'production') {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1); // Trust first proxy
    expressApp.disable('x-powered-by'); // Hide information about the server
  }

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // app.use(prismaSessionMiddleware);
  // app.use(passport.initialize());
  // app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('Edgar API Documentation')
    .setDescription(`Ask Edgar API v${BASE_VERSION}`)
    .setVersion(`${BASE_VERSION}`)
    .addServer('http://localhost:5010', 'Development')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description: 'Basic HTTP authentication',
      },
      'basic'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return methodKey;
    },
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT);

  Logger.log(`🚀 API V${BASE_VERSION} is running on: http://localhost:${PORT}`);
}

bootstrap();
