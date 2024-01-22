import { IReqProduct } from '@src/Contexts/DM/Product/domain/Product';
import DMApi from '../DMApi';

export default class DMGetProductListExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/marketplaces/v1/api/products';

    constructor(limit?: string, offset?: string) {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
        this.url = !limit ? this.url : !offset ? this.url + `?limit=${limit}` : this.url + `?limit=${limit}&offset=${offset}`;
    }

    async execute(): Promise<IReqProduct> {
        return await this.handleResponse().then((data) => data);
    }

    async handleResponse(): Promise<any> {
        return await this.SendRequest();
    }
}
