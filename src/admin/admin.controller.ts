// src/modules/admin/admin.controller.ts
import { Controller, Post, Body, Get, UseGuards, Param,Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  create(@Body()  dto: CreateAdminDto ) {
    return this.adminService.createAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.adminService.getAllAdmins();
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.getAdminById(+id);
  
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
   @Put(':id')

  update(@Param('id') id: string, @Body() dto: UpdateAdminDto  )
  
  {
    return this.adminService.updateAdmin(+id,dto);
  
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
   @Delete(':id')
  remove(@Param('id') id: string,  ) {
    return this.adminService.deleteAdmin(+id);  
  
  }





  



}
