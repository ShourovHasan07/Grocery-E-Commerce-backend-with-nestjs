import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    console.log('REQ USER:', req.user);

    // Only allow ADMIN or SUPER_ADMIN
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    return allowedRoles.includes(req.user?.role);
  }
}
