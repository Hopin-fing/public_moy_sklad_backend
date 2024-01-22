interface IReqCounterparty {
    id: number;
    portal_id: number;
    name: string;
    marketplace: string;
    status: string;
    is_fbs: boolean;
    is_fbo: boolean;
    last_full_sync_at: string;
    last_sync_at: string;
    created_at: string;
    updated_at: string;
}

export default class Couterparty {
    id: number;
    portal_id: number;
    name: string;
    marketplace: string;
    status: string;
    is_fbs: boolean;
    is_fbo: boolean;
    last_full_sync_at: string;
    last_sync_at: string;
    created_at: string;
    updated_at: string;

    constructor(bodyReq: IReqCounterparty) {
        (this.id = bodyReq.id), (this.portal_id = bodyReq.portal_id), (this.name = bodyReq.name);
        this.marketplace = bodyReq.marketplace;
        this.status = bodyReq.status;
        this.is_fbs = bodyReq.is_fbs;
        this.is_fbo = bodyReq.is_fbo;
        this.last_full_sync_at = bodyReq.last_full_sync_at;
        this.last_sync_at = bodyReq.last_sync_at;
        this.created_at = bodyReq.created_at;
        this.updated_at = bodyReq.updated_at;
    }
}
