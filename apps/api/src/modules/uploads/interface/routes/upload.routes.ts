// apps/api/src/modules/uploads/interface/routes/upload.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import multer from 'multer';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { uploadLimiter } from '../../../../shared/middleware/rate-limit.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { ALLOWED_UPLOAD_MIME_TYPES } from '../../../../shared/config/constants';
import { UploadService } from '../../infrastructure/UploadService';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if ((ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(AppError.unprocessable('File type is not allowed'));
  },
});

const service = new UploadService();
export const uploadRouter = Router();
uploadRouter.use(authMiddleware);
uploadRouter.use(requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']));

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Subir archivo (imagen, PDF o MP3)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Archivo almacenado
 *       422:
 *         description: Tipo de archivo no permitido
 */
uploadRouter.post(
  '/',
  uploadLimiter,
  upload.single('file'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw AppError.badRequest('A file is required');
    }
    const stored = await service.store({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });
    sendSuccess(res, stored, 201);
  }),
);
