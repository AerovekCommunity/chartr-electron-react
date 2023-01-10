import { ApiNetworkProvider } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers";
import { IContractQuery } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/interface";
import { ErrContractQuery } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/errors";
import { ContractQueryRequest } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/contractQueryRequest";
import { ContractQueryResponse } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/contractQueryResponse";
import { FungibleTokenOfAccountOnNetwork } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/tokens";
import { IAddress } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/interface";

export class ElrondApiProvider extends ApiNetworkProvider {
    private baseUrl: string;

    constructor(baseUrl: string) {
        super(baseUrl, { timeout: 10000 });
        this.baseUrl = baseUrl;
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    async queryContractString(query: IContractQuery): Promise<string> {
        try {
            let request = new ContractQueryRequest(query).toHttpRequest();
            let result = await super.doPostGeneric("vm-values/string", request);
            return result.data;
        } catch (error: any) {
            throw new ErrContractQuery(error);
        }
    }

    async queryContract(query: IContractQuery): Promise<ContractQueryResponse> {
        return await super.queryContract(query);
    }

    async getAccountTokenDetails(address: string, tokenId: string): Promise<FungibleTokenOfAccountOnNetwork> {
        const addr: IAddress = {
            bech32: () => { return address }
        };
        return await super.getFungibleTokenOfAccount(addr, tokenId);
    }
}