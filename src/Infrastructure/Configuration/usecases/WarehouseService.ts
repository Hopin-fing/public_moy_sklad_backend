import { injectable } from 'inversify';
import MSGetWarehouseListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetWarehouseListExecutor';
import DMGetWarehouseListExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMGetWarehouseListExecutor';
import WarehousesDM from '@src/Contexts/DM/Warehouses/domain/Warehouses';
import WarehousesMS from '@src/Contexts/MoySklad/Warehouses/domain/Warehouses';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import { TWarehouseDTO } from '@src/Infrastructure/DTO/TWarehouseDTO';

@injectable()
export default class WarehouseService {
    public async GetWarehouseList() {
        const DMRequest = new DMGetWarehouseListExecutor(),
            MSRequest = new MSGetWarehouseListExecutor(),
            DMContent = await DMRequest.execute(),
            MSContent = await MSRequest.execute(),
            resultMS = new WarehousesMS(MSContent).getContent(),
            resultDM = new WarehousesDM(DMContent).getContent();
        return { resultMS, resultDM };
    }

    public async GetRelationByPortalId(portal_id: number) {
        const removeElementByName = <T>(arr: T[], value: string | number): T[] => {
            return arr.filter((item: any) => item['id'].toString() !== value);
        };
        let { resultMS, resultDM } = await this.GetWarehouseList(),
            dataDB = await new MiddlewareMysql().find({ portal_id }, 'warehouse').then((data) => data);
        dataDB.forEach((element: any) => {
            resultDM = removeElementByName(resultDM, element['warehouse_dm_id']);
            resultMS = removeElementByName(resultMS, element['warehouse_ms_id']);
        });
        return { resultDM, resultMS, dataDB };
    }

    public async GetRelation() {
        const res = await new MiddlewareMysql().getMultiple('counterparty');
        return res;
    }

    public async SetRelation(data: TWarehouseDTO) {
        const res = await new MiddlewareMysql().create(data);
        return res;
    }

    public async RemoveRelation(portal_id: number, warehouseDMId: string) {
        const res = await new MiddlewareMysql().remove('warehouse', portal_id, warehouseDMId);
        return res;
    }
}
