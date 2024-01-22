import TYPES from '@src/constants/types';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet, interfaces, request, response, requestParam, httpDelete } from 'inversify-express-utils';
import WarehouseService from '@src/Infrastructure/Configuration/usecases/WarehouseService';
import { TWarehouseDTO } from '@src/Infrastructure/DTO/TWarehouseDTO';
import { TGIsString } from '@src/Infrastructure/TypeGuards/TGIsString';
import asyncHandler from '../middleware/async';

@controller('/warehouse')
export default class WarehouseController {
    constructor(@inject(TYPES.WarehouseService) private warehouseService: WarehouseService) {}

    // Возвращает список складов из ДМ и МС, а также все доступные для связки(ранее у которых не установлена "связь") склады из БД
    @httpGet('/context/list')
    public async GetContractList(@request() req: express.Request, @response() res: express.Response) {
        const portalId = TGIsString(req.query.portal_id);
        return asyncHandler(this.warehouseService.GetRelationByPortalId(+portalId), res);
    }

    // Установка новой "связи" между складами ДМ и МС из БД
    @httpPost('/db/set')
    public async SetRelation(@request() req: express.Request, @response() res: express.Response) {
        const relationDto: TWarehouseDTO = req.body;
        return asyncHandler(this.warehouseService.SetRelation(relationDto), res);
    }

    // Удаление "связи" между складами ДМ и МС из БД
    @httpDelete('/db/remove')
    public async RemoveRelation(@request() req: express.Request, @response() res: express.Response) {
        const portalId = +req.query.portal_id,
            warehouseDMId = TGIsString(req.query.warehouse_dm_id);
        return asyncHandler(this.warehouseService.RemoveRelation(portalId, warehouseDMId), res);
    }
}
