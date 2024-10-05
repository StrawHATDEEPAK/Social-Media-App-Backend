import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".gif" &&
      ext !== ".mp4" &&
      ext !== "mkv" &&
      ext !== "webm"
    ) {
      callback(null, false);
      return;
    }
    callback(null, true);
  },
});
