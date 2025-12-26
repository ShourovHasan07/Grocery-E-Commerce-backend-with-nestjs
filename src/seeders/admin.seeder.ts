import { Admin } from '../admin/admin.model';
import * as bcrypt from 'bcrypt';

export async function seedAdmin() {
  const existing = await Admin.findOne({
    where: { email: 'admin@carrental.com' },
  });

  if (!existing) {
    const hash = await bcrypt.hash('123456', 10); // password hash

    await Admin.create({
      name: 'Super Admin',
      email: 'admin@grocery.com',
      password: hash,
      role: 'SUPER_ADMIN',
      status: true,
    } as any); // <-- type ignore

    console.log('  Super Admin seeded');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}
