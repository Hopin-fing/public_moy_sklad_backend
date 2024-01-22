import TYPES from '@src/constants/types';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import OrderService from '@src/Infrastructure/Configuration/usecases/OrderService';
import asyncHandler from '../middleware/async';

@controller('/order')
export default class OrderController {
    constructor(@inject(TYPES.OrderService) private orderService: OrderService) {}

    // Запуск синхронизации заказов с МС и ДМ в процессе таже появляются/обновляются заказы на БД
    @httpGet('/context/item')
    public async SendOrderProduct(@request() req: express.Request, @response() res: express.Response) {
        return await asyncHandler(this.orderService.SendOrderProduct(), res);
    }
}
