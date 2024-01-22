import { IResponseOrderExecutor } from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSCreateOrderExecutor';
import { IDataStatusForJournalDB } from '../domain/Order';

interface IStatusForJournalDB {
    portal_id: number;
    status_number: number;
    dm_id: number;
    ms_id: string;
}

export class OrderWriter {
    constructor(private responseDataMS: IResponseOrderExecutor[], private arrId: IDataStatusForJournalDB[]) {}

    run(): IStatusForJournalDB[] {
        return this.responseDataMS.map((order, index) => {
            const currentOrder = this.arrId[index],
                resultObject = {
                    portal_id: +process.env.DM_PORTAL_ID,
                    status_number: currentOrder.numberStatus,
                    dm_id: currentOrder.idDM,
                    ms_id: order.id
                };
            return resultObject;
        });
    }
}
