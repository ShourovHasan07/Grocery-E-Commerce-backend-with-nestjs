// order-item.model.ts
import { Model, Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from '../products/product.model';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderItemCreationAttributes extends Omit<OrderItemAttributes, 'id'> {}

@Table({ tableName: 'order_items' })
export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
 declare id: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @Column
  productId: number;

  @Column
  name: string;

  @Column(DataType.FLOAT)
  price: number;

  @Column
  quantity: number;

  @Column(DataType.FLOAT)
  subtotal: number;
}
