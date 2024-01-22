import Warehouses from '@src/Contexts/MoySklad/Warehouses/domain/Warehouses';
import MoySkladApi from '../MoySkladApi';

export default class MSGetWarehouseListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/store';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<Warehouses> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<Warehouses> {
        return await this.SendRequest();
    }
}
