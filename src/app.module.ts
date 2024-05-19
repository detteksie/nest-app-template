import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController, AuthenticationController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TasksModule } from './modules/tasks/tasks.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CoreModule, UsersModule, TasksModule, UploadsModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Logger
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
