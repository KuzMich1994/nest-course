import { HttpException, HttpStatus } from '@nestjs/common';
import { FieldError } from '../error-handler/field-error';

export class CustomHttpException extends HttpException {
  constructor(
    private readonly errors: FieldError[],
    private readonly commonError: string,
    status: HttpStatus,
  ) {
    super({ message: commonError, errors }, status);
  }
}
