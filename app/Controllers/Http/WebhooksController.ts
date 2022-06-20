import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IPaymentWebhook } from 'App/Interfaces/IPaymentWebhook';
import { ITransferWebhook } from 'App/Interfaces/ITransferWebhook';
import Payment from 'App/Models/Payment';

export default class WebhooksController {
  public async index({ request, response }: HttpContextContract) {
    const event = request.input('event')

    console.log(event)

    switch (event) {
      // PAYMENT
      case "PAYMENT_CREATED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_UPD ATED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_CONFIRMED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_RECEIVED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_OVERDUE":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_DELETED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_RESTORED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_REFUNDED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_RECEIVED_IN_CASH_UNDONE":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_CHARGEBACK_REQUESTED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_CHARGEBACK_DISPUTE":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_AWAITING_CHARGEBACK_REVERSAL":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_DUNNING_RECEIVED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_DUNNING_REQUESTED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_BANK_SLIP_VIEWED":
          this.handlePayment(request.input('payment'))
          break;
      case "PAYMENT_CHECKOUT_VIEWED":
          this.handlePayment(request.input('payment'))
          break;
      // TRANSFER
      case "TRANSFER_CREATED":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_PENDING":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_IN_BANK_PROCESSING":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_BLOCKED":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_DONE":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_FAILED":
          this.handleTransfer(request.input('transfer'))
          break;
      case "TRANSFER_CANCELLED":
          this.handleTransfer(request.input('transfer'))
          break;
    }

    response.status(200)
    return
  }

  private async handlePayment(data: IPaymentWebhook) {
    console.log(data);

    const payment = Payment.findByOrFail('reference', data.id);

    console.log(payment);
  }

  private async handleTransfer(data: ITransferWebhook) {
    console.log(data);

    
  }
}
