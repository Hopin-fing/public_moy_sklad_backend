export type TProductDTO = {
    uuid: string;
    portal_id: number;
    dm_vendor_code: string;
    dm_main_barcode: string;
    ms_name: string;
    ms_multiplier_product: number;
    ms_vendor_code: string;
    ms_main_barcode: number;
    ms_id: string;
    organization_number: number;
    uom_name: string;
};
export type TRemoveProductDTO = Pick<TProductDTO, 'uuid' | 'portal_id'>;
