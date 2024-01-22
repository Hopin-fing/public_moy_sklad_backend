import { TMetaData } from '@src/Contexts/MoySklad/types/TMetaData';
import { TWarehouse } from '@src/Contexts/MoySklad/Warehouses/domain/Warehouses';
import ErrorResponse from '@src/Infrastructure/Utils/errorResponse';
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

export default class MSCreateOrderExecutor extends MoySkladApi {
    REQUEST_TYPE = 'POST';
    REQUEST_URL = '/api/remap/1.2/entity/customerorder';

    constructor(body: unknown) {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
        this.body = body;
    }

    async execute(): Promise<IResponseOrderExecutor[]> {
        const res = await this.handleResponse();

        return res;
    }

    async handleResponse(): Promise<IResponseOrderExecutor[]> {
        const res = await this.SendRequest();
        res.forEach((product: any) => {
            if (product.errors) throw new ErrorResponse(`Ощибка: ${product.errors[0].error}`, 500);
        });
        return res;
    }
}
