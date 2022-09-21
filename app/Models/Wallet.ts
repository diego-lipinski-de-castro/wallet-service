import { BaseModel, column, beforeCreate, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import Key from './Key'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  // ID on payment system
  @column()
  public reference: string

  @column()
  public wallet: string

  // access key to make future requests
  @column()
  public key: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(wallet: Wallet) {
    wallet.uuid = v4()
  }

  @hasMany(() => Key)
  public keys: HasMany<typeof Key>
}
