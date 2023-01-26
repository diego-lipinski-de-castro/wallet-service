import axios, { AxiosInstance } from 'axios'
import Wallet from 'App/Models/Wallet'
import FindWalletResponse from 'App/Interfaces/IFindWalletResponse'
import CreateWalletInput from 'App/Interfaces/ICreateWalletInput'
import Env from '@ioc:Adonis/Core/Env'
import CreatePixResponse from 'App/Interfaces/ICreatePixResponse'
import { CreatePayment } from 'App/Interfaces/ICreatePayment'
import { CreatePaymentResponse } from 'App/Interfaces/ICreatePaymentResponse'
import { CreateCustomer } from 'App/Interfaces/ICreateCustomer'
import { CreateCustomerResponse } from 'App/Interfaces/ICreateCustomerResponse'
import { TransferResponse } from 'App/Interfaces/ITransferResponse'
import { WithdrawResponse } from 'App/Interfaces/IWithdrawResponse'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import CreateWalletResponse from 'App/Interfaces/ICreateWalletResponse'
import { CreateCardPayment } from 'App/Interfaces/ICreateCardPayment'
import { CreateCard } from 'App/Interfaces/ICreateCard'
import { CreateCardResponse } from 'App/Interfaces/ICreateCardResponse'

export default class AsaasService {
  private http: AxiosInstance

  private logUrlBlacklist: Array<String> = ['api/v3/creditCard/tokenizeCreditCard']

  constructor() {
    this.http = axios.create({
      baseURL: Env.get('ASAAS_URL'),
      timeout: 20000,
      headers: {
        access_token: Env.get('ASAAS_TOKEN'),
      },
    })

    this.http.interceptors.request.use(
      (config) => {
        if (!this.logUrlBlacklist.includes(config.url ?? '')) {
          Event.emit('proxies:request', {
            type: 'request',
            method: config.method,
            url: config.url,
            body: config.data,
            headers: config.headers,
            status: null,
            created_at: DateTime.now().toISO(),
          })
        }

        return config
      },
      (error) => {
        Event.emit('proxies:request:error', {
          tag: 'axios.request.error',
          info: `${error}`,
          created_at: DateTime.now().toISO(),
        })

        throw error
      }
    )

    this.http.interceptors.response.use(
      (response) => {
        Event.emit('proxies:response', {
          type: 'response',
          method: response.config.method,
          url: response.config.url,
          body: response.data,
          headers: response.headers,
          status: response.status,
          created_at: DateTime.now().toISO(),
        })

        return response
      },
      (error) => {
        console.log(error)
        Event.emit('proxies:response:error', {
          tag: 'axios.response.error',
          info: `${error}`,
          created_at: DateTime.now().toISO(),
        })

        if (error.response) {
          Event.emit('proxies:response', {
            type: 'response',
            method: error.response.config.method,
            url: error.response.config.url,
            body: error.response.data,
            headers: error.response.headers,
            status: error.response.status,
            created_at: DateTime.now().toISO(),
          })
        }

        throw error
      }
    )
  }

  public async createWallet(walletData: CreateWalletInput): Promise<any> {
    try {
      const walletResponse = await this.http({
        method: 'POST',
        url: 'api/v3/accounts',
        data: walletData,
      })

      const { id, walletId, apiKey }: CreateWalletResponse = walletResponse.data

      return {
        id,
        walletId,
        apiKey,
      }
    } catch (error) {
      throw error
    }
  }

  public async createPixKey(wallet: Wallet): Promise<any> {
    try {
      const pixResponse = await this.http({
        method: 'POST',
        url: 'api/v3/pix/addressKeys',
        headers: {
          access_token: wallet.key,
        },
        data: {
          type: 'EVP',
        },
      })

      const { id: pixId, key, qrCode }: CreatePixResponse = pixResponse.data

      return {
        pixId,
        key,
        qrCode,
      }
    } catch (error) {
      throw error
    }
  }

  public async findWallet(walletId: string): Promise<FindWalletResponse> {
    try {
      const response = await this.http({
        method: 'GET',
        url: `api/v3/accounts?id=${walletId}`,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  // amount: 1000 = R$ 1000
  public async transfer(from: Wallet, to: Wallet, amount: number): Promise<TransferResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/transfers',
        data: {
          walletId: to.wallet,
          value: amount,
        },
        headers: {
          access_token: `${from.key}`,
        },
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  // amount: 1000 = R$ 1000
  public async withdraw(
    fromWallet: Wallet,
    toPix: string,
    amount: number,
    description?: string
  ): Promise<WithdrawResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/transfers',
        data: {
          pixAddressKey: toPix,
          value: amount,
          description,
        },
        headers: {
          access_token: `${fromWallet.key}`,
        },
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  public async getBalance(wallet: Wallet): Promise<number> {
    try {
      const response = await this.http({
        method: 'GET',
        url: 'api/v3/finance/balance',
        headers: {
          access_token: `${wallet.key}`,
        },
      })

      return response.data.balance
    } catch (error) {
      throw error
    }
  }

  public async getTransactions(wallet: Wallet, offset: number = 0): Promise<any> {
    try {
      const response = await this.http({
        method: 'GET',
        url: `api/v3/financialTransactions?limit=50&offset=${offset}`,
        headers: {
          access_token: `${wallet.key}`,
        },
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  public async getTransfers(wallet: Wallet): Promise<any> {
    try {
      const response = await this.http({
        method: 'GET',
        url: 'api/v3/transfers',
        headers: {
          access_token: `${wallet.key}`,
        },
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  // value: 1000 = R$ 10,00
  // value: 10050 = R$ 100,50
  public async createPayment(paymentData: CreatePayment): Promise<CreatePaymentResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/payments',
        data: paymentData,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  // value: 1000 = R$ 10,00
  // value: 10050 = R$ 100,50
  public async createCardPayment(paymentData: CreateCardPayment): Promise<CreatePaymentResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/payments',
        data: paymentData,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  public async getQrcode(paymentId: string): Promise<any> {
    try {
      const response = await this.http({
        method: 'GET',
        url: `api/v3/payments/${paymentId}/pixQrCode`,
      })

      const { encodedImage, payload } = response.data

      return {
        encodedImage,
        payload,
      }
    } catch (error) {
      throw error
    }
  }

  public async createCustomer(customerData: CreateCustomer): Promise<CreateCustomerResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/customers',
        data: customerData,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  public async findCustomer(customerId: string): Promise<any> {
    try {
      const response = await this.http({
        method: 'GET',
        url: `api/v3/customers/${customerId}`,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }

  public async tokenizeCard(cardData: CreateCard): Promise<CreateCardResponse> {
    try {
      const response = await this.http({
        method: 'POST',
        url: 'api/v3/creditCard/tokenizeCreditCard',
        data: cardData,
      })

      return response.data
    } catch (error) {
      throw error
    }
  }
}
