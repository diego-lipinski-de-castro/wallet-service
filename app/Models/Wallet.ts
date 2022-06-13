import { BaseModel, column, beforeCreate } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import { v4 } from 'uuid'

export default class Wallet extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string;

    // ID on payment system
    @column()
    public reference: string;

    @column()
    public wallet: string;

    // access key to make future requests
    @column()
    public key: string;
    
    @column()
    public pix: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static assignUuid(wallet: Wallet) {
        wallet.id = v4()
    }
}