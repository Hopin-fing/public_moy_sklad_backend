import { IStock } from '@src/Contexts/MoySklad/Stock/domain/Stock';
import MoySkladApi from '../MoySkladApi';

export default class MSGetStockListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/report/stock/bystore/current';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<IStock[]> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<IStock[]> {
        return await this.SendRequest();
    }
}
