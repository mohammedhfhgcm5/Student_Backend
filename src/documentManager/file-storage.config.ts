// file-storage.config.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export const customStorage = diskStorage({
  destination: (req, file, cb) => {
    // Default paths based on file type
    let basePath = './uploads/file';

    if (file.mimetype.startsWith('image/')) {
      basePath = './uploads/images';
    } else if (file.mimetype.startsWith('video/')) {
      basePath = './uploads/videos';
    }

    const folder = req.body?.filename || req.query?.filename;


    if (folder) {
    basePath = join(basePath, folder);
  }


    console.log(req.body.img);
  

    // Ensure directory exists
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    cb(null, basePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '-'+ Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});
