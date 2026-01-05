import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Order } from '../Orders/order.model';
import { PaymentStatus } from './payment-status.enum';

interface PaymentCreationAttrs {
  orderId: number;
  transactionId: string;
  method: string;
  amount: number;
  currency: string;
  status?: PaymentStatus;
}

@Table({
  tableName: 'payments',
  timestamps: true,
})
export class Payment extends Model<PaymentCreationAttrs> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orderId: number;

  @BelongsTo(() => Order)
  declare order: Order;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare transactionId: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare currency: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
    defaultValue: PaymentStatus.INITIATED,
  })
  declare status: PaymentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare method: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
