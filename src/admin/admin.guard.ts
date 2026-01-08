import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException('User not logged in');
    }

    if (!req.user.role) {
      throw new UnauthorizedException('Role missing');
    }

    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}

