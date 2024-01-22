import { IResponse } from '../../interfaces/IResonse';
import { TMetaData } from '../../types/TMetaData';

interface IUOM {
    meta: TMetaData;
    id: string;
    updated: string;
    name: string;
    description: string;
    code: string;
    externalCode: string;
}
interface IResUOM extends IResponse {
    rows: IUOM[];
}

type IDBInfo = Pick<IUOM, 'id' | 'name'>;

export default class UOM {
    rows: IUOM[];

    getContent(bodyReq: IResUOM): IUOM[] {
        this.rows = bodyReq.rows;
        return this.rows;
    }

    getDataForDB(): IDBInfo[] {
        const result: IDBInfo[] = [];
        this.rows.forEach((item) => {
            let obj = { id: item.id, name: item.name };
            result.push(obj);
        });
        return result;
    }
}
