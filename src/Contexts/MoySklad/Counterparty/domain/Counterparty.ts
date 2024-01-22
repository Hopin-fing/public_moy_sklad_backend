import ResponseMoySklad from '../../application/ResponseMoySklad';
import { TMetaData } from '../../types/TMetaData';
import { IMainData } from '../../interfaces/IMainData';
import { IResponse } from '../../interfaces/IResonse';

type TCompanyType = 'legal' | 'entrepreneur' | 'individual';

interface ICounterparty extends IMainData {
    externalCode: string;
    archived: boolean;
    created: string;
    companyType: TCompanyType;
    legalTitle: string;
    legalAddress: string;
    legalAddressFull: { addInfo: string };
    inn: string;
    kpp: string;
    accounts: { meta: TMetaData };
    tags: string[];
    notes: { meta: TMetaData };
    salesAmount: number;
    files: { meta: TMetaData };
}
interface IResCounterparty extends IResponse {
    rows: ICounterparty[];
}

export default class Counterparty extends ResponseMoySklad {
    rows: ICounterparty[];

    constructor(bodyReq: IResCounterparty) {
        super(bodyReq);
        this.rows = bodyReq.rows;
    }

    getContent(): ICounterparty[] {
        const CounterpartyInfo = this.rows;
        return CounterpartyInfo;
    }
}
