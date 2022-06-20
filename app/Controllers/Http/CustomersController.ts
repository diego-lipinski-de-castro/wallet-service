import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer';
import { validate as validateUuid } from 'uuid'

export default class CustomersController {

  public async store({ request, response }: HttpContextContract) {

    const createCustomerSchema = schema.create({
      name: schema.string(),
      cpfCnpj: schema.string(),
      email: schema.string.optional(),
      phone: schema.string.optional(),
      mobilePhone: schema.string.optional(),
      // externalReference: schema.string.optional(),
      // notificationDisabled: schema.boolean.optional(),
      // observations: schema.string.optional(),
    })

    const payload = await request.validate({ schema: createCustomerSchema })

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.createCustomer(payload);

      const customer = await Customer.create({
        reference: result.id
      })

      response.status(200)
      return customer
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }

  public async show({ params, response }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const customer = await Customer.findByOrFail('uuid', params?.id);

    return customer;
  }
}
