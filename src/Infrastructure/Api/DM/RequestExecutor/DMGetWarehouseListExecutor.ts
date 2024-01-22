import Warehouses from '@src/Contexts/DM/Warehouses/domain/Warehouses';
import DMApi from '../DMApi';

export default class DMGetWarehouseListExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/fbs/v1/api/warehouses';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<Warehouses> {
        const res = await this.handleResponse();
        return res;
    }

    protected async handleResponse(): Promise<Warehouses> {
        return await this.SendRequest();
    }
}
