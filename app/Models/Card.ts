import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'
import Customer from './Customer'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public customerId: number

  @column()
  public uuid: string;

  @column()
  public number: string;

  @column()
  public brand: string;

  @column()
  public token: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @beforeCreate()
  public static assignUuid(card: Card) {
      card.uuid = v4()
  }
}
