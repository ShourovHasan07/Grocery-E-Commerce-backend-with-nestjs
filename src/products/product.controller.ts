import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))


  //update product


  @Put(':id')
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




  @Get()
async findAll() {
  return this.productsService.getAllProducts();
}


@Get(':id')
async findOne(@Param('id') id: string) {
  return this.productsService.getProductById(+id);
}


@Delete(':id')
async remove(@Param('id') id: string) {
  return this.productsService.deleteProduct(+id);
}



}
