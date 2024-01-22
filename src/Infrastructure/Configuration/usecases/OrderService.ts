import { injectable } from 'inversify';
import { IOrdersFromJournal, IUpdateOrder } from '@src/Contexts/DM/Order/domain/Order';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import Order, { IDBConterparty, IDBWarehouse, IOrdersFromDM, IOrdersFromDMProduct, IStatusOption } from '@src/Contexts/DM/Order/domain/Order';
import MSCreateOrderExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSCreateOrderExecutor';
import DMGetOrderListExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMGetOrderListExecutor';
import { OrderWriter } from '@src/Contexts/DM/Order/application/OrderWriter';
import MSGetStatusListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetStatusListExecutor';
import MSGetOrderListByStatusExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetOrderListByStatusExecutor';
import { IDataOrder, IDBProduct, IReqOrder, OrderRequestCreator } from '@src/Contexts/DM/Order/application/OrderRequestCreator';
import MSUpdateOrderExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSUpdateOrderExecutor';
import MSGetOrderListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetOrderListExecutor';
import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';
import ErrorResponse from '@src/Infrastructure/Utils/errorResponse';

interface IGetOrderList {
    orderList: IOrdersFromDM[];
    updateData: IUpdateOrder[];
}
interface IOrderDM<T> {
    [key: string | number]: T;
}
interface IOrderUpdateDB {
    portal_id: number;
    ms_id: string;
    status_number: number;
}

type TDeliveredOrder = Pick<IOrdersFromJournal, 'dm_id' | 'ms_id' | 'status_number'>;

@injectable()
export default class OrderService {
    portal_id = +process.env.DM_PORTAL_ID;

    public async SendOrderProduct() {
        const order = new Order(),
            orderReq = new OrderRequestCreator();
        await this.CreateOrderProduct(order, orderReq);
        if (order.updateOrders.length === 0) return { message: 'Все статусы заказов актуальны' };
        await this.UpdateOrderProduct(order, orderReq);
        await this.UpdateBD(order, this.portal_id);
        return { message: 'Все статусы обновлены' };
    }

    private async CreateOrderProduct(contextOrder: Order, contextOrderReq: OrderRequestCreator) {
        contextOrder.statusList = await this.GetStatusList();
        contextOrder.organizationList = await this.GetOrganizationList(this.portal_id);
        const resOrdersFromDM = await this.GetOrderFromDB(contextOrder.statusList);
        contextOrder.ordersFromJournal = await this.GetDBOrderJournal(this.portal_id);
        const { orderList, updateData } = await this.GetDMOrderList(resOrdersFromDM, contextOrder.statusList, contextOrder.ordersFromJournal),
            deliveredOrders = this.FindDeliveredOrderInDB(resOrdersFromDM, contextOrder.ordersFromJournal);
        contextOrder.updateOrders = updateData.concat(deliveredOrders);
        contextOrder.ordersFromDM = orderList;
        contextOrder.prepareParameterForReqBD();
        const DBProduct = await this.GetDBProduct(contextOrder.dataFromDBProduct),
            DBConterparty = await this.GetDBConterparty(contextOrder.dataFromDBCounterparty),
            DBWarehouse = await this.GetDBWarehouse(contextOrder.dataFromDBWarehouse),
            { requestBody, arrId } = contextOrderReq.createBodyReq(DBProduct, DBConterparty, DBWarehouse, orderList, contextOrder.statusList, contextOrder.organizationList);
        if (!requestBody) return { message: 'Обновления не требуются' };
        const response = await new MSCreateOrderExecutor(requestBody).execute(),
            orderWriter = new OrderWriter(response, arrId).run();
        await this.SetDBOrderJournal(orderWriter);
        return { message: 'Все изменения загружены' };
    }

