import { Module } from '@nestjs/common';
import { FileService } from './documentManager.service';
import { FileController } from './documentManager.controller';

@Module({
  controllers: [FileController],
  providers: [FileService],
})
export class MulterModule {}
