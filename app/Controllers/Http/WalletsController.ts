import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import WalletCompanyTypeEnum from 'App/Enums/WalletCompanyTypeEnum';

export default class WalletsController {
  public async index({}: HttpContextContract) {
    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    const response = await asaasService.listWallets();

    return response;
  }

  public async store({ request, response }: HttpContextContract) {

    const createWalletSchema = schema.create({
      name: schema.string(),
      email: schema.string(),
      cpfCnpj: schema.string(),
      companyType: schema.enum(Object.values(WalletCompanyTypeEnum)),
      phone: schema.string(),
      mobilePhone: schema.string(),
      address: schema.string(),
      addressNumber: schema.string(),
      complement: schema.string(),
      province: schema.string(),
      postalCode: schema.string(),
    })

    const payload = await request.validate({ schema: createWalletSchema })

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    const result = await asaasService.createWallet(payload);

    response.status(result.status);

    return result.data
  }

  public async show({ params, response }: HttpContextContract) {

    console.log('params', params);

    const { default: AsaasService } = await import('App/Services/AsaasService');

    const asaasService = new AsaasService();

    const result = await asaasService.findWallet('4034e085-b09c-4433-b589-9e538233c9b9');

    response.status(result.status);

    return result.data;
  }

  public async transfer({}: HttpContextContract) {}
}
