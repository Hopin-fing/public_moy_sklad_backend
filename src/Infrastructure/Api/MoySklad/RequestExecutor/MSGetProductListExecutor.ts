import MoySkladApi from '../MoySkladApi';

export default class MSGetProductListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/product';

    constructor(offset?: number, limit?: number) {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
        this.url = !limit ? this.url : !offset ? this.url + `?limit=${limit}` : this.url + `?limit=${limit}&offset=${offset}`;
    }

    async execute(): Promise<any> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<any> {
        return await this.SendRequest();
    }
}
