import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from '../users/user.model';


export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'shourov123',
  database: 'grocery_ecommerce',

  models: [User,],

  autoLoadModels: true,
  synchronize: true, //  when  you go to  production change it to  false  
  logging: true,
};
