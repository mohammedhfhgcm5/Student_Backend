// file.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    addFile(file: Express.Multer.File) {

       const relativePath = file.destination.split('uploads')[1];

      // نستبدل \ بـ /
      const realpath = relativePath.replace(/\\/g, '/');

   
     
      
      return {
        message: 'File uploaded successfully',
        filename: file.filename,
        url:`/uploads${realpath}/${file.filename}`  ,
      };
    }

 addMultiFiles(files: Express.Multer.File[]) {
  return {
    message: 'Files uploaded successfully',
    files: files.map((file) => {
      // نجهز المسار
      let relativePath = file.destination.split('uploads')[1];

      // نستبدل \ بـ /
      relativePath = relativePath.replace(/\\/g, '/');

      return {
        filename: file.filename,
        url: `/uploads${relativePath}/${file.filename}`,
      };
    }),
  };
}


  deleteFileByUrl(fileUrl: string) {
    const filename = path.basename(fileUrl);
    const dirPart = fileUrl.split('/')[2]; // "images", "videos", "other"
    const filePath = path.join(this.uploadDir, dirPart, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    fs.unlinkSync(filePath);
    return { message: 'File deleted successfully', filename };
  }



deleteFilesByUrls(fileUrls: string[]) {
  const deleted: string[] = [];
  const notFound: string[] = [];

  for (const fileUrl of fileUrls) {
    const filename = path.basename(fileUrl);

    // نجيب الجزء من المسار بعد "/uploads/"
    const relativePath = fileUrl.split('/uploads/')[1];
    if (!relativePath) {
      notFound.push(fileUrl);
      continue;
    }

    const filePath = path.join(this.uploadDir, relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted.push(filename);
    } else {
      notFound.push(fileUrl);
    }
  }

  return {
    message: 'Delete process completed',
    deleted,
    notFound,
  };
}




}
