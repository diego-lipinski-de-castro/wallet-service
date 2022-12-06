import axios, { AxiosInstance } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import Payment from 'App/Models/Payment'

export default class GomoovService {
  private http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: Env.get('GOMOOV_PAYMENT_SERVICE_URL'),
      timeout: 20000,
    })

    this.http.interceptors.request.use(
      (config) => {
        Event.emit('proxies:request', {
          type: 'request',
          method: config.method,
          url: config.url,
          body: config.data,
          headers: config.headers,
          status: null,
          created_at: DateTime.now().toISO(),
        })

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

  public async notify(payment: Payment): Promise<any> {
    try {
      const response = await this.http({
        method: 'PUT',
        url: `payments/updatePendingTransaction/${payment.uuid}`,
      })

      // return response.data
    } catch (error) {
      // throw error
    }
  }
}
