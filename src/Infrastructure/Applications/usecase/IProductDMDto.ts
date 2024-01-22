enum EnumStatProd {
    'active',
    'suspended'
}

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

type TPriceInfo = {
    product_uuid: string;
    price: number;
    before_discount_price: number;
    discount: number;
    discount_amount: number;
    created_at?: string;
    updated_at?: string;
};

export default interface IProductDMDto {
    uuid: string;
    portal_id: number;
    category_id: number | null;
    vendor_code: string;
    main_barcode: string;
    name: string;
    net_cost: string | null;
    stocks_sum: null;
    stocks_type: null;
    status: EnumStatProd;
    created_at: string;
    updated_at: string;
    additional_barcodes: [TAddBarcodes];
    price_info?: TPriceInfo;
    images?: [TImages];
}
