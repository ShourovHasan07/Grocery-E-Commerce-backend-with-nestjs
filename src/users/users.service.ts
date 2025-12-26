import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Create user
  async createUser(dto: CreateUserDto): Promise<User> {
  const existingUser = await this.userModel.findOne({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new ConflictException('User already exists with this email');
  }

  return this.userModel.create({
    clerkId: dto.clerkId ?? '',
    name: dto.name ?? '',
    email: dto.email,
    password: dto.password ?? '',
    status: dto.status ?? true,
  });
}


  // Get all users
  getAllUsers() {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  // Get user by id
  getUserById(id: number) {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  // Update user
  updateUser(id: number, data: Partial<CreateUserDto>) {
    return this.userModel.update(data, { where: { id }, returning: true });
  }

  // Delete user
  deleteUser(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
