// src/modules/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col } from 'sequelize';
import { Order } from '../Orders/order.model';
import { User } from '../users/user.model';
import { Product } from '../products/product.model';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}

  /** Total Sales:   PAID  */
  async getTotalSales(): Promise<number> {
    return await this.orderModel.count({ where: { status: 'PAID' } });
  }

  /** Total Income: PAID orders  */
  async getTotalIncome(): Promise<number> {
    const income: any = await this.orderModel.findOne({
      attributes: [[fn('SUM', col('totalPrice')), 'totalIncome']],
      where: { status: 'PAID' },
      raw: true,
    });
    return parseFloat(income.totalIncome ?? 0);
  }

  /** Total Orders:  */
  async getTotalOrders(): Promise<number> {
    return await this.orderModel.count();
  }

  /** Total Users */
  async getTotalUsers(): Promise<number> {
    return await this.userModel.count();
  }

  /** Total Products */
  async getTotalProducts(): Promise<number> {
    return await this.productModel.count();
  }



   /**  Total Income */
  async getThisMonthIncome(): Promise<number> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // month 1st day 
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // next month+1 1st day

    // Aggregation: SUM(totalPrice)
    const income: any = await this.orderModel.findOne({
      attributes: [[fn('SUM', col('totalPrice')), 'totalIncome']],
      where: {
        status: 'PAID', // only  paid orders
        createdAt: {
          [Op.gte]: startOfMonth, // 
          [Op.lt]: startOfNextMonth, // 
        },
      },
      raw: true,
    });

    return parseFloat(income.totalIncome ?? 0);
  }










  /** Dashboard Stats  */
  async getDashboardStats() {
    const [totalSales, totalIncome, totalOrders, totalUsers, totalProducts,getThisMonthIncome] =
      await Promise.all([
        this.getTotalSales(),
        this.getTotalIncome(),
        this.getTotalOrders(),
        this.getTotalUsers(),
        this.getTotalProducts(),
        this.getThisMonthIncome(),
      ]);

    return {
      totalSales,
      totalIncome,
      totalOrders,
      totalUsers,
      totalProducts,
      getThisMonthIncome,
    };
  }
}
