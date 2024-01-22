import TYPES from '@src/constants/types';
import StockService from '@src/Infrastructure/Configuration/usecases/StockService';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import asyncHandler from '../middleware/async';

@controller('/stock')
export default class StockController {
    constructor(@inject(TYPES.StockService) private stockService: StockService) {}

    // Обновление остатков на ДМ
    @httpGet('/context/item')
    public async GetStockList(@request() req: express.Request, @response() res: express.Response) {
        return asyncHandler(this.stockService.setStocks(), res);
    }
}
