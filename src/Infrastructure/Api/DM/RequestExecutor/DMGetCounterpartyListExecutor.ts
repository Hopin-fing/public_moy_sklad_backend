import Counterparty from '@src/Contexts/DM/Counterparties/domain/Counterparty';
import DMApi from '../DMApi';

export default class DMGetCounterpartyListExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/marketplaces/v1/api/cabinets';

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
        return await this.SendRequest().catch((err: Error) => Error(`Ошибка: ${err.message}`));
    }
}
