import { Controller, Post, Body, Get, UseGuards, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt.guard';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';


// here problem with guard
@UseGuards(AdminJwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Get()
  findAll() {
    return this.adminService.getAllAdmins();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getAdminById(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAdmin(id);
  }
}
