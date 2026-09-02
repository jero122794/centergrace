// apps/api/src/modules/ministries/interface/controllers/MinistryController.ts
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { MinistryUseCases } from '../../application/use-cases/MinistryUseCases';

export class MinistryController {
  constructor(private readonly useCases: MinistryUseCases) {}

  list = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    sendSuccess(res, await this.useCases.list());
  };

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    sendSuccess(res, await this.useCases.getById(req.params.id));
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(res, await this.useCases.create(req.user.sub, req.body), 201);
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    sendSuccess(res, await this.useCases.update(req.params.id, req.body));
  };

  members = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    sendSuccess(res, await this.useCases.members(req.params.id));
  };

  stats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    sendSuccess(res, await this.useCases.stats(req.params.id));
  };
}
