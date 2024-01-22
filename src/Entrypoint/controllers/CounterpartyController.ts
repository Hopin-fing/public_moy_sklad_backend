import TYPES from '@src/constants/types';
import CounterpartyService from '@src/Infrastructure/Configuration/usecases/CounterpartyService';
import { TCounterpartyDTO } from '@src/Infrastructure/DTO/TCounterpartyDTO';
import { TGIsString } from '@src/Infrastructure/TypeGuards/TGIsString';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet, interfaces, request, response, requestParam, httpDelete } from 'inversify-express-utils';
import asyncHandler from '../middleware/async';

@controller('/counterparty')
export default class CounterpartyController {
    constructor(@inject(TYPES.CounterpartyService) private counterpartyService: CounterpartyService) {}

    // Возвращает список "связей" контрагентов
    @httpGet('/context/list')
    public async GetRelationByPortalId(@request() req: express.Request, @response() res: express.Response) {
        const portalId = TGIsString(req.query.portal_id);
        return asyncHandler(this.counterpartyService.GetRelationByPortalId(+portalId), res);
    }

    // Возвращает список доступных контрагентов из БД
    @httpGet('/db/list')
    public async GetRelation(@request() req: express.Request, @response() res: express.Response) {
        return asyncHandler(this.counterpartyService.GetRelation(), res);
    }

    // Создание "связи" между контрагентами на ДМ и МС в БД
    @httpPost('/db/set')
    public async SetRelation(@request() req: express.Request, @response() res: express.Response) {
        const relationDto: TCounterpartyDTO = req.body;
        return asyncHandler(this.counterpartyService.SetRelation(relationDto), res);
    }

    // Удаление "связи" между контрагентами на ДМ и МС в БД
    @httpDelete('/db/remove')
    public async RemoveRelation(@request() req: express.Request, @response() res: express.Response) {
        const portalId = +req.query.portal_id,
            warehouseDMId = TGIsString(req.query.warehouse_dm_id);
        return asyncHandler(this.counterpartyService.RemoveRelation(portalId, warehouseDMId), res);
    }
}
