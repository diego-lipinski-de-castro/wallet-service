import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class LogRequest {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    await Database.insertQuery().table('requests').insert({
      method: request.method(),
      url: request.url(),
      json: request.toJSON(),
      created_at: DateTime.now().toISO(),
    })

    await next()
  }
}
