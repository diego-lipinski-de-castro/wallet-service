export interface IPaymentWebhook {
  object: string
  id: string
  dateCreated: string
  customer: string
  subscription: string
  installment: string
  paymentLink: string
  dueDate: string
  originalDueDate: string
  value: number
  netValue: number
  originalValue: any
  interestValue: any
  description: string
  externalReference: string
  billingType: string
  status:
    | "PENDING"
    | "CONFIRMED"
    | "RECEIVED"
    | "RECEIVED_IN_CASH"
    | "OVERDUE"
    | "REFUND_REQUESTED"
    | "REFUNDED"
    | "CHARGEBACK_REQUESTED"
    | "CHARGEBACK_DISPUTE"
    | "AWAITING_CHARGEBACK_REVERSAL"
    | "DUNNING_REQUESTED"
    | "DUNNING_RECEIVED"
    | "AWAITING_RISK_ANALYSIS"
  confirmedDate: string
  paymentDate: string
  clientPaymentDate: string
  installmentNumber: any
  creditDate: string
  estimatedCreditDate: string
  invoiceUrl: string
  bankSlipUrl: any
  transactionReceiptUrl: string
  invoiceNumber: string
  deleted: boolean
  anticipated: boolean
  lastInvoiceViewedDate: string
  lastBankSlipViewedDate: any
  postalService: boolean
  creditCard: CreditCard
  discount: Discount
  fine: Fine
  interest: Interest
  split: Split[]
  chargeback: Chargeback
  refunds: any
}

export interface CreditCard {
  creditCardNumber: string
  creditCardBrand: string
  creditCardToken: string
}

export interface Discount {
  value: number
  dueDateLimitDays: number
  type: string
}

export interface Fine {
  value: number
  type: string
}

export interface Interest {
  value: number
  type: string
}

export interface Split {
  walletId: string
  fixedValue?: number
  percentualValue?: number
}

export interface Chargeback {
  status: string
  reason: string
}
