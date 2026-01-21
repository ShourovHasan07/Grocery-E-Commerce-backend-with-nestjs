import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize';

// 🔹 Plain attributes (DB fields only)
export interface UserAttributes {
  id: number;
  clerkId?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  password?: string | null;
  status?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 🔹 Attributes needed when creating a user
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'clerkId' | 'name' | 'password' | 'phone' | 'status' | 'deletedAt' | 'createdAt' | 'updatedAt'
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
    defaultValue: null, // empty string নয়, null
  })
  declare clerkId: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: null,
  })
  declare name: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true, // nullable
    unique: true,
    validate: { isEmail: true },
    defaultValue: null,
  })
  declare email: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true, // nullable
    unique: true,
    defaultValue: null,
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  })
  declare password: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare status: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}
