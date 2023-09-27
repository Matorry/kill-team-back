import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class FilesInterceptor {
  singleFileStore(fileName: string) {
    const storage = multer.diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        callback(null, file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fileName);

    return (req: Request, res: Response, next: NextFunction) => {
      const prevBody = req.body;
      middleware(req, res, next);
      req.body = { ...prevBody, ...req.body };
    };
  }
}
