import { UploadedFile } from 'express-fileupload';
import { v4 } from 'uuid';

export const uploadFile = (uploadedFile: UploadedFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = v4() + '_' + uploadedFile.name;
    const destination = uploadedFile.mimetype.startsWith('image/') ? 'public/imgs/' : 'public/docs/';

    uploadedFile.mv(destination + fileName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(destination + fileName);
      }
    });
  });
};
