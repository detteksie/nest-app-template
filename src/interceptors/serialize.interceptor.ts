import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private Dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return plainToClass(this.Dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize<T>(Dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(Dto));
}
