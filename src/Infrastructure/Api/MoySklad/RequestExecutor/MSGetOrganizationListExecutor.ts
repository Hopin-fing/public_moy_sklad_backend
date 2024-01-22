import { IResOrganization } from '@src/Contexts/MoySklad/Organization/domain/Organization';
import MoySkladApi from '../MoySkladApi';

export default class MSGetOrganizationListExecutor extends MoySkladApi {
    REQUEST_TYPE = 'GET';
    REQUEST_URL = '/api/remap/1.2/entity/organization';

    constructor() {
        super();
        this.url = this.REQUEST_URL;
        this.method = this.REQUEST_TYPE;
    }

    async execute(): Promise<IResOrganization> {
        const res = await this.handleResponse();
        return res;
    }

    async handleResponse(): Promise<IResOrganization> {
        return await this.SendRequest();
    }
}
