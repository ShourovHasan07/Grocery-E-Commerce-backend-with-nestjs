import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UploadApiResponse, v2 as CloudinaryType } from 'cloudinary';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,

    @Inject('CLOUDINARY')
    private cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log('📸 Uploading:', file.originalname);

    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error: any, result: UploadApiResponse) => {
          if (error) {
            console.error(' Cloudinary error:', error);
            return reject(error);
          }

          console.log(' Cloudinary success:', result.secure_url);
          resolve(result.secure_url);
        },
      );

      stream.end(file.buffer);
    });
  }

  async createProduct(dto: CreateProductDto) {
    return this.productModel.create(dto as any);
  }

  async getAllProducts() {
    return this.productModel.findAll();
  }

  async getProductById(id: number) {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Product not found');
    await product.destroy();
    return { message: 'Product deleted successfully' };
  }


  // updtare  product 


  async updateProduct(id: number, data: any) {
  const product = await this.productModel.findByPk(id);

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return product.update(data);
}


}
