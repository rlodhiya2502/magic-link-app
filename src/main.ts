import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // somewhere in your initialization file
  const doubleCsrfOptions = {
    getSecret: () => process.env.CSRF_SECRET || 'defaultSecret',
    cookieName: 'csrfToken',
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: (req) => req.headers['csrf-token'] as string,
  };

  const {
    invalidCsrfTokenError, // This is provided purely for convenience if you plan on creating your own middleware.
    generateToken, // Use this in your routes to generate and provide a CSRF hash, along with a token cookie and token.
    validateRequest, // Also a convenience if you plan on making your own middleware.
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf(doubleCsrfOptions);
  
  app.use(doubleCsrfProtection);

  // Implement Rate limiting
  app.enableCors();
  // Implement Rate limiting
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  // Compression

  // Helmet
  app.use(helmet());

  // CORS
  // Validation
  // Logging
  // Swagger
  // Authentication
  // Authorization
  // Error handling
  // Testing

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
