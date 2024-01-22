export type TReqWarehouse = {
    id: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    meta: [];
    data: TData[];
};
export type TData = {
    id: number;
    name: string;
    portalId: number;
    is_address_storage: boolean;
    is_oversized_storage: boolean;
    sort: number;
    addresses: TAddress[];
    cabinets: TCabinets[];
};
export type TAddress = {
    id: number;
    name: string;
    sort: number;
};
export type TCabinets = {
    cabinet_id: number;
    mp_warehouse_id: number;
};
