import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import WalletCompanyTypeEnum from 'App/Enums/WalletCompanyTypeEnum';
import Transfer from 'App/Models/Transfer';
import Wallet from 'App/Models/Wallet';
import { validate as validateUuid } from 'uuid'
import { DateTime } from 'luxon'

export default class WalletsController {

  public async store({ request, response }: HttpContextContract) {

    const createWalletSchema = schema.create({
      name: schema.string(),
      email: schema.string(),
      cpfCnpj: schema.string(),
      companyType: schema.enum.optional(Object.values(WalletCompanyTypeEnum)),
      phone: schema.string(),
      mobilePhone: schema.string.optional(),
      address: schema.string.optional(),
      addressNumber: schema.string.optional(),
      complement: schema.string.optional(),
      province: schema.string.optional(),
      postalCode: schema.string.optional(),
    })

    const payload = await request.validate({ schema: createWalletSchema })

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.createWallet(payload);

      const wallet = await Wallet.create({
          reference: result.id,
          wallet: result.walletId,
          key: result.apiKey,
      })

      await wallet.related('keys').create({
          reference: result.pixId,
          key: result.key,
          base64: result.qrCode.encodedImage,
          payload: result.qrCode.payload,
      })

      response.status(200)

      return {
        wallet: wallet.uuid
      }
      
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }

  public async show({ response, params }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const wallet = await Wallet.findByOrFail('uuid', params?.id);

    return wallet;
  }

  public async balance({ response, params }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const wallet = await Wallet.findByOrFail('uuid', params?.id);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.getBalance(wallet);

      response.status(200)

      return {
        balance: result
      }
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
    }
  }

  public async qrcode({ response, params }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const wallet = await Wallet.findByOrFail('uuid', params?.id);

    await wallet.load('keys')

    const key = wallet.keys[0]

    return {
      encodedImage: key.base64,
      payload: key.payload,
    }
  }

  public async transfer({ request, response }: HttpContextContract) {

    const createWalletSchema = schema.create({
      from: schema.string(),
      to: schema.string(),
      amount: schema.number(),
    })

    const payload = await request.validate({ schema: createWalletSchema })

    if(!validateUuid(payload.from) || !validateUuid(payload.to)) {
      response.status(422)
      return 
    }

    const fromWallet = await Wallet.findByOrFail('uuid', payload.from);
    const toWallet = await Wallet.findByOrFail('uuid', payload.to);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.transfer(fromWallet, toWallet, payload.amount);

      const transfer = await Transfer.create({
        fromId: fromWallet.id,
        toId: toWallet.id,
        reference: result.id,
        value: result.value,
        status: result.status,
        requestedAt: result.dateCreated == null ? null : DateTime.fromFormat(result.dateCreated, 'Y-m-d'),
        effectiveAt: result.effectiveDate == null ? null : DateTime.fromFormat(result.effectiveDate, 'Y-m-d'),
        scheduledAt: result.scheduleDate == null ? null : DateTime.fromFormat(result.scheduleDate, 'Y-m-d'),
      })

      response.status(200)

      return transfer
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
