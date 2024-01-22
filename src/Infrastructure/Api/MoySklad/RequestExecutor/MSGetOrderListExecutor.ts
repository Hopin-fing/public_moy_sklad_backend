import MoySkladApi from '../MoySkladApi';
import { IResponse } from '@src/Contexts/MoySklad/interfaces/IResonse';
import { IResponseOrderExecutor } from './MSCreateOrderExecutor';

interface IResponseStatus extends IResponse {
    rows: IResponseOrderExecutor[];
}

export default class MSGetOrderListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/customerorder';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<IResponseStatus['rows']> {
        const { rows } = await this.handleResponse();
        return rows;
    }

    async handleResponse(): Promise<IResponseStatus> {
        return await this.SendRequest();
    }
}
