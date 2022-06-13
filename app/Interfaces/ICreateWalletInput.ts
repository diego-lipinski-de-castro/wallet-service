import WalletCompanyTypeEnum from "App/Enums/WalletCompanyTypeEnum";

export default interface ICreateWalletInput {
    name: string,
    email: string,
    cpfCnpj: string,
    companyType: WalletCompanyTypeEnum,
    phone: string,
    mobilePhone: string,
    address: string,
    addressNumber: string,
    complement: string,
    province: string,
    postalCode: string,
}