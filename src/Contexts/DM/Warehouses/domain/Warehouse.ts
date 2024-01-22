import { TAddress, TCabinets, TData } from '../types/TReqWarehouse';

export default class Warehouse implements TData {
    id: number;
    name: string;
    portalId: number;
    is_address_storage: boolean;
    is_oversized_storage: boolean;
    sort: number;
    addresses: TAddress[];
    cabinets: TCabinets[];

    constructor(bodyReq: TData) {
        (this.id = bodyReq.id),
            (this.name = bodyReq.name),
            (this.portalId = bodyReq.portalId),
            (this.is_address_storage = bodyReq.is_address_storage),
            (this.is_oversized_storage = bodyReq.is_oversized_storage),
            (this.sort = bodyReq.sort),
            (this.addresses = bodyReq.addresses),
            (this.cabinets = bodyReq.cabinets);
    }
}
