// src/cart/cart.model.ts
import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'carts' })
export class Cart extends Model<Cart> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  declare totalPrice: number;

  @HasMany(() => CartItem, { as: 'items', foreignKey: 'cartId' })
  declare items?: CartItem[];
}




@Table({ tableName: 'cart_items' })
export class CartItem extends Model<CartItem> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare cartId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare productId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.STRING })
  declare image: string;

  @BelongsTo(() => Cart)
  declare cart?: Cart;
}
