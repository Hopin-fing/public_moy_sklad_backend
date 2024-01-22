import { TMetaData } from '../types/TMetaData';

type TEmployee = {
    meta: TMetaData;
};

interface IResponse {
    context: { employee: TEmployee };
    meta: TMetaData;
}

export default class ResponseMoySklad {
    context: { employee: TEmployee };
    meta: TMetaData;

    constructor(bodyReq: IResponse) {
        (this.context = bodyReq.context), (this.meta = bodyReq.meta);
    }
}
