import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize';


// 🔹 Plain attributes (DB fields only)
export interface UserAttributes {
  id: number;
  clerkId?: string;
  name?: string;
  email: string;
  password?: string;
  status?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 🔹 Attributes needed when creating a user
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'clerkId' | 'name' | 'password' | 'status' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;





@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: '',
  })
  declare clerkId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: '',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: '',
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare status: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date;
}
