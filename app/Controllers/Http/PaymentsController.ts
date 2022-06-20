import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { BillingTypeEnum } from 'App/Interfaces/ICreatePayment';
import Customer from 'App/Models/Customer';

export default class PaymentsController {
  public async store({ request, response }: HttpContextContract) {

    const createPaymentSchema = schema.create({
      customer: schema.string(),
      billingType: schema.enum(Object.values(BillingTypeEnum)),
      dueDate: schema.date({
        format: 'yyyy-MM-dd',
      }),
      value: schema.number(),
      description: schema.string.optional(),
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
}
