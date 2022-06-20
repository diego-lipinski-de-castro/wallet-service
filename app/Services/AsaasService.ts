import axios, { AxiosInstance } from 'axios'
import Wallet from 'App/Models/Wallet'
import IFindWalletResponse from 'App/Interfaces/IFindWalletResponse';
import ICreateWalletInput from 'App/Interfaces/ICreateWalletInput';
import ICreateWalletResponse from 'App/Interfaces/ICreatewalletResponse';
import Env from '@ioc:Adonis/Core/Env'
import ICreatePixResponse from 'App/Interfaces/ICreatePixResponse';
import { ICreatePayment } from 'App/Interfaces/ICreatePayment';
import { ICreatePaymentResponse } from 'App/Interfaces/ICreatePaymentResponse';
import { ICreateCustomer } from 'App/Interfaces/ICreateCustomer';
import { ICreateCustomerResponse } from 'App/Interfaces/ICreateCustomerResponse';
import { ITransferResponse } from 'App/Interfaces/ITransferResponse';
import { IWithdrawResponse } from 'App/Interfaces/IWithdrawResponse';

export default class AsaasService {
    private http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: Env.get('ASAAS_URL'),
            timeout: 10000,
            headers: {
                'access_token': Env.get('ASAAS_TOKEN'),
            },
        })

        this.http.interceptors.request.use(config => {
            return config;
        }, error => {
            throw error
        })

        this.http.interceptors.response.use(response => {
            return response;
        }, error => {
            throw error
        })
    }

    async createWallet(walletData: ICreateWalletInput): Promise<any> {
        try {

            const walletResponse = await this.http({
                method: 'POST',
                url: 'api/v3/accounts',
                data: walletData,
            })

            const { id, walletId, apiKey }: ICreateWalletResponse = walletResponse.data;

            const pixResponse = await this.http({
                method: 'POST',
                url: 'api/v3/pix/addressKeys',
                headers: {
                    'access_token': apiKey,
                },
                data: {
                    type: 'EVP',
                },
            })

            const { id: pixId, key, qrCode }: ICreatePixResponse = pixResponse.data

            return {
                id,
                walletId,
                apiKey,
                pixId,
                key,
                qrCode,
            }
        } catch (error) {
            throw error
        }
    }

    async findWallet(walletId: string): Promise<IFindWalletResponse> {
        try {
            const response = await this.http({
                method: 'GET',
                url: `api/v3/accounts?id=${walletId}`,
            })

            return response.data
        } catch (error) {
            throw error
        }
    }

    async transfer(from: Wallet, to: Wallet, amount: number): Promise<ITransferResponse> {
        try {
            const response = await this.http({
                method: 'POST',
                url: 'api/v3/transfers',
                data: {
                    walletId: to.wallet,
                    value: amount,
                },
                headers: {
                    'access_token': `${from.key}`,
                },
            })

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getBalance(wallet: Wallet): Promise<number> {
        try {
            const response = await this.http({
                method: 'GET',
                url: 'api/v3/finance/balance',
                headers: {
                    'access_token': `${wallet.key}`,
                },
            })

            return response.data.balance;
        } catch (error) {
            throw error
        }
    }

    async getTransactions(wallet: Wallet): Promise<any> {
        try {
            const response = await this.http({
                method: 'GET',
                url: 'api/v3/financialTransactions',
                headers: {
                    'access_token': `${wallet.key}`,
                },
            })

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getTransfers(wallet: Wallet): Promise<any> {
        try {
            const response = await this.http({
                method: 'GET',
                url: 'api/v3/transfers',
                headers: {
                    'access_token': `${wallet.key}`,
                },
            })

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async withdraw(fromWallet: Wallet, toPix: string, amount: number, description?: string): Promise<IWithdrawResponse> {
        try {
            const response = await this.http({
                method: 'POST',
                url: 'api/v3/transfers',
                data: {
                    pixAddressKey: toPix,
                    value: amount,
                    description,
                },
                headers: {
                    'access_token': `${fromWallet.key}`,
                },
            })

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async createPayment(paymentData: ICreatePayment): Promise<ICreatePaymentResponse> {
        try {

            const response = await this.http({
                method: 'POST',
                url: 'api/v3/payments',
                data: paymentData,
            })

            return response.data
        } catch (error) {
            throw error
        }
    }

    async getQrcode(paymentId: string): Promise<any> {
        try {

            const response = await this.http({
                method: 'GET',
                url: `api/v3/payments/${paymentId}/pixQrCode`
            })

            const { encodedImage, payload } = response.data

            return {
                status: 200,
                data: {
                    encodedImage, payload
                }
            };
        } catch (error) {
            throw error
        }
    }

    async createCustomer(customerData: ICreateCustomer): Promise<ICreateCustomerResponse> {
        try {

            const response = await this.http({
                method: 'POST',
                url: 'api/v3/customers',
                data: customerData,
            })

            return response.data
        } catch (error) {
            throw error
        }
    }

    async findCustomer(customerId: string): Promise<ICreateCustomerResponse> {
        try {
            const response = await this.http({
                method: 'GET',
                url: `api/v3/customers/${customerId}`,
            })

            return response.data
        } catch (error) {
            throw error
        }
    }
}
