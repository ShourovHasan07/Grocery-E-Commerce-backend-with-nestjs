// src/products/product.model.ts
import { Column, DataType, Model, Table, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare vendor: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare price: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare oldPrice?: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare discount?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare badge?: 'hot' | 'sale' | 'new' | 'best';

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  declare rating: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare reviewCount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare image: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare images?: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare hoverImage?: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare shortDescription: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare additionalInfo?: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare sizes?: string[];

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare stock: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare type?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare manufactureDate?: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare lifeTimeDays?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare sku?: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare tags?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare ingredients?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare warnings?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare suggestedUse?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare packagingInfo?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare deliveryInfo?: string;
}
