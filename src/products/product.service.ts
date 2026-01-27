

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
import { Op } from 'sequelize';




@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,

    @Inject('CLOUDINARY')
    private cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('File is required');

    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error: any, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });
  }

  // ================= CRUD =================
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

  async updateProduct(id: number, data: any) {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Product not found');
    return product.update(data);
  }

  async deleteProduct(id: number) {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Product not found');
    await product.destroy();
    return { message: 'Product deleted successfully' };
  }

  // ================= Home Page Sections =================

  // Recently Added Products
  async getRecentlyAdded(limit: number = 10): Promise<Product[]> {
    return this.productModel.findAll({
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  // Top Selling Products
  async getTopSelling(limit: number = 10): Promise<Product[]> {
    return this.productModel.findAll({
      order: [['soldCount', 'DESC']],
      limit,
    });
  }

  
  // Deals of the Day (products with discount > 0)
async getDealsOfTheDay(limit: number = 10): Promise<Product[]> {
  return this.productModel.findAll({
    where: {
      discount: {
        [Op.gt]: 0,   // Discount obesily greater than 0 
      },
    },
    order: [['discount', 'DESC']],
    limit,
  });
}


  // Trending Products (popular views)
  async getTrending(limit: number = 10): Promise<Product[]> {
    return this.productModel.findAll({
      order: [['views', 'DESC']],
      limit,
    });
  }

  // Popular Products (rating + reviews)
  async getPopular(limit: number = 10): Promise<Product[]> {
    return this.productModel.findAll({
      order: [
        ['rating', 'DESC'],
        ['reviewCount', 'DESC'],
      ],
      limit,
    });
  }
}
