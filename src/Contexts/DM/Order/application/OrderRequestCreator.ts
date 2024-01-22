import { IResponseOrderExecutor } from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSCreateOrderExecutor';
import { IDataStatusForJournalDB, IDBConterparty, IDBWarehouse, IOrdersFromDM, IStatusOption } from '../domain/Order';
import { TMetaData } from '@src/Contexts/MoySklad/types/TMetaData';
import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';

interface IPosition {
    quantity: number;
    price: number;
    assortment: { meta: TMetaData };
}
interface IBodyReq {
    organization: { meta: TMetaData };
    contract: { meta: TMetaData };
    agent: { meta: TMetaData };
    positions?: IPosition[];
    state?: { meta: TMetaData };
    price?: { meta: TMetaData };
    store?: { meta: TMetaData };
    description?: string;
    created?: string;
    deliveryPlannedMoment?: string;
}
interface ISupply {
    id: number;
    portal_id: number;
    mp_shipment_warehouse_id: number;
    mp_id: number;
    status: string;
    is_auto_created: boolean;
    shipment_date: string;
    postings_count_by_status: IPostingsCountByStatus;
    cabinet_id: number;
    cabinet: ICabinet;
    created_at: Date;
    updated_at: Date;
}
interface ICabinet {
    id: number;
    portal_id: number;
    marketplace_key: string;
    additional_label: boolean;
    allow_negative_stocks: string;
    auto_ship_enabled: boolean;
    status: string;
    last_mp_card_id: number | null;
    last_mp_order_id: number | null;
    last_sync_at: Date;
}
interface IPostingsCountByStatus {
    all: number;
    new: number;
    need_attention: number;
    ready_to_pack: number;
    ready_for_shipment: number;
    delivering: number;
    delivered: number;
    error: number;
}

interface IProduct {
    uuid: string;
    portal_id: number;
    name: string;
    vendor_code: string;
    status: string;
    barcode: IBarcodeProduct;
    additional_barcodes: IBarcodeProduct[];
    photo: IPhoto;
    stocks_type: string | null;
    created_at: Date;
    updated_at: Date;
}
interface IProducts {
    id: number;
    posting_id: number;
    card_id: number;
    quantity: number;
    price: IPrice;
    card: ICard;
    product: IProduct;
    stock_reserves: IStockReserves[];
}
interface ICard {
    uuid: string;
    portal_id: number;
    cabinet_id: number;
    product_uuid: string;
    mp_key: string;
    mp_id: string;
    name: string;
    vendor_code: string;
    photo: IPhoto;
    comment: string;
    status: string;
    is_active: boolean;
    nomenclature: string | null;
    mp_identifiers: IMpIdentifiers;
    price: IPrice;
    attributes: IAttributes;
    barcode: string[];
    archived_at: null;
    created_at: Date;
    updated_at: Date;
}
interface IPrice {
    value: string;
    currency: 'RUB';
    decimals: number;
}
interface IBarcodeProduct {
    value: string;
}
interface IAttributes {
    depth: number;
    width: number;
    height: number;
    weight: number;
}
interface IMpIdentifiers {
    fbs: string;
    fbo: string;
}
interface IPhoto {
    id: string | null;
    src_small: string | null;
    src_big: string | null;
}
interface IStockReserves {
    id: number;
    stock_id: number;
    warehouse_id: number;
    warehouse_address_id: null;
    posting_product_id: number;
    amount: number;
}
interface IDMMeta {
    all_count: string;
    agentId: string;
}
interface IBodyReqUpdate<T> {
    [key: string]: { meta: T };
}

export interface IDataOrder {
    id: number;
    cabinet_id: number;
    marketplace_key: string;
    marketplace_id: number;
    supply_id: number;
    posting_number: string;
    accepted_at: string;
    shipment_date: string;
    expected_delivery_date: Date | null;
    status: string;
    mp_status: string;
    comment: string;
    created_at: string;
    updated_at: string;
    supply: ISupply;
    products: IProducts[];
}
export interface IDBProduct {
    id: number;
    uuid: string;
    portal_id: number;
    dm_vendor_code: string;
    dm_main_barcode: string;
    ms_multiplier_product: number;
    ms_vendor_code: string;
    ms_main_barcode: string;
    organization_number: number;
    ms_id: string;
    price?: number;
    quantity?: number;
}
export interface IReqOrder {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    meta: IDMMeta;
    data: IDataOrder[];
}

