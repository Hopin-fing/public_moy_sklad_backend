import ResponseMoySklad from '../../application/ResponseMoySklad';
import { IMainData } from '../../interfaces/IMainData';
import { IResponse } from '../../interfaces/IResonse';
import { TMetaData } from '../../types/TMetaData';

type TEmployee = {
    meta: TMetaData;
};

interface TContract extends IMainData {
    description: string;
    code: string;
    externalCode: string;
    moment: string;
    sum: number;
    contractType: string;
    agent: { meta: TMetaData };
    ownAgent: { meta: TMetaData };
    rate: { currency: { meta: TMetaData } };
    printed: boolean;
    published: boolean;
}
interface IReqContract extends IResponse {
    rows: TContract[];
}

export default class Contract extends ResponseMoySklad {
    rows: TContract[];

    constructor(bodyReq: IReqContract) {
        super(bodyReq);
        this.rows = bodyReq.rows;
    }

    getContent(): TContract[] {
        const CounterpartyInfo = this.rows;
        return CounterpartyInfo;
    }
}
