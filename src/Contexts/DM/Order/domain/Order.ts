import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';

interface IResultForRequestBD {
    portal_id: number;
    uuid?: string[];
    warehouse_dm_id?: number | number[];
    cabinet_dm_id?: number | number[];
}
interface IResultForRequestBD {
    portal_id: number;
    uuid?: string[];
    warehouse_dm_id?: number | number[];
    cabinet_dm_id?: number | number[];
}
export interface IOrdersFromJournal {
    id: number;
    portal_id: number;
    status_number: number;
    dm_id: number;
    ms_id: string;
}
export interface IDBConterparty {
    id: number;
    portal_id: number;
    cabinet_dm_id: number;
    cabinet_dm_name: string;
    counterparty_ms_id: string;
    counterparty_MS_name: string;
    contract_ms_id: string;
    contract_MS_name: string;
}
export interface IDBWarehouse {
    id: number;
    portal_id: number;
    warehouse_dm_id: number;
    warehouse_dm_name: string;
    warehouse_ms_id: string;
    warehouse_MS_name: string;
}
export interface IStatusOption {
    status_number: number;
    status_id: string;
    ms_status_name: 'Новый' | 'Отгружен' | 'Отменен' | 'Подтвержден' | 'Собран' | 'Доставлен';
    dm_status_name: 'new' | 'delivering' | 'delivered' | 'ready_to_pack' | 'ready_for_shipment' | 'cancelled';
}
export interface IDataStatusForJournalDB {
    idDM: number;
    numberStatus: number;
}
export interface IOrdersFromDMProduct {
    uuid: string;
    quantity: number;
    price: number;
}
export interface IOrdersFromDM {
    id: number;
    portal_id: number;
    cabinet_dm_id: number;
    products: IOrdersFromDMProduct[];
    posting_number: string;
    accepted_at: string | null;
    shipment_date: string;
    status_id: string;
    warehouse_dm_id: number;
}
export interface IUpdateOrder {
    status_number: number;
    dm_id: number;
    ms_id: string;
    portal_id?: number;
}

export default class Order {
    private _statusList: IStatusOption[] = [];
    private _organizationList: TOrganizationDTO[] = [];
    private _ordersFromDM: IOrdersFromDM[] = [];
    private _updateOrders: IUpdateOrder[] = [];
    private _ordersFromJournal: IOrdersFromJournal[] = [];
    private _dataFromDBProduct: IResultForRequestBD[] = [];
    private _dataFromDBCounterparty: IResultForRequestBD[] = [];
    private _dataFromDBWarehouse: IResultForRequestBD[] = [];
    public _arrOrderIdDM: string[] = [];

    get statusList() {
        return this._statusList;
    }
    get organizationList() {
        return this._organizationList;
    }
    get ordersFromDM() {
        return this._ordersFromDM;
    }
    get updateOrders() {
        return this._updateOrders;
    }
    get ordersFromJournal() {
        return this._ordersFromJournal;
    }
    get dataFromDBProduct() {
        return this._dataFromDBProduct;
    }
    get dataFromDBCounterparty() {
        return this._dataFromDBCounterparty;
    }
    get dataFromDBWarehouse() {
        return this._dataFromDBWarehouse;
    }

    set statusList(data: IStatusOption[]) {
        this._statusList = data;
    }
    set organizationList(data: TOrganizationDTO[]) {
        this._organizationList = data;
    }
    set ordersFromDM(data: IOrdersFromDM[]) {
        this._ordersFromDM = data;
    }
    set updateOrders(data: IUpdateOrder[]) {
        this._updateOrders = data;
    }
    set ordersFromJournal(data: IOrdersFromJournal[]) {
        this._ordersFromJournal = data;
    }
    set dataFromDBProduct(data: IResultForRequestBD[]) {
        this._dataFromDBProduct = data;
    }
    set dataFromDBCounterparty(data: IResultForRequestBD[]) {
        this._dataFromDBCounterparty = data;
    }
    set dataFromDBWarehouse(data: IResultForRequestBD[]) {
        this._dataFromDBWarehouse = data;
    }

    public prepareParameterForReqBD() {
        this._dataFromDBProduct = this.filterDMResponse('products');
        this._dataFromDBCounterparty = this.filterDMResponse('cabinet_dm_id');
        this._dataFromDBWarehouse = this.filterDMResponse('warehouse_dm_id');
    }

    private filterDMResponse(key: 'cabinet_dm_id' | 'warehouse_dm_id' | 'products') {
        const firstFilter: IResultForRequestBD[] = [];
        const setKeyObject = (object: IResultForRequestBD, arg: (string | number)[] | number): IResultForRequestBD => {
            if (key === 'products' && Array.isArray(arg) && typeof arg[0] === 'string') object.uuid = arg as string[];
            if (Array.isArray(arg) && key !== 'products' && typeof arg[0] === 'number') object[key] = arg as number[];
            if (!Array.isArray(arg) && key !== 'products') object[key] = arg;
            return object;
        };
        this.ordersFromDM.forEach((order: IOrdersFromDM) => {
            const portal_id = order.portal_id;
            let secProp: string[] | number | string =
                    key === 'products'
                        ? order[key].map((product) => {
                              return product.uuid;
                          })
                        : order[key],
                isOrderExist = firstFilter.find((item) => {
                    const checkingValue = key === 'products' ? item.uuid.toString() : item[key],
                        existingValue = Array.isArray(secProp) ? secProp.toString() : secProp,
                        isPortalIdExist = item.portal_id === portal_id,
                        isSecPropExist = checkingValue === existingValue;
                    return isPortalIdExist && isSecPropExist;
                });
            if (!isOrderExist) {
                const object: IResultForRequestBD = { portal_id };
                firstFilter.push(setKeyObject(object, secProp));
            }
        });
        const result: IResultForRequestBD[] = [];
        firstFilter.forEach((order) => {
            const isPortalIdExist = result.find((newOrder) => newOrder.portal_id === order.portal_id);
            if (!isPortalIdExist) {
                const arrOrder = firstFilter.filter((newOrder) => newOrder.portal_id === order.portal_id);
                let arrSecProp: (string | number)[] = [];
                arrOrder.forEach((item) => {
                    if (item.uuid) arrSecProp = [...new Set([...arrSecProp, ...item.uuid])];
                    if (!item.uuid && key !== 'products') arrSecProp.push(item[key] as number);
                });
                const object = {
                    portal_id: order.portal_id
                };
                result.push(setKeyObject(object, arrSecProp));
            }
        });
        return result;
    }
}
