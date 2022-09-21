import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'
import Customer from './Customer'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public customerId: number

  // ID on payment system
  @column()
  public reference: string

  @column()
  public value: number

  @column()
  public status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'RECEIVED'
    | 'RECEIVED_IN_CASH'
    | 'OVERDUE'
    | 'REFUND_REQUESTED'
    | 'REFUNDED'
    | 'CHARGEBACK_REQUESTED'
    | 'CHARGEBACK_DISPUTE'
    | 'AWAITING_CHARGEBACK_REVERSAL'
    | 'DUNNING_REQUESTED'
    | 'DUNNING_RECEIVED'
    | 'AWAITING_RISK_ANALYSIS'

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @beforeCreate()
  public static assignUuid(payment: Payment) {
    payment.uuid = v4()
  }
}
