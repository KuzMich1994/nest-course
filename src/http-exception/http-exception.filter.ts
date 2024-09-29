import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

@Catch(HttpException)
export class HttpExceptionFilter extends CustomHttpException {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    let errors: Record<string, string> = {};

    const responseBody = exception.getResponse();
    console.log(responseBody);
    responseBody['errors']?.forEach((error) => {
      console.log(error);
      errors = { ...errors, ...error?.errors };
    });
    response.status(status).json({
      status: status,
      result: {
        commonError: responseBody['message'] ?? undefined,
        errors: Object.entries(errors).length > 0 ? errors : undefined,
      },
    });
  }
}
