import { ProxyNetworkProvider } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers";
import { IContractQuery } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/interface";
import { ErrContractQuery } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/errors";
import { ContractQueryRequest } from "../../release/app/node_modules/@elrondnetwork/erdjs-network-providers/out/contractQueryRequest";

export class ElrondGatewayProvider extends ProxyNetworkProvider {
    constructor() {
        super("https://devnet-gateway.elrond.com", { timeout: 10000 });
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

    async estimateCostOfTransaction(transaction: any): Promise<any> {
        try {
            let result = await super.doPostGeneric("transaction/cost", JSON.stringify(transaction));
            return result.txGasUnits;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}