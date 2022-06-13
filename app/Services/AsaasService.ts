import axios, { AxiosInstance } from 'axios'
import Wallet from 'App/Models/Wallet'
import IFindWalletResponse from 'App/Interfaces/IFindWalletResponse';
import ICreateWalletInput from 'App/Interfaces/ICreateWalletInput';
import IWalletService from 'App/Interfaces/IWalletService';
import ICreateWalletResponse from 'App/Interfaces/ICreatewalletResponse';
import Env from '@ioc:Adonis/Core/Env'
import IResponse from 'App/Interfaces/IResponse';
import ICreatePixResponse from 'App/Interfaces/ICreatePixResponse';

export default class AsaasService implements IWalletService {
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

    async listWallets(): Promise<IResponse<any>> {
        try {
            const response = await this.http({
                method: 'GET',
                url: 'api/v3/accounts',
            })

            return response.data;
        } catch (error) {
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }

    async createWallet(walletData: ICreateWalletInput): Promise<IResponse<any>> {
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

            const { id: pixId }: ICreatePixResponse = pixResponse.data

            const wallet = await Wallet.create({
                reference: id,
                wallet: walletId,
                key: apiKey,
                pix: pixId,
            });

            return {
                status: 200,
                data: {
                    id: wallet.id
                },
            }
        } catch (error) {
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }

    async findWallet(walletId: string): Promise<IResponse<any>> {
        try {
            const response = await this.http({
                method: 'GET',
                url: `api/v3/accounts?id=${walletId}`,
            })

            const data: IFindWalletResponse = response.data

            return {
                status: 200,
                data
            };
        } catch (error) {
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }

    async transfer(from: Wallet, to: Wallet, amount: number): Promise<IResponse<any>> {
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
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }

    async getBalance(wallet: Wallet): Promise<IResponse<any>> {
        try {
            const response = await this.http({
                method: 'GET',
                url: 'api/v3/finance/balance',
                headers: {
                    'access_token': `${wallet.key}`,
                },
            })

            return {
                status: 200,
                data: response.data
            };
        } catch (error) {
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }

    async getTransactions(wallet: Wallet): Promise<IResponse<any>> {
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
            if(error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            }

            return {
                status: 500,
                data: null,
            };
        }
    }
}
