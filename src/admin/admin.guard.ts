// src/modules/admin/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    // 🔹 Debug: Check what is inside req.user
    console.log('REQ USER:', req.user);

    // Only allow access if type is 'ADMIN' (or adjust for SUPER_ADMIN)
    return req.user?.type === 'ADMIN' || req.user?.type === 'SUPER_ADMIN';
  }
}
