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
      const walletResult = await asaasService.createWallet(payload);

      const wallet = await Wallet.create({
          reference: walletResult.id,
          wallet: walletResult.walletId,
          key: walletResult.apiKey,
      })

      const pixResult = await asaasService.createPixKey(wallet);

      await wallet.related('keys').create({
          reference: pixResult.pixId,
          key: pixResult.key,
          base64: pixResult.qrCode.encodedImage,
          payload: pixResult.qrCode.payload,
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

  public async transactions({ request, params, response }: HttpContextContract) {

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const wallet = await Wallet.findByOrFail('uuid', params?.id);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.getTransactions(wallet, request.qs()?.offset ?? 0);

      response.status(200)

      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    
      const data = result.data.map(trx => {
        return {
          value: trx.value,
          balance: trx.balance,
          value_formatted: formatter.format(trx.value),
          balance_formatted: formatter.format(trx.balance),
          date: DateTime.fromISO(trx.date).toFormat('dd/MM/yyyy'),
          description: trx.description,
        }
      })

      return {
        hasMore: result.hasMore,
        totalCount: result.totalCount,
        limit: result.limit,
        offset: result.offset,
        data: data
      };
    } catch (error) {
      if(error.response) {
        response.status(error.response.status)
        return error.response.data
      }

      response.status(500)
      return null
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
        requestedAt: result.dateCreated == null ? null : DateTime.fromISO(result.dateCreated),
        effectiveAt: result.effectiveDate == null ? null : DateTime.fromISO(result.effectiveDate),
        scheduledAt: result.scheduleDate == null ? null : DateTime.fromISO(result.scheduleDate),
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

  public async withdraw({ params, request, response }: HttpContextContract) {
    
    const withdrawSchema = schema.create({
      pix: schema.string(),
      amount: schema.number(),
      description: schema.string.optional(),
    })

    const payload = await request.validate({ schema: withdrawSchema })

    if(!validateUuid(params?.id)) {
      response.status(422)
      return 
    }

    const wallet = await Wallet.findByOrFail('uuid', params?.id);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    try {
      const result = await asaasService.withdraw(wallet, payload.pix, payload.amount, payload.description);

      const transfer = await Transfer.create({
        fromId: wallet.id,
        reference: result.id,
        value: result.value,
        description: payload.description,
        status: result.status,
        toPix: payload.pix,
        requestedAt: result.dateCreated == null ? null : DateTime.fromISO(result.dateCreated),
        effectiveAt: result.effectiveDate == null ? null : DateTime.fromISO(result.effectiveDate),
        scheduledAt: result.scheduleDate == null ? null : DateTime.fromISO(result.scheduleDate),
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
