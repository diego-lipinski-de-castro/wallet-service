import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer'
import { validate as validateUuid } from 'uuid'

export default class CardsController {
    public async store({ params, request, response }: HttpContextContract) {
        
        const createCardSchema = schema.create({
            creditCardHolderName: schema.string(),
            creditCardNumber: schema.string(),
            creditCardExpiryMonth: schema.string(),
            creditCardExpiryYear: schema.string(),
            creditCardCcv: schema.string(),
        })

        const payload = await request.validate({ schema: createCardSchema })

        if(!validateUuid(params?.id)) {
            response.status(422)
            return
        }

        const customer = await Customer.findByOrFail('uuid', params?.id);

        await customer.load('cards')

        if(customer.cards.length > 0) {
            response.status(422)
            return
        }

        const { default: AsaasService } = await import('App/Services/AsaasService')

        const asaasService = new AsaasService()

        try {
            const result = await asaasService.tokenizeCard({
                ...payload,
                customer: customer.reference,
            });

            const card = customer.related('cards').create({
                number: result.creditCardNumber,
                brand: result.creditCardBrand,
                token: result.creditCardToken,
            })

            response.status(200)
            return card
        } catch (error) {
            if (error.response) {
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

        await customer.load('cards')

        if(customer.cards.length == 0)  {
            response.status(404)
            return null
        }

        return customer.cards[0];
    }
}
