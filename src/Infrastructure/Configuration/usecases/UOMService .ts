import { injectable } from 'inversify';
import MSGetUOMListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetUOMListExecutor';
import UOM from '@src/Contexts/MoySklad/UOM/domain/UOM';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';

@injectable()
export default class UOMService {
    public async SetUOMList() {
        const MSRequest = await new MSGetUOMListExecutor().execute(),
            object = new UOM();
        object.getContent(MSRequest);
        const result = object.getDataForDB(),
            req = await new MiddlewareMysql().createMultiple(result, 'uom');
        return req;
    }
}
