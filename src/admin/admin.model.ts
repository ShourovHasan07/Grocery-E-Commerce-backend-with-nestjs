import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'admins',
  timestamps: true,
})
export class Admin extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING(150))
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'ADMIN',
  })
  declare role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare status: boolean;
}
