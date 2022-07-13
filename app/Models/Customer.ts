import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'
import Payment from './Payment';
import Card from './Card';

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  // ID on payment system
  @column()
  public reference: string;

  @column()
  public cpfCnpj: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(customer: Customer) {
      customer.uuid = v4()
  }

  @hasMany(() => Payment)
  public payments: HasMany<typeof Payment>

  @hasMany(() => Card)
  public cards: HasMany<typeof Card>
}
