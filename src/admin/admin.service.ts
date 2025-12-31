// src/modules/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.model';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}


  //create admin 
  async createAdmin(dto: CreateAdminDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.adminModel.create({ ...dto, password: hashed });
  }

  // get all admins
  async getAllAdmins() {
    return this.adminModel.findAll({ attributes: { exclude: ['password'] } });
  }

   // Get admin by ID
  async getAdminById(id: number) {
    const admin = await this.adminModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }





  // Update admin by ID
  async updateAdmin(id: number,dto: UpdateAdminDto) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) throw new NotFoundException('Admin not found');

    // if password update  
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await admin.update(dto);
    const { password: _, ...safeAdmin } = admin.toJSON();
    return safeAdmin;
  }


  // delete admin 

  async deleteAdmin (id:number  ){
     const admin = await this.adminModel.findByPk(id)

      if (!admin) throw new NotFoundException('Admin not found');

      await admin.destroy();

      return   { message: 'Admin deleted successfully' };



  }





  }







