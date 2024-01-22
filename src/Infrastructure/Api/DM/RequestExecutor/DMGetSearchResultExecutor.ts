import { IReqProduct } from '@src/Contexts/DM/Product/domain/Product';
import DMApi from '../DMApi';

export default class DMGetSearchResultExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/marketplaces/v1/api/products';

    constructor(text: string) {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
        this.url = text ? this.url + `?s=${text}` : this.url;
    }

    async execute(): Promise<IReqProduct> {
        return await this.handleResponse().then((data) => data);
    }

    async handleResponse(): Promise<any> {
        return await this.SendRequest();
    }
}
