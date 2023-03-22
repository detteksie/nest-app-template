import { Injectable, NestMiddleware } from '@nestjs/common';
import e, { Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    e.raw({ type: '*/*' })(req, res, next);
  }
}
