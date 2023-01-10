import BigNumber from "bignumber.js";
import appConstants from '../constants/appConstants.json';
import { IContractQuery } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/interface";
import { ContractQueryResponse, NetworkConfig } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out";
import { ElrondApiProvider } from 'network/elrondApiProvider';
import { ElrondGatewayProvider } from "network/elrondGatewayProvider";

import { 
    Address, 
    Transaction, 
    TransactionPayload, 
    IGasLimit,
    TransactionVersion,
    ITransactionValue,
    TokenPayment,
    ESDTTransferPayloadBuilder,
} from "../../release/app/node_modules/@elrondnetwork/erdjs/out";

import { FungibleTokenOfAccountOnNetwork } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/tokens";
import { AccountOnNetwork } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/accounts";
import { IAddress } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/interface";
import { IChartrAccount, ITransactionHistoryItem, IUserSettings } from "interfaces";
import {
    UserWallet,
    UserSecretKey,
    UserSigner
} from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";


export default class ElrondService {
    private senderAddress: string
    private scAddress: string
    private apiProvider: ElrondApiProvider
    private gatewayProvider: ElrondGatewayProvider

    constructor(apiBaseUrl: string) { 
        this.senderAddress = appConstants.GENERIC_SENDER_ADDRESS;
        this.scAddress = appConstants.SC_ADDRESS_DEVNET;
        this.apiProvider = new ElrondApiProvider(apiBaseUrl);
        this.gatewayProvider = new ElrondGatewayProvider();
    }

