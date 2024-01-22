import { TMetaData } from '@src/Contexts/MoySklad/types/TMetaData';
import MoySkladApi from '../MoySkladApi';

interface IStatusRes {
    meta: TMetaData;
    attributes: { meta: TMetaData };
    states: IStatus[];
}
interface IStatus {
    meta: TMetaData;
    id: string;
    accountId: string;
    name: string;
    color: number;
    stateType: string;
    entityType: string;
}

export default class MSGetStatusListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/customerorder/metadata';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<IStatus[]> {
        const { states } = await this.handleResponse();
        return states;
    }

    async handleResponse(): Promise<IStatusRes> {
        return await this.SendRequest();
    }
}
