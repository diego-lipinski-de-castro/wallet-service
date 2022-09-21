import { DateTime } from 'luxon'

export enum BillingTypeEnum {
  BOLETO = 'BOLETO',
  PIX = 'PIX',
}

interface SplitWallet {
  walletId: string
  fixedValue?: number
  percentualValue?: number
}

export interface CreatePayment {
  customer: string
  billingType: BillingTypeEnum
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
  split?: SplitWallet[]
}
