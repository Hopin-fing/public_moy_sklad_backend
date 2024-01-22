import ResponseMoySklad from '../../application/ResponseMoySklad';
import { TMetaData } from '../../types/TMetaData';
import { IMainData } from '../../interfaces/IMainData';
import { IResponse } from '../../interfaces/IResonse';
import { TDataProduct } from '@src/Contexts/DM/Product/domain/Product';

// type TBarcodesKey = 'ean8' | 'ean13' | 'code128' | 'gtin';
type TBarcodes = { ean13: string };

type TPrice = {
    value: number;
    currency?: { meta: TMetaData };
    priceType?: {
        meta: TMetaData;
        id: string;
        name: string;
        externalCode: string;
    };
};
export type TSearchResult = {
    uuid: string;
    name: string;
    vendor_code: string;
    main_barcode: string;
    uom: string;
};

interface IResProduct extends IResponse {
    rows: IProduct[];
}

export interface IProduct extends IMainData {
    uom: { meta: TMetaData };
    code: string;
    article: string;
    externalCode: string;
    archived: boolean;
    pathName: string;
    useParentVat: boolean;
    images: { meta: TMetaData };
    minPrice: TPrice;
    salePrice: TPrice[];
    buyPrice: TPrice;
    barcodes: TBarcodes[];
    paymentItemType: string;
    discountProhibited: boolean;
    weight: number;
    volume: number;
    variantsCount: number;
    isSerialTrackable: boolean;
    trackingType: string;
    files: { meta: TMetaData };
}

export default class Product extends ResponseMoySklad {
    rows: IProduct[];
    size: number;

    constructor(bodyReq: IResProduct) {
        super(bodyReq);
        this.rows = bodyReq.rows;
        this.size = bodyReq.meta.size;
    }

    public getTotalSize(): number {
        return this.size;
    }

    public getContent(): IProduct[] {
        return this.rows;
    }

    public getSearchResult(text: string): TSearchResult[] {
        const result: TSearchResult[] = [];
        this.rows.forEach((product) => {
            if (product.name.toLowerCase().includes(text) || product.article?.toLowerCase().includes(text) || product.barcodes[0]?.['ean13']?.includes(text)) {
                const metaHref = product?.uom.meta.href;
                result.push({
                    name: product.name,
                    vendor_code: product.article,
                    main_barcode: product.barcodes[0]?.['ean13'],
                    uuid: product.id,
                    uom: metaHref
                });
            }
        });

        return result;
    }
}
