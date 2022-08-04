import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Card from 'App/Models/Card'
import Customer from 'App/Models/Customer'
import { DateTime } from 'luxon'
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

        if (!validateUuid(params?.id)) {
            response.status(404)
            
            return {
                message: 'Cliente não encontrado.',
            }
        }

        const customer = await Customer.findBy('uuid', params?.id)

        if(!customer) {
            response.status(404)

            return {
                message: 'Cliente não encontrado.',
            }
        }

        const card = await Card.query()
            .where('customer_id', customer.id)
            .whereNull('deleted_at')
            .first()

        if (card) {
            response.status(422)

            return {
                message: 'Cliente já possui um cartão cadastrado.',
            }
        }

        const { default: AsaasService } = await import('App/Services/AsaasService')

        const asaasService = new AsaasService()

        try {
            const result = await asaasService.tokenizeCard({
                ...payload,
                customer: customer.reference,
            })

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
        if (!validateUuid(params?.id)) {
            response.status(404);

            return {
                message: 'Cliente não encontrado.',
            }
        }

        const customer = await Customer.findBy('uuid', params?.id)

        if(!customer) {
            response.status(404)

            return {
                message: 'Cliente não encontrado.',
            }
        }

        const card = await Card.query()
            .where('customer_id', customer.id)
            .whereNull('deleted_at')
            .first()

        if (!card) {
            response.status(404)
            
            return {
                message: 'Nenhum cartão encontrado.',
            }
        }

        return card
    }

    public async destroy({ params, response }: HttpContextContract) {
        if (!validateUuid(params?.id)) {
            response.status(404)
            
            return {
                message: 'Cliente não encontrado.',
            }
        }

        if (!validateUuid(params?.card)) {
            response.status(404)
            
            return {
                message: 'Cartão não encontrado.',
            }
        }

        const customer = await Customer.findBy('uuid', params?.id)

        if(!customer) {
            response.status(404)

            return {
                message: 'Cliente não encontrado.',
            }
        }

        const card = await Card.query()
            .where('customer_id', customer.id)
            .where('uuid', params?.card)
            .first()

        if (!card) {
            response.status(404)
            
            return {
                message: 'Cartão não encontrado.',
            }
        }

        card.deletedAt = DateTime.now();
        card.save();
    }
}
