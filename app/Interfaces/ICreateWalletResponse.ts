import WalletCompanyTypeEnum from 'App/Enums/WalletCompanyTypeEnum'
import WalletPersonTypeEnum from 'App/Enums/WalletPersonTypeEnum'

export default interface CreateWalletResponse {
  object: string
  id: string
  name: string
  email: string
  loginEmail: string
  phone: string
  mobilePhone: string
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cpfCnpj: string
  personType: WalletPersonTypeEnum
  companyType: WalletCompanyTypeEnum
  city: number
  state: string
  country: string
  apiKey: string
  walletId: string
  accountNumber: {
    agency: string
    account: string
    accountDigit: string
  }
}
