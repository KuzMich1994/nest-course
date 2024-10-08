import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  constructor(private errorHandlerService: ErrorHandlerService) {}
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = uuid.v4() + `.${file.mimetype?.split('/')[1]}`;
      const filePath = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file?.buffer);

      return fileName;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.errorHandlerService.setCommonError(
        'Произошла ошибка при записи файла',
      );
      this.errorHandlerService.throwError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
