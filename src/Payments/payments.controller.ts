// src/modules/payments/payments.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

interface InitPaymentDto {
  orderId: number;
}

interface TransactionDto {
  tran_id: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  //  Initiate Payment → returns SSLCommerz redirect URL
  @Post('init')
  async init(@Body() body: InitPaymentDto) {
    return this.paymentsService.initiatePayment(body.orderId);
  }

  //  Payment Success Callback
  @Post('success')
  async success(@Body() body: TransactionDto, @Req() req) {
    return this.paymentsService.handleSuccess(body.tran_id);
  }

  //  Payment Fail Callback
  @Post('fail')
  async fail(@Body() body: TransactionDto) {
    return this.paymentsService.handleFail(body.tran_id);
  }

  //  Payment Cancel Callback
  @Post('cancel')
  async cancel(@Body() body: TransactionDto) {
    return this.paymentsService.handleCancel(body.tran_id);
  }
}
