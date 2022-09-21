import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'
import Wallet from './Wallet'

export default class Transfer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  // ID on payment system
  @column()
  public reference: string

  @column()
  public value: number

  @column()
  public description: string

  @column()
  public status: 'DONE' | 'PENDING' | 'CANCELLED' | 'BANK_PROCESSING' | 'FAILED'

  @column()
  public fromId: number

  @column()
  public toId: number

  @column()
  public toPix: string

  @column.date()
  public requestedAt: DateTime | null

  @column.date()
  public effectiveAt: DateTime | null

  @column.date()
  public scheduledAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Wallet)
  public from: BelongsTo<typeof Wallet>

  @belongsTo(() => Wallet)
  public to: BelongsTo<typeof Wallet>

  @beforeCreate()
  public static assignUuid(transfer: Transfer) {
    transfer.uuid = v4()
  }
}
