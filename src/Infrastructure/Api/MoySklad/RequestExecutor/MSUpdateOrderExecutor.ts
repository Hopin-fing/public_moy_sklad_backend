import { TMetaData } from '@src/Contexts/MoySklad/types/TMetaData';
import { TWarehouse } from '@src/Contexts/MoySklad/Warehouses/domain/Warehouses';
import MoySkladApi from '../MoySkladApi';

export interface IResponseOrderExecutor extends Omit<TWarehouse, 'archived' | 'pathName' | 'address'> {
    moment: string;
    applicable: string;
    rate: { currency: { meta: TMetaData } };
    sum: number;
    store: { meta: TMetaData };
    contract: { meta: TMetaData };
    agent: { meta: TMetaData };
    organization_number: { meta: TMetaData };
    state: { meta: TMetaData };
    created: string;
    printed: boolean;
    published: boolean;
    files: { meta: TMetaData };
    positions: { meta: TMetaData };
    vatEnabled: boolean;
    vatIncluded: boolean;
    vatSum: number;
    payedSum: number;
    shippedSum: number;
    invoicedSum: number;
    reservedSum: number;
}

export default class MSUpdateOrderExecutor extends MoySkladApi {
    REQUEST_TYPE = 'PUT';
    REQUEST_URL = '/api/remap/1.2/entity/customerorder/';

    constructor(id: string, body: unknown) {
        super();
        this.url = this.REQUEST_URL + id;
        this.method = this.REQUEST_TYPE;
        this.body = body;
    }

    async execute(): Promise<IResponseOrderExecutor[]> {
        return await this.handleResponse();
    }

    async handleResponse(): Promise<IResponseOrderExecutor[]> {
        return await this.SendRequest();
    }
}
