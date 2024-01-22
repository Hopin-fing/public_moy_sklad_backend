import Counterparty from '@src/Contexts/DM/Counterparties/domain/Counterparty';
import DMApi from '../DMApi';

export default class DMSetOrderExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/fbs/v1/api/postings?limit=50';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<Counterparty[]> {
        const res = await this.handleResponse();
        return res;
    }

    protected async handleResponse(): Promise<Counterparty[]> {
        return await this.SendRequest();
    }
}
