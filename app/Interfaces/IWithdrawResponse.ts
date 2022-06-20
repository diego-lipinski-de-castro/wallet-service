export interface IWithdrawResponse {
  id: string
  dateCreated?: string
  value?: number
  netValue?: number
  status?: "PENDING" | "BANK_PROCESSING" | "DONE" | "CANCELLED" | "FAILED"
  transferFee?: number
  effectiveDate?: string
  scheduleDate?: string
  authorized?: boolean
  failReason?: string
  bankAccount?: {
    bank?: {
      ispb?: string
      code?: string
      name?: string
    }
    accountName?: string
    ownerName?: string
    cpfCnpj?: string
    agency?: string
    account?: string
    accountDigit?: string
    pixAddressKey?: string
  }
  transactionReceiptUrl?: string
  operationType?: "PIX" | "TED" | "INTERNAL"
  description?: string
}
  