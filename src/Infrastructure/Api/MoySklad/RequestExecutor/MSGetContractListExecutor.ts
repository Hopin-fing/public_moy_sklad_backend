import Contract from '@src/Contexts/MoySklad/Contract/domain/Contract';
import MoySkladApi from '../MoySkladApi';

export default class MSGetContractListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/contract';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<Contract> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<Contract> {
        return await this.SendRequest();
    }
}
