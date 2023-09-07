import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CoreModule } from './core.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // json
    consumer.apply(JsonBodyMiddleware).forRoutes('*');
    // logger
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
