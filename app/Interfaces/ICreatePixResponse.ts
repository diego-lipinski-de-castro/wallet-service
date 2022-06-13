enum PixKeyType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  EVP = 'EVP',
}

enum PixKeyStatus {
  AWAITING_ACTIVATION = 'AWAITING_ACTIVATION',
  ACTIVE = 'ACTIVE',
  AWAITING_DELETION = 'AWAITING_DELETION',
}

export default interface ICreatePixResponse {
    id: string,
    key: string,
    type: PixKeyType,
    status: PixKeyStatus,
    dateCreated: Date,
    canBeDeleted: boolean,
    cannotBeDeletedReason: string|null,
    qrCode: {
      encodedImage: string,
      payload: string
    }
}