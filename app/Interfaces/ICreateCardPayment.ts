export enum BillingTypeEnum {
  CREDIT_CARD = 'CREDIT_CARD',
}

interface SplitWallet {
  walletId: string
  fixedValue?: number
  percentualValue?: number
}

export interface CreateCardPayment {
  customer: string
  billingType: BillingTypeEnum
  value: number
  dueDate: String
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
  // creditCard?: {
  //   holderName: string
  //   number: string
  //   expiryMonth: string
  //   expiryYear: string
  //   ccv: string
  // }
  // creditCardHolderInfo?: {
  //   name: string
  //   email: string
  //   cpfCnpj: string
  //   postalCode: string
  //   addressNumber: string
  //   addressComplement?: string
  //   phone: string
  //   mobilePhone?: string
  // }
  creditCardToken: string
  remoteIp: string
}
