import { injectable } from 'inversify';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import MSGetStockListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetStockListExecutor';
import { IDBWarehouse } from '@src/Contexts/DM/Order/domain/Order';
import DMSendPoductsStocksExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMSendPoductsStocksExecutor';
import { IDBProduct } from '@src/Contexts/DM/Order/application/OrderRequestCreator';

@injectable()
export default class StockService {
    portal_id = +process.env.DM_PORTAL_ID;

    public async setStocks() {
        const response = await new MSGetStockListExecutor().execute(),
            warehouseList = await new MiddlewareMysql().find({ portal_id: this.portal_id }, 'warehouse'),
            productList: IDBProduct[] = await new MiddlewareMysql().find({ portal_id: this.portal_id }, 'product');
        if (response.length === 0) console.log('Остатков на моем скаладе - нет');
        let finalResult = response.map((item) => {
            const warehouseId = warehouseList.find((warehouse: IDBWarehouse) => warehouse.warehouse_ms_id === item.storeId)?.['warehouse_dm_id'],
                product = productList.find((product: any) => product.ms_id === item.assortmentId),
                productId = product?.['uuid'],
                productStock = item.stock,
                amount = Math.floor(productStock / product?.['ms_multiplier_product']);
            return {
                product_uuid: productId,
                amount,
                warehouse_id: warehouseId,
                warehouse_address_id: null
            };
        });
        await new DMSendPoductsStocksExecutor(finalResult).execute();
        return;
    }
}
