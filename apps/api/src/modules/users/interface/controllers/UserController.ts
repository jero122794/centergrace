// apps/api/src/modules/users/interface/controllers/UserController.ts
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendPaginated, sendSuccess } from '../../../../shared/utils/http';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { ChangeUserRoleUseCase } from '../../application/use-cases/ChangeUserRoleUseCase';
import { ToggleUserActiveUseCase } from '../../application/use-cases/ToggleUserActiveUseCase';
import { CreateStudentUseCase } from '../../application/use-cases/CreateStudentUseCase';
import { AppError } from '../../../../shared/utils/app-error';

export class UserController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly changeRole: ChangeUserRoleUseCase,
    private readonly toggleActive: ToggleUserActiveUseCase,
    private readonly createStudent: CreateStudentUseCase,
  ) {}

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isActive =
      req.query.isActive === undefined ? undefined : req.query.isActive === 'true';
    const result = await this.listUsers.execute({
      role: req.query.role as never,
      isActive,
      search: req.query.search as string | undefined,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const actor = this.requireActor(req);
    const user = await this.updateUser.execute(actor, req.params.id, req.body);
    sendSuccess(res, user);
  };

  role = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const actor = this.requireActor(req);
    const user = await this.changeRole.execute(actor, req.params.id, req.body.role);
    sendSuccess(res, user, 200, 'Role updated');
  };

  toggle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const actor = this.requireActor(req);
    const user = await this.toggleActive.execute(actor, req.params.id);
    sendSuccess(res, user);
  };

  createStudentHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const actor = this.requireActor(req);
    const user = await this.createStudent.execute(actor.id, req.body);
    sendSuccess(res, user, 201, 'Student created');
  };

  private requireActor(req: AuthenticatedRequest) {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    return { id: req.user.sub, role: req.user.role };
  }
}