    private async UpdateBD(contextOrder: Order, portal_id: number) {
        const ResponseMoySklad = await new MSGetOrderListExecutor().execute(),
            currentOrders = ResponseMoySklad.map((order) => {
                const arrStrings = order.state.meta.href.split('/'),
                    statusId = arrStrings[arrStrings.length - 1],
                    statusNumber = contextOrder.statusList.find((status) => status.status_id === statusId).status_number;
                return {
                    idMS: order.id,
                    statusId,
                    statusNumber: statusNumber
                };
            }),
            ordersUpdate: IOrderUpdateDB[] = [];
        contextOrder.ordersFromJournal.forEach((oldOrder) => {
            const currentOrder = currentOrders.find((order) => order.idMS === oldOrder.ms_id);
            if (!currentOrder) return;
            if (oldOrder.status_number !== currentOrder.statusNumber) {
                const object = {
                    portal_id,
                    ms_id: currentOrder.idMS,
                    status_number: currentOrder.statusNumber
                };
                ordersUpdate.push(object);
            }
        });
        for (const order of ordersUpdate) {
            const res = await new MiddlewareMysql().updateJournalOrders(order.portal_id, order.ms_id, order.status_number, 'order_journal');
            if (res.length === 0) throw new ErrorResponse('Обновить БД не удалось', 500);
        }
    }

    private async UpdateOrderProduct(contextOrder: Order, contextOrderReq: OrderRequestCreator) {
        for (const order of contextOrder.updateOrders) {
            const idStatus = contextOrder.statusList.find((status) => status.status_number === order.status_number).status_id,
                bodyReq = contextOrderReq.createOrderUpdate('state', idStatus);
            await new MSUpdateOrderExecutor(order.ms_id, bodyReq).execute();
        }
    }

    private async GetDMOrderList(dataDM: IOrderDM<IReqOrder['data']>, statuses: IStatusOption[], oldOrders: IOrdersFromJournal[]): Promise<IGetOrderList> {
        let result: IOrdersFromDM[][] = [],
            updateData: IUpdateOrder[] = [],
            filteredDataDM: IOrderDM<IReqOrder['data']> = {};

        Object.keys(dataDM).forEach((numberIdStatus) => {
            const statusId = statuses.find((status) => status.status_number === +numberIdStatus)?.status_id;
            filteredDataDM[numberIdStatus] = dataDM[numberIdStatus].filter((item) => {
                const isExistOldOrder = oldOrders.find((oldOrder) => oldOrder.dm_id === item.id),
                    isNumNumberIdStatus = +numberIdStatus;
                if (!isExistOldOrder) return true; //@desc Возвращает заказы которых нет в БД
                if (isExistOldOrder.status_number !== isNumNumberIdStatus) {
                    const object = {
                        status_number: isNumNumberIdStatus,
                        dm_id: isExistOldOrder.dm_id,
                        ms_id: isExistOldOrder.ms_id
                    };
                    updateData.push(object); //@desc Возвращает заказы которых есть в БД, но у них другой статус
                    return;
                }
            });
            result.push(this.FilterStatusArr(filteredDataDM[numberIdStatus], statusId, this.portal_id));
        });
        return { orderList: result.flat(), updateData };
    }

    private FilterStatusArr(data: IReqOrder['data'], statusId: string, portal_id: number): IOrdersFromDM[] {
        const getData = (order: IDataOrder) => {
            try {
                const regex = new RegExp(/\.\d.*$/),
                    dataAccepted = order.accepted_at?.replace('T', ' ').replace(regex, '') ?? null,
                    dataShipment = order.shipment_date ? order.shipment_date.replace('T', ' ').replace(regex, '') : order.shipment_date;
                return { accepted_at: dataAccepted, shipment_date: dataShipment };
            } catch (e) {
                console.log('order', order);
                console.log('Ошибка в дате заказа ДМ', e);
            }
            const regex = new RegExp(/\.\d.*$/),
                dataAccepted = order.accepted_at.replace('T', ' ').replace(regex, ''),
                dataShipment = order.shipment_date.replace('T', ' ').replace(regex, '');
            return { accepted_at: dataAccepted, shipment_date: dataShipment };
        };
        return data.map((order) => {
            const products: IOrdersFromDMProduct[] = order.products.map((product: any) => {
                    return {
                        uuid: product.product.uuid,
                        quantity: product.quantity,
                        price: parseFloat(product.price.value)
                    };
                }),
                { accepted_at, shipment_date } = getData(order);

            return {
                id: order.id,
                portal_id,
                cabinet_dm_id: order.cabinet_id,
                products,
                posting_number: order.posting_number,
                accepted_at,
                shipment_date,
                status_id: statusId,
                warehouse_dm_id: order.products[0].stock_reserves[0]?.warehouse_id ?? null //@desc Берем первый указанный в заказе склад
            };
        });
    }

