import { HttpStatus, Injectable } from '@nestjs/common';
import { FieldError } from './field-error';
import { CommonError } from './common-error';
import { CustomHttpException } from '../http-exception/custom-http-exception';

@Injectable()
export class ErrorHandlerService {
  private fieldErrors: FieldError[] = [];
  private commonError: string;

  public addFieldError(field: string, message: string): void {
    this.fieldErrors.push(new FieldError({ [field]: message }));
  }

  public setCommonError(message: string): void {
    this.commonError = message;
  }

  public getErrors(): CommonError {
    return new CommonError(this.commonError, this.fieldErrors);
  }

  public throwError(status: HttpStatus): never {
    throw new CustomHttpException(this.fieldErrors, this.commonError, status);
  }

  public clearErrors(): void {
    this.fieldErrors = [];
    this.commonError = null;
  }
}
