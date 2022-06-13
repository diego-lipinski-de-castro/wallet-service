import Wallet from "App/Models/Wallet";
import ICreateWalletInput from "./ICreateWalletInput";
import IResponse from "./IResponse";

export default interface IWalletService {
    listWallets(): Promise<IResponse<any>>
    createWallet(walletData: ICreateWalletInput): Promise<IResponse<any>>
    findWallet(walletId: string): Promise<IResponse<any>>
    transfer(from: Wallet, to: Wallet, amount: number): Promise<IResponse<any>>
    getBalance(wallet: Wallet): Promise<IResponse<any>>
    getTransactions(wallet: Wallet): Promise<IResponse<any>>
}