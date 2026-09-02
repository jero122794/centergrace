// apps/api/src/shared/utils/app-error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly details?: unknown;

  constructor(statusCode: number, error: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, 'Bad Request', message, details);
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(401, 'Unauthorized', message);
  }

  static forbidden(message = 'Insufficient permissions'): AppError {
    return new AppError(403, 'Forbidden', message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, 'Not Found', message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, 'Conflict', message);
  }

  static unprocessable(message: string, details?: unknown): AppError {
    return new AppError(422, 'Unprocessable Entity', message, details);
  }
}
