import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';

const RoleGuard = (roles: UserRole): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: User = request.user;
      return user?.role === roles;
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
