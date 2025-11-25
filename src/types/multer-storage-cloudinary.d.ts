declare module 'multer-storage-cloudinary' {
  import type { Request } from 'express';
  import type { StorageEngine } from 'multer';
  import type { UploadApiOptions } from 'cloudinary';

  type CloudinaryInstance = typeof import('cloudinary').v2;

  interface CloudinaryStorageOptions {
    cloudinary: CloudinaryInstance;
    params?:
      | UploadApiOptions
      | ((req: Request, file: Express.Multer.File) => UploadApiOptions | Promise<UploadApiOptions>);
  }

  export default class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);

    _handleFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error?: Error | null, info?: Partial<Express.Multer.File>) => void
    ): void;

    _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error | null) => void): void;
  }
}

