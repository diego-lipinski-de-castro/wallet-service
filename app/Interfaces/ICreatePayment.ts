import { DateTime } from "luxon"

export enum BillingTypeEnum {
  BOLETO = 'BOLETO',
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX' ,
  UNDEFINED = 'UNDEFINED',
}

export interface ICreatePayment {
    customer: string
    billingType: BillingTypeEnum,
    value: number
    dueDate: DateTime
    description?: string
    externalReference?: string
    installmentCount?: number
    installmentValue?: number
    discount?: {
      value?: number
      dueDateLimitDays?: number
      type?: 'FIXED' | 'PERCENTAGE'
    }
    interest?: {
      value?: number
    }
    fine?: {
      value?: number
    }
    postalService?: boolean
    split?: unknown[]
  }
  