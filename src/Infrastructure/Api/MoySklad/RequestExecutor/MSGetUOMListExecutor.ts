import MoySkladApi from '../MoySkladApi';

export default class MSGetUOMListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/uom';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<any> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<any> {
        return await this.SendRequest();
    }
}
