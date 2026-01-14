import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminGuard } from 'src/admin/admin.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('admin/products')

export class ProductAdminController {


     constructor(private readonly productsService: ProductsService) {}

      @Post('create')
       @UseGuards(AuthGuard('jwt'), AdminGuard) // JWT + Admin guard
        @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('BODY:', body);
    console.log('FILE:', file?.originalname);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.productsService.uploadImageToCloudinary(file);
    console.log('CLOUDINARY URL:', imageUrl);

    body.image = imageUrl;

    return this.productsService.createProduct(body);
  }



// UPDATE PRODUCT
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() body: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const imageUrl = await this.productsService.uploadImageToCloudinary(file);
      body.image = imageUrl;
    }

    return this.productsService.updateProduct(+id, body);
  }
}