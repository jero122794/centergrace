// apps/api/src/modules/uploads/infrastructure/UploadService.ts
import { mkdir, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  ALLOWED_UPLOAD_MIME_TYPES,
  PRESIGNED_URL_TTL_SECONDS,
} from '../../../shared/config/constants';
import { env } from '../../../shared/config/env';
import { AppError } from '../../../shared/utils/app-error';

const MIME_TO_EXT: Record<(typeof ALLOWED_UPLOAD_MIME_TYPES)[number], string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'audio/mpeg': '.mp3',
};

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const UPLOADS_DIR = resolve(process.cwd(), 'uploads');

export interface StoredUpload {
  url: string;
  key: string;
  mimeType: string;
  size: number;
  storage: 's3' | 'local';
}

/**
 * Stores an uploaded buffer on S3 when credentials exist, otherwise on local disk.
 */
export class UploadService {
  private readonly s3: S3Client | null;

  constructor() {
    this.s3 = this.isS3Configured()
      ? new S3Client({
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          },
        })
      : null;
  }

  async store(file: { buffer: Buffer; mimetype: string; originalname: string }): Promise<StoredUpload> {
    this.assertAllowed(file);
    const processed = IMAGE_MIME.has(file.mimetype) ? await this.processImage(file.buffer) : file.buffer;
    const extension = MIME_TO_EXT[file.mimetype as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number]];
    const filename = `${uuid()}${extension}`;
    const key = `uploads/${filename}`;
    if (this.s3) {
      return this.storeOnS3(key, processed, file.mimetype);
    }
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(resolve(UPLOADS_DIR, filename), processed);
    return {
      url: `/uploads/${filename}`,
      key,
      mimeType: file.mimetype,
      size: processed.byteLength,
      storage: 'local',
    };
  }

  private async storeOnS3(key: string, body: Buffer, mimeType: string): Promise<StoredUpload> {
    if (!this.s3) {
      throw AppError.unprocessable('S3 is not configured');
    }
    await this.s3.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }),
      { expiresIn: PRESIGNED_URL_TTL_SECONDS },
    );
    return { url, key, mimeType, size: body.byteLength, storage: 's3' };
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer).rotate().resize({ width: 1920, withoutEnlargement: true }).toBuffer();
    } catch {
      throw AppError.unprocessable('Image could not be processed');
    }
  }

  private assertAllowed(file: { mimetype: string; originalname: string }): void {
    const mimeAllowed = (ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(file.mimetype);
    const extension = extname(file.originalname).toLowerCase();
    const extAllowed = (ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(extension);
    if (!mimeAllowed || !extAllowed) {
      throw AppError.unprocessable('File type is not allowed');
    }
  }

  private isS3Configured(): boolean {
    return env.AWS_ACCESS_KEY_ID.length > 0 && env.AWS_SECRET_ACCESS_KEY.length > 0 && env.AWS_S3_BUCKET.length > 0;
  }
}
