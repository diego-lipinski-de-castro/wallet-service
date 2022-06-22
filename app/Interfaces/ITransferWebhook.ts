export interface ITransferWebhook {
  object: string
  id: string
  dateCreated: string
  status: string
  effectiveDate: any
  type: string
  value: number
  netValue: number
  transferFee: number
  scheduleDate: string
  authorized: boolean
  failReason: any
  transactionReceiptUrl?: string
  bankAccount?: BankAccount
  operationType: string
  description?: string
  walletId?: string
  account?: {
    name: string
    cpfCnpj: string
  }
}

export interface BankAccount {
  bank: Bank
  accountName: string
  ownerName: string
  cpfCnpj: string
  agency: string
  agencyDigit: string
  account: string
  accountDigit: string
  pixAddressKey: any
}

export interface Bank {
  ispb: string
  code: string
  name: string
}
