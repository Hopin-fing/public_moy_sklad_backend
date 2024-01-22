import { TData, TReqWarehouse } from '../types/TReqWarehouse';

type TWarehouseClear = Omit<TData, 'sort'>;

export default class Warehouses {
    id: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    meta: [];
    data: TData[];

    constructor(bodyReq: TReqWarehouse) {
        (this.id = bodyReq.id),
            (this.per_page = bodyReq.per_page),
            (this.current_page = bodyReq.current_page),
            (this.last_page = bodyReq.last_page),
            (this.from = bodyReq.from),
            (this.to = bodyReq.to),
            (this.meta = bodyReq.meta),
            (this.data = bodyReq.data);
    }

    getContent(): TWarehouseClear[] {
        const result: TWarehouseClear[] = [];
        this.data.forEach((item) => {
            const resultObj: TWarehouseClear = {
                id: item.id,
                name: item.name,
                portalId: item.portalId,
                is_address_storage: item.is_address_storage,
                is_oversized_storage: item.is_oversized_storage,
                addresses: item.addresses,
                cabinets: item.cabinets
            };
            result.push(resultObj);
        });
        return result;
    }
}
