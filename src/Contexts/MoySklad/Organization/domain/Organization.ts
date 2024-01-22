import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';
import { IResponse } from '../../interfaces/IResonse';
import { TMetaData } from '../../types/TMetaData';

interface IOrganization {
    meta: TMetaData;
    id: string;
    accountId: string;
    owner: { meta: TMetaData };
    shared: boolean;
    group: { meta: TMetaData };
    updated: Date;
    name: string;
    externalCode: string;
    archived: boolean;
    created: string;
    companyType: 'legal' | 'entrepreneur' | 'individual';
    legalTitle: string;
    email: string;
    accounts: { meta: TMetaData };
    isEgaisEnable: boolean;
    payerVat: boolean;
    director: string;
    directorPosition: string;
    chiefAccountant: string;
}

export interface IResOrganization extends IResponse {
    rows: IOrganization[];
}

export default class Organization {
    rows: IOrganization[];

    private getContent(bodyReq: IResOrganization): IOrganization[] {
        this.rows = bodyReq.rows;
        return this.rows;
    }

    getDataForDB(bodyReq: IResOrganization): TOrganizationDTO[] {
        const result: TOrganizationDTO[] = [];
        for (const organization of this.getContent(bodyReq)) {
            const obj = {
                organization_id: organization.id,
                organization_name: organization.name,
                portal_id: +process.env.DM_PORTAL_ID
            };
            result.push(obj);
        }
        return result;
    }
}
