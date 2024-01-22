import { DBquery } from '@src/Infrastructure/Database/services/db';
import { emptyOrRows, removeSymbol, setTableName } from '@src/Infrastructure/Database/services/helpers';
import { TCounterpartyDTO } from '@src/Infrastructure/DTO/TCounterpartyDTO';
import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';
import { TWarehouseDTO } from '@src/Infrastructure/DTO/TWarehouseDTO';
import { ResultSetHeader } from 'mysql2';
import CommandCreator from './utils/CommandCreator';

interface IAttr {
    portal_id: number;
    dm_vendor_code?: string;
    uuid?: string;
    dm_id?: string;
    ms_main_barcode?: string;
    cabinet_dm_id?: string;
    warehouse_dm_id?: string;
}

export default class MiddlewareMysql {
    public setResponse(result: ResultSetHeader) {
        const status = result?.affectedRows ? 200 : 400;
        return { status };
    }

    public async getMultiple(tableName: string) {
        const rows = await DBquery(`SELECT * FROM ${tableName}`),
            data = emptyOrRows(rows);
        return data;
    }

    public async find(attr: IAttr, tableName: string) {
        let command = `SELECT * FROM ${tableName} WHERE ( `;
        Object.keys(attr).map((item: string) => {
            const keyTyped = item as keyof typeof attr;
            command += ` ${item} = '${attr[keyTyped]}' &&`;
        });
        command = command.replace(/&&$/, ')');
        const rows = await DBquery(command),
            data = emptyOrRows(rows);
        return data;
    }

    public async findByManyParamValue(attr: any[], tableName: string) {
        let command = `SELECT * FROM ${tableName} WHERE ( `;
        command = new CommandCreator().find(attr, command);
        const rows = await DBquery(command),
            data = emptyOrRows(rows);
        return data;
    }

    public async create(data: TCounterpartyDTO | TWarehouseDTO | TOrganizationDTO) {
        data = removeSymbol(data, '"');
        const tableName = setTableName(data),
            command = `INSERT INTO ${tableName}
                (${Object.keys(data).join(', ')}) 
                    VALUES ("${Object.values(data).join('","')}")`,
            result: ResultSetHeader = await DBquery(command);
        return this.setResponse(result);
    }

    public async createMultiple(data: any[], tableName: string) {
        const nameField = Object.keys(data[0]).join(', ');
        let command: string = `INSERT INTO ${tableName} (${nameField}) VALUES `;
        command = new CommandCreator().createMultiple(data, command);
        const result: ResultSetHeader = await DBquery(command);
        return this.setResponse(result);
    }

    public async updateJournalOrders(portal_id: number, ms_id: string, status_number: number, tableName: string) {
        const command = `UPDATE ${tableName}
            SET status_number=${status_number}
            WHERE portal_id=${portal_id} AND ms_id="${ms_id}"`;
        const rows = await DBquery(command),
            data = emptyOrRows(rows);
        return data;
    }

    public async removeProduct(portalId: number, DMId: string) {
        const command = `DELETE FROM product WHERE portal_id=${portalId}
        AND uuid ="${DMId}"`;
        await DBquery(command);
    }

    public async remove(tableName: string, portalId: number, DMId: string, additAtr = '') {
        const command = `DELETE FROM ${tableName} WHERE portal_id=${portalId}
        AND ${additAtr ? additAtr : tableName}_dm_id=${DMId}`;
        const rows = await DBquery(command),
            data = emptyOrRows(rows);
        return data;
    }
}
