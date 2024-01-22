enum EnumBarcodes {
    ean8,
    ean13,
    code128,
    gtin
}
enum EnumTrackingType {
    ELECTRONICS,
    LP_CLOTHES,
    LP_LINENS,
    MILK,
    NCP,
    NOT_TRACKED,
    OTP,
    PERFUMERY,
    SHOES,
    TIRES,
    TOBACCO,
    WATER
}
enum EnumPaymentItemType {
    GOOD,
    EXCISABLE_GOOD,
    COMPOUND_PAYMENT_ITEM,
    ANOTHER_PAYMENT_ITEM
}
enum EnumTaxSystem {
    GENERAL_TAX_SYSTEM,
    PATENT_BASED,
    PRESUMPTIVE_TAX_SYSTEM,
    SIMPLIFIED_TAX_SYSTEM_INCOME,
    SIMPLIFIED_TAX_SYSTEM_INCOME_OUTCOME,
    TAX_SYSTEM_SAME_AS_GROUP,
    UNIFIED_AGRICULTURAL_TAX
}

type TEnumBarcodes = {
    [key in EnumBarcodes]: string;
};

type TMetaData = {
    href: string;
    metadataHref?: string;
    type: string;
    mediaType: string;
    uuidHref?: string;
    downloadHref?: string;
    size?: number;
    limit?: number;
    offset?: number;
};
type TPrice = {
    value: number;
    currency?: { meta: TMetaData };
    priceType?: { meta: TMetaData };
};

export default interface IProductMSDto {
    name: string;
    // code?: string,
    // externalCode?: string,
    // description?: string,
    // vat?: number,
    // effectiveVat?: number,
    // discountProhibited?: boolean,
    // uom?:{meta:TMetaData},
    // supplier?:{meta:TMetaData},
    minPrice?: TPrice;
    buyPrice?: TPrice;
    // salePrice?:[TPrice],
    barcodes?: [
        // {EnumBarcodes:string}
        { [key in EnumBarcodes]?: string }
    ];
    article?: string;
    weight?: number;
    volume?: number;
    packs?: [
        {
            uom: { meta: TMetaData };
            quantity: number;
        }
    ];
    isSerialTrackable?: boolean;
    trackingType?: EnumTrackingType;
}
