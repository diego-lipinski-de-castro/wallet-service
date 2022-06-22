import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import WalletCompanyTypeEnum from 'App/Enums/WalletCompanyTypeEnum';
import Wallet from 'App/Models/Wallet';
import { validate as validateUuid } from 'uuid'

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

  public async transfer({}: HttpContextContract) {}
}
