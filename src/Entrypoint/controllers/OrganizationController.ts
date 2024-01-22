import TYPES from '@src/constants/types';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import OrganizationService from '@src/Infrastructure/Configuration/usecases/OrganizationService';
import asyncHandler from '../middleware/async';

@controller('/organization')
export default class OrganizationController {
    constructor(@inject(TYPES.OrganizationService) private organizationService: OrganizationService) {}

    // Возвращает список организаций из БД
    @httpGet('/db/list')
    public async GetOrgainzationList(@request() req: express.Request, @response() res: express.Response) {
        return asyncHandler(this.organizationService.GetOrgainzationList(), res);
    }
}
