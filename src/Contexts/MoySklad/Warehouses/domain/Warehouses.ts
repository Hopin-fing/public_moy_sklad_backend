import ResponseMoySklad from '../../application/ResponseMoySklad';
import { IResponse } from '../../interfaces/IResonse';
import { TMetaData } from '../../types/TMetaData';

export type TWarehouse = {
    meta: TMetaData;
    id: string;
    accountId: string;
    owner: { meta: TMetaData };
    shared: boolean;
    group: { meta: TMetaData };
    updated: string;
    name: string;
    externalCode: string;
    archived: boolean;
    pathName: string;
    address: string;
};

interface IResWarehouse extends IResponse {
    rows: TWarehouse[];
}

export default class Warehouses extends ResponseMoySklad {
    rows: TWarehouse[];

    constructor(bodyReq: IResWarehouse) {
        super(bodyReq);
        this.rows = bodyReq.rows;
    }

    getContent(): TWarehouse[] {
        const warehouseInfo = this.rows;
        return warehouseInfo;
    }
}
