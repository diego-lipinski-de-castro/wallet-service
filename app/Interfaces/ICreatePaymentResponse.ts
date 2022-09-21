enum BillingTypeEnum {
  BOLETO = 'BOLETO',
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
  UNDEFINED = 'UNDEFINED',
  DEBIT_CARD = 'DEBIT_CARD',
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
}

export interface CreatePaymentResponse {
  id: string
  dateCreated: string
  customer: string
  paymentLink?: string
  subscription?: string
  installment?: string
  dueDate: string
  value: number
  netValue?: number
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
  billingType: BillingTypeEnum
  status?:
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
  pixTransaction?: string
  description?: string
  externalReference?: string
  originalDueDate?: string
  originalValue?: number
  interestValue?: number
  confirmedDate?: string
  paymentDate?: string
  clientPaymentDate?: string
  installmentNumber?: string
  invoiceUrl?: string
  bankSlipUrl?: string
  transactionReceiptUrl?: string
  invoiceNumber?: string
  deleted?: boolean
  postalService?: boolean
  anticipated?: boolean
  split?: unknown[]
  chargeback?: {
    status?: 'REQUESTED' | 'IN_DISPUTE' | 'DISPUTE_LOST' | 'REVERSED' | 'DONE'
    reason?:
      | 'ABSENCE_OF_PRINT'
      | 'ABSENT_CARD_FRAUD'
      | 'CARD_ACTIVATED_PHONE_TRANSACTION'
      | 'CARD_FRAUD'
      | 'CARD_RECOVERY_BULLETIN'
      | 'COMMERCIAL_DISAGREEMENT'
      | 'COPY_NOT_RECEIVED'
      | 'CREDIT_OR_DEBIT_PRESENTATION_ERROR'
      | 'DIFFERENT_PAY_METHOD'
      | 'FRAUD'
      | 'INCORRECT_TRANSACTION_VALUE'
      | 'INVALID_CURRENCY'
      | 'INVALID_DATA'
      | 'LATE_PRESENTATION'
      | 'LOCAL_REGULATORY_OR_LEGAL_DISPUTE'
      | 'MULTIPLE_ROCS'
      | 'ORIGINAL_CREDIT_TRANSACTION_NOT_ACCEPTED'
      | 'OTHER_ABSENT_CARD_FRAUD'
      | 'PROCESS_ERROR'
      | 'RECEIVED_COPY_ILLEGIBLE_OR_INCOMPLETE'
      | 'RECURRENCE_CANCELED'
      | 'REQUIRED_AUTHORIZATION_NOT_GRANTED'
      | 'RIGHT_OF_FULL_RECOURSE_FOR_FRAUD'
      | 'SALE_CANCELED'
      | 'SERVICE_DISAGREEMENT_OR_DEFECTIVE_PRODUCT'
      | 'SERVICE_NOT_RECEIVED'
      | 'SPLIT_SALE'
      | 'TRANSFERS_OF_DIVERSE_RESPONSIBILITIES'
      | 'UNQUALIFIED_CAR_RENTAL_DEBIT'
      | 'USA_CARDHOLDER_DISPUTE'
      | 'VISA_FRAUD_MONITORING_PROGRAM'
      | 'WARNING_BULLETIN_FILE'
    [k: string]: unknown
  }
  refunds?: unknown[]
  municipalInscription?: string
  stateInscription?: string
  canDelete?: string
  cannotBeDeletedReason?: string
  canEdit?: string
  cannotEditReason?: string
}
