import TYPES from '@src/constants/types';
import UOMService from '@src/Infrastructure/Configuration/usecases/UOMService ';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import asyncHandler from '../middleware/async';

@controller('/uom')
export default class UOMController {
    constructor(@inject(TYPES.UOMService) private uomService: UOMService) {}

    // Запись всех дефолтных единиц измерения в БД, которые есть в МС
    // Метод использоваля единожды при создании БД т.к. во всех кабинетах единицы измерения одинаковые, а кастомные мы решили не добавлять
    @httpGet('/db/set')
    public async SetUOMList(@request() req: express.Request, @response() res: express.Response) {
        return asyncHandler(this.uomService.SetUOMList(), res);
    }
}
