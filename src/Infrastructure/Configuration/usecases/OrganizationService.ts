import { injectable } from 'inversify';
import MiddlewareMysql from '@src/Entrypoint/middleware/MiddlewareMysql';
import MSGetOrganizationListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetOrganizationListExecutor';
import Organization from '@src/Contexts/MoySklad/Organization/domain/Organization';
import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';

interface IOrganizationDB {
    id: number;
    portal_id: number;
    organization_name: string;
    organization_number: number;
    organization_id: string;
}

@injectable()
export default class OrganizationService {
    public async GetOrgainzationList() {
        const MSResponse = await new MSGetOrganizationListExecutor().execute(),
            organizations = new Organization().getDataForDB(MSResponse);
        if (organizations.length === 0) throw new Error('Организаций в кабинете не найдено');
        const mysql = new MiddlewareMysql(),
            organizationDB: (IOrganizationDB | TOrganizationDTO)[] = [];
        for (let [index, organization] of organizations.entries()) {
            const isExist = await mysql.findByManyParamValue([organization], 'organization').then((data) => data);
            if (isExist.length !== 0) {
                organizationDB.push(isExist);
                continue;
            }
            organization.organization_number = ++index;
            await mysql.create(organization);
            organizationDB.push(organization);
        }
        return this.PrepareForFrontend(organizationDB.flat());
    }

    private PrepareForFrontend(organizationDB: (IOrganizationDB | TOrganizationDTO)[]) {
        return organizationDB.map((organization) => {
            return {
                organizationNumber: organization.organization_number,
                name: organization.organization_name
            };
        });
    }
}
