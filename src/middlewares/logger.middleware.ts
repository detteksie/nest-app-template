import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new ConsoleLogger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.verbose(`Request [${req.method}] ${req.url}`, 'Middleware');

    next();
  }
}
