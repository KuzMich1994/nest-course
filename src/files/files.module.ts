import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Module({
  providers: [FilesService, ErrorHandlerService],
  exports: [FilesService],
})
export class FilesModule {}
