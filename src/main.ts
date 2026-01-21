import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('training-plan');

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/training-plan`);
}

bootstrap()
  .then(() => {
    console.log('Bootstrap completed successfully');
  })
  .catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1); // Exit with error code 1 if startup fails
  });