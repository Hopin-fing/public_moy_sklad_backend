import TYPES from '@src/constants/types';
import ProductService from '@src/Infrastructure/Configuration/usecases/ProductService';
import { TProductDTO, TRemoveProductDTO } from '@src/Infrastructure/DTO/TProductDTO';
import { TGIsString } from '@src/Infrastructure/TypeGuards/TGIsString';
import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet, interfaces, request, response, requestParam, httpDelete } from 'inversify-express-utils';
import asyncHandler from '../middleware/async';

@controller('/product')
export default class ProductController {
    constructor(@inject(TYPES.ProductService) private productService: ProductService) {}

    // Возвращает список продуктов с ДМ в зависимости он переданных параметров limit и offset
    @httpGet('/context/list')
    public async GetProductList(@request() req: express.Request, @response() res: express.Response) {
        const limit = TGIsString(req.query.limit),
            offset = TGIsString(req.query.offset);
        return asyncHandler(this.productService.GetProductList(limit, offset), res);
    }

    // Возвращает список продуктов с ДМ в зависимости он переданных параметров limit и offset
    @httpGet('/context/moysklad/search')
    public async SearchMSProduct(@request() req: express.Request, @response() res: express.Response) {
        const text = TGIsString(req.query.text);
        return asyncHandler(this.productService.SearchMSProduct(text), res);
    }

    // Производит поиск по имеющимся товарам на МС по параметрам: имя, артикул и баркод
    @httpGet('/context/dm/search')
    public async SearchDMProduct(@request() req: express.Request, @response() res: express.Response) {
        const text = TGIsString(req.query.text);
        return asyncHandler(this.productService.SearchDMProduct(text), res);
    }

    // Удаляет сохраненную "связь" между продуктами ДМ и МС из БД
    @httpPost('/db/remove')
    public async RemoveProduct(@request() req: express.Request, @response() res: express.Response) {
        const relationDto: TRemoveProductDTO = req.body;
        return asyncHandler(this.productService.RemoveProduct(relationDto), res);
    }

    // Добавляет новую "связь" между продуктами ДМ и МС в БД
    @httpPost('/db/set')
    public async SetProduct(@request() req: express.Request, @response() res: express.Response) {
        const relationDto: TProductDTO = req.body;
        return asyncHandler(this.productService.SetProduct(relationDto), res, 500, 'Продукт уже существует в БД');
    }
}
