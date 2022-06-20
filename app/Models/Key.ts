import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Wallet from "./Wallet";

export default class Key extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public walletId: number

    // ID on payment system
    @column()
    public reference: string;

    @column()
    public key: string;

    @column()
    public base64: string;

    @column()
    public payload: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Wallet)
    public wallet: BelongsTo<typeof Wallet>
}