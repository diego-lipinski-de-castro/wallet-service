import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { BillingTypeEnum } from 'App/Interfaces/ICreatePayment';
import { BillingTypeEnum as CardBillingTypeEnum } from 'App/Interfaces/ICreateCardPayment';
import Customer from 'App/Models/Customer';
import Payment from 'App/Models/Payment';
import { validate as validateUuid } from 'uuid'
import Card from 'App/Models/Card';

export default class PaymentsController {

  public async store(ctx: HttpContextContract) {

    const validationSchema = schema.create({
      billingType: schema.enum(['PIX', 'CREDIT_CARD']),
    })

    const payload = await ctx.request.validate({ schema: validationSchema })

    switch(payload.billingType) {
      case "PIX":
        return this.handlePixPayment(ctx)
      case "CREDIT_CARD":
        return this.handleCardPayment(ctx)
    }
  }

  private async handlePixPayment({ request, response }: HttpContextContract) {
    const createPaymentSchema = schema.create({
      customer: schema.string(),
      billingType: schema.enum(Object.values(BillingTypeEnum)),
      dueDate: schema.date({
        format: 'yyyy-MM-dd',
      }),
      value: schema.number(),
    })

    const payload = await request.validate({ schema: createPaymentSchema })

    const customer = await Customer.findByOrFail('uuid', payload.customer);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.createPayment({
        ...payload,
        customer: customer.reference,
      });
  
      const payment = customer.related('payments').create({
        reference: result.id,
        value: result.value,
        status: result.status,
        description: result.description,
      })

      response.status(200)
      return payment
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }

  private async handleCardPayment({ request, response }: HttpContextContract) {
    
    const createPaymentSchema = schema.create({
      customer: schema.string(),
      billingType: schema.enum(Object.values(CardBillingTypeEnum)),
      dueDate: schema.date({
        format: 'yyyy-MM-dd',
      }),
      value: schema.number(),
      card: schema.string(),
      remoteIp: schema.string({}, [
        rules.ip(),
      ]),
    })

    const payload = await request.validate({ schema: createPaymentSchema })

    const customer = await Customer.findByOrFail('uuid', payload.customer);
    const card = await Card.findByOrFail('uuid', payload.card);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.createCardPayment({
        ...payload,
        customer: customer.reference,
        creditCardToken: card.token,
      });

      const payment = customer.related('payments').create({
        reference: result.id,
        value: result.value,
        status: result.status,
        description: result.description,
      })

      response.status(200)
      return payment
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }

  public async qrcode({ params, response }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const payment = await Payment.findByOrFail('uuid', params?.id);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.getQrcode(payment.reference);

      response.status(200)
      return result
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }
}
