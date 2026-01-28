// file.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './documentManager.service';
import { customStorage } from './file-storage.config';
import { DeleteFileDto } from './dto/multer.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // ✅ Upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: customStorage }))
  async addFile(@UploadedFile() file: Express.Multer.File ,@Query('filename') img: string,) {
    return this.fileService.addFile(file);
  }

  // ✅ Upload multiple files
  @Post('upload-multi')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: customStorage }))
  async addMultiFiles(@UploadedFiles() files: Express.Multer.File[] , @Query('filename') img: string,) {
    return this.fileService.addMultiFiles(files);
  }

  // ✅ Delete file by URL
  @Delete('delete')
  async deleteFile(@Body() dto: DeleteFileDto) {
    return this.fileService.deleteFileByUrl(dto.url);
  }



   @Delete('delete-multi')
  async deleteMultiFiles(@Body('fileUrls') fileUrls: string[]) {
    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new BadRequestException('fileUrls must be a non-empty array');
    }

    return this.fileService.deleteFilesByUrls(fileUrls);
  }
}
