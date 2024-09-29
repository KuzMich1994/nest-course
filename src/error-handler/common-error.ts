import { FieldError } from './field-error';

export class CommonError {
  constructor(
    public message: string,
    public fieldErrors: FieldError[],
  ) {}
}
