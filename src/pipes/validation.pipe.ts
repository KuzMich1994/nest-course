import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);
    const errorService = new ErrorHandlerService();

    if (errors?.length) {
      errors.forEach((error) => {
        errorService.addFieldError(
          error.property,
          Object.values(error.constraints).filter(Boolean),
        );
      });

      errorService.throwError(HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
