



import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'otps', timestamps: true, paranoid: true })
export class Otp extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare otpHash: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
}
