// admin.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    // JWT Strategy থেকে req.user আসবে
    if (!req.user) {
      throw new UnauthorizedException('User not logged in');
    }

    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
