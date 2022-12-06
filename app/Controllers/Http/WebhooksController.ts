import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PaymentWebhook } from 'App/Interfaces/IPaymentWebhook'
import { TransferWebhook } from 'App/Interfaces/ITransferWebhook'
import Payment from 'App/Models/Payment'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import Transfer from 'App/Models/Transfer'

export default class WebhooksController {
  public async index({ request, response }: HttpContextContract) {
    const event = request.input('event')

    await Database.insertQuery().table('webhooks').insert({
      event: event,
      payload: request.body(),
      created_at: DateTime.now().toISO(),
    })

    switch (event) {
      // PAYMENT
      case 'PAYMENT_CREATED':
      case 'PAYMENT_UPDATED':
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED':
        await this.notifyPaymentReceived(request.input('payment'))
        break
      case 'PAYMENT_OVERDUE':
      case 'PAYMENT_DELETED':
      case 'PAYMENT_RESTORED':
      case 'PAYMENT_REFUNDED':
      case 'PAYMENT_RECEIVED_IN_CASH_UNDONE':
      case 'PAYMENT_CHARGEBACK_REQUESTED':
      case 'PAYMENT_CHARGEBACK_DISPUTE':
      case 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL':
      case 'PAYMENT_DUNNING_RECEIVED':
      case 'PAYMENT_DUNNING_REQUESTED':
      case 'PAYMENT_BANK_SLIP_VIEWED':
      case 'PAYMENT_CHECKOUT_VIEWED':
        await this.handlePayment(request.input('payment'))
        break
      // TRANSFER
      case 'TRANSFER_CREATED':
      case 'TRANSFER_PENDING':
      case 'TRANSFER_IN_BANK_PROCESSING':
      case 'TRANSFER_BLOCKED':
      case 'TRANSFER_DONE':
      case 'TRANSFER_FAILED':
      case 'TRANSFER_CANCELLED':
        await this.handleTransfer(request.input('transfer'))
        break
      default:
        break
    }

    response.status(200)
    return
  }

  private async notifyPaymentReceived(data: PaymentWebhook) {
    const payment = await Payment.findBy('reference', data.id)

    if (!payment) return

    const { default: GomoovService } = await import('App/Services/GomoovService')

    const gomoovService = new GomoovService()

    try {
      await gomoovService.notify(payment)

      payment.status = data.status
      await payment.save()
    } catch (error) {
      // throw error
    }
  }

  private async handlePayment(data: PaymentWebhook) {
    const payment = await Payment.findBy('reference', data.id)

    if (!payment) return

    payment.status = data.status
    await payment.save()
  }

  private async handleTransfer(data: TransferWebhook) {
    const transfer = await Transfer.findBy('reference', data.id)

    if (!transfer) return

    transfer.status = data.status
    await transfer.save()
  }
}
