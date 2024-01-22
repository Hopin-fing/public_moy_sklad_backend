import Counterparty from '@src/Contexts/DM/Counterparties/domain/Counterparty';
import DMApi from '../DMApi';

export default class DMSendPoductsStocksExecutor extends DMApi {
    REQUEST_TYPE = 'PUT';
    REQUEST_URL = '/fbs/v1/api/1c/stocks';

    constructor(body: unknown) {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
        this.body = body;
    }

    async execute(): Promise<Counterparty[]> {
        const res = await this.handleResponse();
        return res;
    }

    protected async handleResponse(): Promise<Counterparty[]> {
        return await this.SendRequest().catch((err: Error) => Error(`Ошибка: ${err.message}`));
    }
}
