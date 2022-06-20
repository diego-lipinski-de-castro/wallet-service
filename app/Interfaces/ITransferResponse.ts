export interface ITransferResponse {
    id: string
    dateCreated?: string
    value?: number
    status?: "DONE" | "PENDING" | "CANCELLED"
    transferFee?: number
    effectiveDate?: string
    scheduleDate?: string
    authorized?: boolean
    walletId?: string
    account?: {
      name?: string
      cpfCnpj?: string
      agency?: string
      account?: string
      accountDigit?: string
    }
    transactionReceiptUrl?: string
  }
  