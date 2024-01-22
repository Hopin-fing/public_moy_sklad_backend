import { TProductObject } from '../../types/TProductObject';

type TStatProd = 'active' | 'suspended';

type TImages = {
    uuid: string;
    portal_id: number;
    product_uuid: string;
    barcode: string;
    created_at: string;
    updated_at: string;
};
type TAddBarcodes = {
    uuid: string;
    portal_id: number;
    product_uuid: string;
    url: string;
    is_main: boolean;
    created_at: string;
    updated_at: string;
};
export type TDataProduct = {
    uuid: string;
    portal_id: number;
    category_id: number | null;
    vendor_code: string;
    main_barcode: string | null;
    name: string;
    net_cost: null;
    stocks_sum: null;
    stocks_type: null;
    status: TStatProd;
    created_at: string;
    updated_at: string;
    additional_barcodes: TAddBarcodes[];
    images: TImages[];
};

export interface IReqProduct {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
    data: TDataProduct[];
}

export default class Product implements IReqProduct {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
    data: TDataProduct[];

    constructor(bodyReq: IReqProduct) {
        this.total = bodyReq.total;
        this.limit = bodyReq.limit;
        this.offset = bodyReq.offset;
        this.has_more = bodyReq.has_more;
        this.data = bodyReq.data;
    }

    public getTotalSize(): number {
        return this.total;
    }

    public getSearchResult(): TProductObject[] {
        this.getContent();

        let result = this.data.slice(0, 3).map(({ name, vendor_code, main_barcode, uuid }) => {
            return {
                dm_name: name,
                dm_vendor_code: vendor_code,
                dm_main_barcode: main_barcode,
                uuid
            };
        });
        return result;
    }

    public getContent(): TDataProduct[] {
        return this.data;
    }
}
