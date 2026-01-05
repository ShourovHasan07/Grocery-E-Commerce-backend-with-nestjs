// src/modules/payments/payments.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  //  Initiate Payment → returns SSLCommerz redirect URL
  @Post('init')
  async init(@Body() body: { orderId: number; amount: number }) {
    return this.paymentsService.initiatePayment(body.orderId, body.amount);
  }

  //  Payment Success Callback
  @Post('success')
  async success(@Body() body: { tran_id: string }, @Req() req) {
    //const userId = req.user.id;
    return this.paymentsService.handleSuccess(body.tran_id,);
  }

  //  Payment Fail Callback
  @Post('fail')
  async fail(@Body() body: { tran_id: string }) {
    return this.paymentsService.handleFail(body.tran_id);
  }

  //  Payment Cancel Callback
  @Post('cancel')
  async cancel(@Body() body: { tran_id: string }) {
    return this.paymentsService.handleCancel(body.tran_id);
  }
}
