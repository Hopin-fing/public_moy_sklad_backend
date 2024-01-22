import { TReqCounterparty } from '../types/TReqCounterparty';

export type TCounterpartyClear = Omit<TReqCounterparty, 'last_full_sync_at' | 'last_sync_at' | 'created_at' | 'updated_at'>;

export default class Counterparties {
    req: TReqCounterparty[];

    constructor(bodyReq: TReqCounterparty[]) {
        this.req = bodyReq;
    }

    getContent(): TCounterpartyClear[] {
        const result: TCounterpartyClear[] = [];
        this.req.forEach((item) => {
            try {
                const resultObj: TCounterpartyClear = {
                    id: item.id,
                    portal_id: item.portal_id,
                    name: item.name,
                    marketplace: item.marketplace,
                    status: item.status,
                    is_fbs: item.is_fbs,
                    is_fbo: item.is_fbo
                };
                result.push(resultObj);
            } catch (error) {
                console.log('TCounterpartyClear error', error);
                console.log('TCounterpartyClear item', item);
            }
        });
        return result;
    }
}