    async getAccount(address: string): Promise<AccountOnNetwork> {
        try {
            const addr: IAddress = {
                bech32: () => { return address; }
            }
            return await this.gatewayProvider.getAccount(addr);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getAeroTokenDetails(address: string): Promise<FungibleTokenOfAccountOnNetwork> {
        try {
            const tokenDetails = await this.apiProvider.getAccountTokenDetails(address, appConstants.AERO_TOKEN_ID_DEVNET);
            return tokenDetails;
        } catch (error: any) {
            return {
                identifier: appConstants.AERO_TOKEN_ID,
                balance: new BigNumber(0),
                rawResponse: {},
            }
        }
    }

    async saveAccount(
        chartrAccount: IChartrAccount, 
        nonce: number, 
        userSettings: IUserSettings,
        password: string): Promise<boolean> {
        try {
            const networkConfig = await this.getNetworkConfig();
            const senderAddress = new Address(userSettings.publicKeyHex);
            const scAddress = new Address(this.scAddress);
            const txValue: ITransactionValue = {
                toString: () => { return "0" }
            };

            const dataArgs = Buffer.from(JSON.stringify([chartrAccount])).toString("hex");
            const usernameHex = Buffer.from(chartrAccount.username).toString("hex");
            const accountTypeHex = Buffer.from(chartrAccount.accountType).toString("hex");
            const dataField = `createAccount@${dataArgs}@${usernameHex}@${accountTypeHex}`;

            const tx = new Transaction({
                sender: senderAddress,
                receiver: scAddress,
                value: txValue,
                data: new TransactionPayload(dataField),
                gasLimit: networkConfig.MinGasLimit,
                gasPrice: networkConfig.MinGasPrice,
                chainID: networkConfig.ChainID,
                nonce: nonce,
                version: new TransactionVersion(networkConfig.MinTransactionVersion)
            });

            // HACK ALERT! sending the typed Transaction into the estimateCostOfTransaction method does not work 
            // because it doesn't like the data structure (why they made it so complicated is ???)
            // so we'll build up a generic object by hand (tempTx) which works for estimating but does not
            // work when it comes time to sign the tx (lame)
            const tempTx: any = {
                sender: chartrAccount.id,
                receiver: this.scAddress,
                value: "0",
                data: Buffer.from(dataField).toString("base64"),
                chainId: networkConfig.ChainID,
                gasPrice: networkConfig.MinGasPrice,
                version: networkConfig.MinTransactionVersion,
                nonce: nonce,
                signature: null
            };

            const computedGasFee = await this.gatewayProvider.estimateCostOfTransaction(tempTx);

            const gasLimit: IGasLimit = {
                valueOf: () => { return computedGasFee }
            };

            tx.setGasLimit(gasLimit);
            const keyfile = await window.electron.fileAccess.readFile(userSettings.keyfilePath!); 
            const userSecretKey: UserSecretKey = UserWallet.decryptSecretKey(JSON.parse(keyfile.toString()), password);
            const userSigner = new UserSigner(userSecretKey);
            await userSigner.sign(tx);
            const result = await this.gatewayProvider.sendTransaction(tx);
            return result.length > 0;
            
        } catch (err: any) {
            alert(`Create account failed, close the app and try again: ${err}`);
            return false;
        }
    }

    async transfer(
        receiverAddress: string, 
        amount: string,
        userSettings: IUserSettings,
        password: string,
        isEsdtTransfer: boolean): Promise<string> {
            const networkConfig = await this.getNetworkConfig();
            const senderAccount = await this.getAccount(userSettings.walletAddress);
            const amountConverted = isEsdtTransfer 
                ? TokenPayment.fungibleFromAmount(appConstants.AERO_TOKEN_ID_DEVNET, amount, 18)
                : TokenPayment.egldFromAmount(amount);

            const builder = new ESDTTransferPayloadBuilder();
            builder.setPayment(amountConverted);

            const tx = new Transaction({
                sender: new Address(userSettings.walletAddress),
                receiver: new Address(receiverAddress),
                value: isEsdtTransfer ? "0" : TokenPayment.egldFromAmount(amount),
                data: isEsdtTransfer ? builder.build() : undefined,
                gasLimit: isEsdtTransfer ? 400000 : networkConfig.MinGasLimit,
                gasPrice: networkConfig.MinGasPrice,
                chainID: networkConfig.ChainID,
                nonce: senderAccount.nonce,
                version: new TransactionVersion(networkConfig.MinTransactionVersion)
            });

            const keyfile = await window.electron.fileAccess.readFile(userSettings.keyfilePath!); 
            const userSecretKey: UserSecretKey = UserWallet.decryptSecretKey(JSON.parse(keyfile.toString()), password);
            const userSigner = new UserSigner(userSecretKey);
            await userSigner.sign(tx);
            const hash = await this.gatewayProvider.sendTransaction(tx);
            return hash;
    }

    async getChartrAccount(address: string, pubKeyHex: string): Promise<IChartrAccount | null> {
        try {
            const query: IContractQuery = {
                address: new Address(this.scAddress),
                func: "getAccount",
                caller: new Address(address),
                value: "0",
                getEncodedArguments: () => [pubKeyHex]
            };
    
            const response = await this.gatewayProvider.queryContract(query);
            return this.queryResponseToChartrAccount(response);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    async getNetworkConfig(): Promise<NetworkConfig> {
        try {
            return await this.gatewayProvider.getNetworkConfig();
        } catch (err: any) {
            throw new Error(err);
        }
    }

    async getEgldPrice(): Promise<string> {
        try {
            const result = await this.apiProvider.doGetGeneric("economics");
            return result.price;
        } catch (err: any) {
            console.log(err);
            return "Currently Unavailable"
        }
    }

    async getAeroPrice(): Promise<string> {
        try {
            const result = await this.apiProvider.doGetGeneric(`tokens/${appConstants.AERO_TOKEN_ID}`);
            const price: number = result.price.toNumber();
            return price.toPrecision(2);
        } catch (err: any) {
            console.log(err);
            return "Currently Unavailable"
        }
    }

    /** 
     * If no callsign exists for this address we can safely assume
     *  user has not created an account yet.
    */
    async checkAccountExists(address: string, pubKeyHex: string): Promise<boolean> {
        try {
         const query: IContractQuery = {
             address: new Address(this.scAddress),
             func: "getCallsign",
             caller: new Address(address),
             value: "0",
             getEncodedArguments: () => [pubKeyHex]
         };
 
         const response = await this.gatewayProvider.queryContractString(query);
         return response.length > 0;
        } catch (err: any) {
            return false;
        }
     }

    async checkUserNameExists(username: string): Promise<boolean> {
       try {
        const query: IContractQuery = {
            address: new Address(this.scAddress),
            func: "getAddress",
            caller: new Address(this.senderAddress),
            value: "0",
            getEncodedArguments: () => [Buffer.from(username).toString("hex")]
        };

        // If this succeeds that means it found an existing username,
        // otherwise an exception is thrown (not sure why, need to investigate that)
        const response = await this.gatewayProvider.queryContractString(query);
        return response.length > 0;
       } catch (err: any) {
           return false;
       }
    }

    async getTransactionHistory(address: string): Promise<ITransactionHistoryItem[]> {
        try {
            const response = await this.apiProvider.doGetGeneric(`accounts/${address}/transactions?withScResults=true`);
            return response;
        } catch (err: any) {
            throw new Error(err);
        }
    }

    isValidAddress(address: string): boolean {
        try {
            const addr = Address.fromBech32(address);
            return addr.bech32() === address;
        } catch(error: any) {
            return false;
        }
    }

    private queryResponseToChartrAccount(queryResponse: ContractQueryResponse): IChartrAccount | null {
        if (!queryResponse 
            || !queryResponse.returnData 
            || queryResponse.returnData.length === 0 
            || queryResponse.returnData[0].length === 0) {
            return null;
        }

        try {
            // The returnData is a base64 encoded string array, so we need to decode it as such
            const parts = queryResponse.getReturnDataParts();
            const accountObj: IChartrAccount[] = JSON.parse(parts[0].toString());
            return accountObj[0];
        } catch (err: any) {
            return null;
        }
    }
}