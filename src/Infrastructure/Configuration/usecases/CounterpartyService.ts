import { injectable } from 'inversify';
import Counterparty from '@src/Contexts/MoySklad/Counterparty/domain/Counterparty';
import Counterparties from '@src/Contexts/DM/Counterparties/domain/Counterparties';
import MSGetCounterpartyListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetCounterpartyListExecutor';
import DMGetCounterpartyListExecutor from '@src/Infrastructure/Api/DM/RequestExecutor/DMGetCounterpartyListExecutor';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import { TCounterpartyDTO } from '@src/Infrastructure/DTO/TCounterpartyDTO';
import ContractService from './ContractService';

@injectable()
export default class CounterpartyService {
    public async GetCounterpartyList() {
        const DMRequest = new DMGetCounterpartyListExecutor(),
            MSRequest = new MSGetCounterpartyListExecutor(),
            DMContent = await DMRequest.execute(),
            MSContent = await MSRequest.execute(),
            resultMS = new Counterparty(MSContent).getContent(),
            resultDM = new Counterparties(DMContent).getContent();
        return { resultMS, resultDM };
    }

    public async GetRelationByPortalId(portal_id: number) {
        const removeElementByName = <T>(arr: T[], value: string | number): T[] => {
            return arr.filter((item: any) => item['id'].toString() !== value);
        };
        let { resultMS, resultDM } = await this.GetCounterpartyList(),
            constractMS = await new ContractService().GetContractList(),
            dataDB = await new MiddlewareMysql().find({ portal_id }, 'counterparty').then((data) => data);
        dataDB.forEach((element: any) => {
            resultDM = removeElementByName(resultDM, element['cabinet_dm_id']);
            constractMS = removeElementByName(constractMS, element['contract_ms_id']);
        });

        return { cabinet: resultDM, counterparty: resultMS, constractMS, dataDB };
    }

    public async GetRelation() {
        const res = await new MiddlewareMysql().getMultiple('counterparty');
        return res;
    }

    public async SetRelation(data: TCounterpartyDTO) {
        const res = await new MiddlewareMysql().create(data);
        return res;
    }

    public async RemoveRelation(portal_id: number, warehouseDMId: string) {
        const res = await new MiddlewareMysql().remove('counterparty', portal_id, warehouseDMId, 'cabinet');
        return res;
    }
}
