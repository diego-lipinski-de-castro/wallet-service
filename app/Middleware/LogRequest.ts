import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class LogRequest {
  private logBodyBlacklist: Array<String> = ['creditCardCcv']

  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const json = request.toJSON()

    for (const property of this.logBodyBlacklist) {
      if (json.body.hasOwnProperty(property)) {
        delete json.body[`${property}`]
      }
    }

    await Database.insertQuery().table('requests').insert({
      method: request.method(),
      url: request.url(),
      json: json,
      created_at: DateTime.now().toISO(),
    })

    await next()
  }
}
