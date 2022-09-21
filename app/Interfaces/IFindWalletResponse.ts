import WalletCompanyTypeEnum from '../Enums/WalletCompanyTypeEnum'
import WalletPersonTypeEnum from '../Enums/WalletPersonTypeEnum'

export default interface FindWalletResponse {
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
  walletId: string
}
