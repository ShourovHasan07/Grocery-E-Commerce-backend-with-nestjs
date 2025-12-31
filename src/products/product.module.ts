import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { CloudinaryProvider } from '../config/cloudinary.provider';
import { ProductAdminController } from './product.admin.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductsController,ProductAdminController],
  providers: [ProductsService, CloudinaryProvider],
})
export class ProductModule {}
