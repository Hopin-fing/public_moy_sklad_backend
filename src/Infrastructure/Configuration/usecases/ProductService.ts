import { injectable } from 'inversify';
import MSGetProductListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetProductListExecutor';
import MSProduct, { IProduct, TSearchResult } from '@src/Contexts/MoySklad/Product/domain/Product';
import DMProduct, { TDataProduct } from '@src/Contexts/DM/Product/domain/Product';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import { TProductDTO, TRemoveProductDTO } from '@src/Infrastructure/DTO/TProductDTO';
import DMGetSearchResultExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMGetSearchResultExecutor';
import DMGetProductListExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMGetProductListExecutor';
import { TProductObject } from '@src/Contexts/DM/types/TProductObject';

type TItemUom = {
    uom_id: string;
    uom_name: string;
};
interface IRequestBody {
    portal_id: number;
    uuid: string;
}

@injectable()
export default class ProductService {
    public async GetProductList(limit: string, offset: string) {
        const DMContent = await new DMGetProductListExecutor(limit, offset).execute(),
            products = new DMProduct(DMContent),
            DMResult = products.getContent(),
            DMTotalSize = products.getTotalSize(),
            existingProduct = await this.GetExistingProductFromBD(DMResult),
            result: TProductObject[] = [];
        DMResult.forEach((item) => {
            if (item.status === 'active') {
                const resultObject: TProductObject = { uuid: item.uuid, dm_name: item.name, dm_main_barcode: item.main_barcode, dm_vendor_code: item.vendor_code };
                this.AddExtraProperties(existingProduct, item, resultObject, result);
            }
        });
        return { totalSize: DMTotalSize, products: result };
    }

    public async SearchMSProduct(text: string) {
        let result: TSearchResult[] = [],
            totalSize,
            reqSize,
            offset = 0;
        do {
            const MSRequest = await new MSGetProductListExecutor(offset).execute(),
                product = new MSProduct(MSRequest),
                MSContent = product.getSearchResult(text.toLowerCase().trim());
            totalSize = product.getTotalSize();
            reqSize = MSContent.length;
            result = result.concat(MSContent);
            offset += 1000;
        } while (totalSize > reqSize && totalSize > offset);
        const uomList = await new MiddlewareMysql().getMultiple('uom');
        result = result.slice(0, 3).map((item) => {
            let uomName = uomList.find((itemUom: TItemUom) => item.uom?.includes(itemUom.uom_id))?.['uom_name'];
            uomName = uomName ? uomName : 'Присвоенная ед. изм.';
            item.uom = uomName;
            return item;
        });

        return result;
    }

    public async SearchDMProduct(text: string) {
        text = this.UpdateText(text);
        const DMRequest = await new DMGetSearchResultExecutor(text).execute();
        const DMContent = new DMProduct(DMRequest).getSearchResult(),
            existingProduct = await this.GetExistingProductFromBD(DMContent),
            result: TProductObject[] = [];
        DMContent.forEach((item) => {
            this.AddExtraProperties(existingProduct, item, item, result);
        });
        return DMContent;
    }

    public async SetProduct(relationDto: TProductDTO) {
        const objReq = { portal_id: relationDto.portal_id, ms_id: relationDto.ms_id },
            res = await new MiddlewareMysql().findByManyParamValue([objReq], 'product');
        await new MiddlewareMysql().createMultiple([relationDto], 'product');
    }

    public async RemoveProduct(products: TRemoveProductDTO): Promise<void> {
        const { uuid, portal_id } = products;
        return await new MiddlewareMysql().removeProduct(portal_id, uuid);
    }

    private UpdateText(text: string) {
        return encodeURI(text);
    }

    private AddExtraProperties(existingProduct: TProductDTO[], item: TDataProduct | TProductObject, resultObject: TProductObject, result: TProductObject[]) {
        const isExist = existingProduct.find((product) => item.uuid === product.uuid);
        if (isExist) {
            resultObject.ms_id = isExist.ms_id;
            resultObject.ms_name = isExist.ms_name;
            resultObject.ms_main_barcode = isExist.ms_main_barcode;
            resultObject.ms_multiplier_product = isExist.ms_multiplier_product;
            resultObject.uom = isExist.uom_name;
        }
        result.push(resultObject);
    }

    private async GetExistingProductFromBD(products: TDataProduct[] | TProductObject[]): Promise<TProductDTO[]> {
        const resquestBody: IRequestBody[] = [];
        products.forEach((product) => {
            if (product.uuid)
                resquestBody.push({
                    portal_id: +process.env.DM_PORTAL_ID,
                    uuid: product.uuid
                });
        });
        const result = await new MiddlewareMysql().findByManyParamValue(resquestBody, 'product');
        return result;
    }
}