    private FindDeliveredOrderInDB(currentOrdersDM: IOrderDM<IReqOrder['data']>, oldOrders: IOrdersFromJournal[]): TDeliveredOrder[] {
        const result: TDeliveredOrder[] = [],
            allCurrentOrders: IReqOrder['data'] = Object.values(currentOrdersDM)
                .reduce((first, second) => first.concat(second))
                .flat(),
            arrCurrentOrdersId: number[] = allCurrentOrders.map((order) => order.id);
        oldOrders.forEach((oldOrder) => {
            const { dm_id, ms_id } = oldOrder;
            if (!arrCurrentOrdersId.includes(dm_id)) result.push({ dm_id, ms_id, status_number: 6 });
        });
        return result;
    }

    private async GetDBOrderJournal(portal_id: number) {
        const arg = [
            {
                portal_id,
                status_number: [1, 2, 3, 4, 5]
            }
        ];
        const DBRes: IOrdersFromJournal[] = await new MiddlewareMysql().findByManyParamValue(arg, 'order_journal');
        return DBRes;
    }

    private GetOrderFromDB = async (statuses: IStatusOption[]) => {
        //@desc возвращает заказы, которые находяться в ДМ и не имеют статуса "delivered"
        const result: IOrderDM<IReqOrder['data']> = {};
        for (const status of statuses) {
            if (status.dm_status_name === 'delivered') continue; //@desc Неотправляю заказы которые доставлены тк на момент написания скрипта их в ДМ неколько десятков тысяч
            const data = await new DMGetOrderListExecutor(status.dm_status_name).execute();
            result[status.status_number] = data;
        }

        return result;
    };

    private async GetStatusList(): Promise<IStatusOption[]> {
        const DBRes = await new MiddlewareMysql().getMultiple('status'),
            MSRes = await new MSGetStatusListExecutor().execute();
        if (DBRes.length === 0) throw new ErrorResponse('Список статусов Мой Склад не найден', 500);
        if (MSRes.length === 0) throw new ErrorResponse('Ошибка в получении Id статусов', 500);
        DBRes.forEach((status: any) => (status.status_id = MSRes.find((statusMS) => statusMS.name === status.ms_status_name).id));
        return DBRes;
    }

    private async GetOrganizationList(portal_id: number): Promise<TOrganizationDTO[]> {
        const arg = [{ portal_id }];
        const DBRes = await new MiddlewareMysql().findByManyParamValue(arg, 'organization');
        if (DBRes.length === 0) throw new ErrorResponse('Организаций в БД не найдено', 500);
        return DBRes;
    }

    private async GetDBProduct(arg: any[]): Promise<IDBProduct[]> {
        const res = await new MiddlewareMysql().findByManyParamValue(arg, 'product');
        if (res.length === 0) throw new ErrorResponse('Привязки товара к Мой Склад не найдено', 500);
        return res;
    }

    private async GetDBConterparty(arg: any[]): Promise<IDBConterparty[]> {
        const res = await new MiddlewareMysql().findByManyParamValue(arg, 'counterparty');
        if (res.length === 0) throw new ErrorResponse('Привязки контрагентов к Мой Склад не найдено', 500);
        return res;
    }

    private async GetDBWarehouse(arg: any[]): Promise<IDBWarehouse[]> {
        const res = await new MiddlewareMysql().findByManyParamValue(arg, 'warehouse');
        if (!res) throw new ErrorResponse('Привязки складов к Мой Склад не найдено', 500);
        return res;
    }

    private async SetDBOrderJournal(arg: any[]): Promise<any> {
        const res = await new MiddlewareMysql().createMultiple(arg, 'order_journal');
        if (!res.status) throw new ErrorResponse('Ошибка сохранения данных обратной связи', 500);
        return res.status;
    }
}
