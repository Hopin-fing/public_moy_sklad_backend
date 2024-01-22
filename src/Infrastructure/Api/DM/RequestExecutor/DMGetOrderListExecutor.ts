import { IReqOrder } from '@src/Contexts/DM/Order/application/OrderRequestCreator';
import DMApi from '../DMApi';

type TStatusOrder = 'new' | 'need_attention' | 'ready_to_pack' | 'ready_for_shipment' | 'delivering' | 'delivered' | 'cancelled' | 'error';

export default class DMGetOrderListExecutor extends DMApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/fbs/v1/api/postings?limit=200';
    offset = 0;

    constructor(public status: TStatusOrder) {
        super();
        this.url = this.REQUEST_URL;
        this.status = status;
        this.method = this.REQUEST_TYPE;
        this.url = `${this.url}&statuses[]=${this.status}&sort[dir]=desc&sort[field]=accepted_at`;
    }

    async execute(): Promise<IReqOrder['data']> {
        let URL = this.url,
            result = [],
            currentPage = 0,
            lastPage;
        while (currentPage !== lastPage && lastPage !== 0) {
            this.url = `${URL}&offset=${this.offset}`;
            const { last_page, data, current_page } = await this.handleResponse();
            this.offset = this.offset + 200;
            currentPage = current_page;
            lastPage = last_page;
            result.push(data);
        }
        result = result.flat();
        return result;
    }

    protected async handleResponse(): Promise<IReqOrder> {
        let res: IReqOrder;
        res = await this.SendRequest();
        return res;
    }
}
