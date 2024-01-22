import TYPES from '@src/constants/types';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import ContractService from '@src/Infrastructure/Configuration/usecases/ContractService';
import asyncHandler from '../middleware/async';

@controller('/contract')
export default class ContractController {
    constructor(@inject(TYPES.ContractService) private contractService: ContractService) {}

    // Возвращает список доступных договоров с МC
    @httpGet('/context/list')
    public async GetContractList(@request() req: express.Request, @response() res: express.Response) {
        return asyncHandler(this.contractService.GetContractList(), res);
    }
}
