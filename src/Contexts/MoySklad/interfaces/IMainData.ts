import { TMetaData } from '../types/TMetaData';

export interface IMainData {
    meta: TMetaData;
    id: string;
    accountId: string;
    owner: { meta: TMetaData };
    shared: boolean;
    group: { meta: TMetaData };
    updated: string;
    name: string;
}
