import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { OrderItem } from './order-item.model';
import { OrderStatus } from './order-status.enum';

// Interface for attributes
export interface OrderAttributes {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
}

// Interface for creation attributes
export interface OrderCreationAttributes
  extends Omit<OrderAttributes, 'id'> {}

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalPrice: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  declare status: OrderStatus;

  // ✅ Relation with OrderItem
  @HasMany(() => OrderItem)
  declare items?: OrderItem[];

  // ✅ Timestamps (optional but industry standard)
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
