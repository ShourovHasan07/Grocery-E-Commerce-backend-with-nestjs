// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './product.service';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ===================== CRUD =====================

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    // যদি file থাকে → Cloudinary upload
    if (file) {
      const imageUrl = await this.productsService.uploadImageToCloudinary(file);
      dto.image = imageUrl;
    }
    return this.productsService.createProduct(dto);
  }

  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateProductDto>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    if (file) {
      const imageUrl = await this.productsService.uploadImageToCloudinary(file);
      data.image = imageUrl;
    }
    return this.productsService.updateProduct(id, data);
  }

  @Delete('delete/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  // ================= Home Page Sections =================

  @Get('recently-added')
  getRecentlyAdded(@Query('limit') limit: string): Promise<Product[]> {
    return this.productsService.getRecentlyAdded(Number(limit) || 10);
  }

  @Get('top-selling')
  getTopSelling(@Query('limit') limit: string): Promise<Product[]> {
    return this.productsService.getTopSelling(Number(limit) || 10);
  }

  @Get('deals-of-the-day')
  getDealsOfTheDay(@Query('limit') limit: string): Promise<Product[]> {
    return this.productsService.getDealsOfTheDay(Number(limit) || 10);
  }

  @Get('trending')
  getTrending(@Query('limit') limit: string): Promise<Product[]> {
    return this.productsService.getTrending(Number(limit) || 10);
  }

  @Get('popular')
  getPopular(@Query('limit') limit: string): Promise<Product[]> {
    return this.productsService.getPopular(Number(limit) || 10);
  }
}
