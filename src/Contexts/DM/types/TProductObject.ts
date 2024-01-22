export type TProductObject = {
    uuid: string;
    dm_name: string;
    dm_main_barcode: string;
    dm_vendor_code: string;
    ms_id?: string;
    ms_name?: string;
    ms_main_barcode?: number;
    ms_multiplier_product?: number;
    uom?: string;
};
