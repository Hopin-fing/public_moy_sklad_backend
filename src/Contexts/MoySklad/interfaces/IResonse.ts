import { TEmployee } from '../types/TEmployee';
import { TMetaData } from '../types/TMetaData';

export interface IResponse {
    context: { employee: TEmployee };
    meta: TMetaData;
}
