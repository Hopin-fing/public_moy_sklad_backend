import Counterparty from '@src/Contexts/MoySklad/Counterparty/domain/Counterparty';
import MoySkladApi from '../MoySkladApi';

export default class MSGetCounterpartyListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/counterparty';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<Counterparty> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<Counterparty> {
        return await this.SendRequest();
    }
}