export class OrderRequestCreator {
    private dataReq: IDataOrder[] = [];
    private domain = process.env.MS_DOMAIN;
    private url = `${this.domain}/api/remap/1.2/entity`;
    private organizationId = process.env.MS_ORGANIZATION;

    private getStatusNumber(statusList: IStatusOption[], statusId: string): number {
        return statusList.find((status) => status.status_id === statusId).status_number;
    }

    private createMeta(type: string, id: string): { meta: TMetaData } {
        return {
            meta: {
                href: `${this.url}/${type}/${id}`,
                type,
                mediaType: 'application/json'
            }
        };
    }

    public createBodyReq(
        DBProduct: IDBProduct[],
        DBConterparty: IDBConterparty[],
        DBWarehouse: IDBWarehouse[],
        ordersFromDM: IOrdersFromDM[],
        statusList: IStatusOption[],
        organizationList: TOrganizationDTO[]
    ) {
        const requestBody: any = [],
            arrId: IDataStatusForJournalDB[] = [];
        ordersFromDM.forEach((order) => {
            const orderObject = this.createOrder(order, DBProduct, DBConterparty, DBWarehouse, organizationList);
            if (orderObject) {
                requestBody.push(orderObject);
                arrId.push({
                    idDM: order.id,
                    numberStatus: this.getStatusNumber(statusList, order.status_id)
                });
            }
        });
        if (requestBody.length === 0) return { requestBody: null, arrId };
        this.dataReq = requestBody;
        return { requestBody, arrId };
    }

    public createOrder(dataDM: IOrdersFromDM, DBProduct: IDBProduct[], DBConterparty: IDBConterparty[], DBWarehouse: IDBWarehouse[], organizationList: TOrganizationDTO[]): any {
        const findEqual = <T extends IDBConterparty | IDBWarehouse | IDBProduct, K extends keyof T>(arr: T[], key: K) => {
            return arr.find((item) => {
                //@ts-ignore
                return item.portal_id === dataDM.portal_id && item[key] === dataDM[key];
            });
        };
        const counterpartyItem = findEqual(DBConterparty, 'cabinet_dm_id');
        if (!counterpartyItem) return null;
        const warehouseItem = findEqual(DBWarehouse, 'warehouse_dm_id');
        if (!warehouseItem) return null;
        const productArr = dataDM.products.map((product) => {
            const result = DBProduct.find((productDB) => {
                return productDB.portal_id === dataDM.portal_id && product.uuid === productDB.uuid;
            });
            if (!result) return null;
            result.quantity = Math.round(product.quantity * result.ms_multiplier_product);
            result.price = Math.round((product.price * 100) / result.quantity); // @desc Делим цену на количество тк, сумму отдельно установить нельзя:
            return result;
        });
        if (productArr.includes(null)) return null;
        const organizationId = organizationList.find((organization) => productArr[0].organization_number === organization.organization_number).organization_id;
        const statusId = dataDM.status_id,
            bodyReq: IBodyReq = {
                organization: this.createMeta('organization', organizationId ?? this.organizationId),
                agent: this.createMeta('counterparty', counterpartyItem.counterparty_ms_id),
                contract: this.createMeta('contract', counterpartyItem.contract_ms_id),
                store: this.createMeta('store', warehouseItem.warehouse_ms_id),
                description: dataDM.posting_number,
                created: dataDM.accepted_at,
                deliveryPlannedMoment: dataDM.shipment_date
            };
        if (statusId) bodyReq['state'] = this.createMeta('state', statusId);
        bodyReq['positions'] = productArr.map((product) => {
            return {
                quantity: product.quantity,
                price: product.price,
                assortment: this.createMeta('product', product.ms_id)
            };
        });

        return bodyReq;
    }

    public createOrderUpdate(nameField: string, id: string) {
        const result: IBodyReqUpdate<TMetaData> = {};
        result[nameField] = this.createMeta(nameField, id);
        return result;
    }
}
