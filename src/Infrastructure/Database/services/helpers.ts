import { TCounterpartyDTO } from '@src/Infrastructure/DTO/TCounterpartyDTO';
import { TOrganizationDTO } from '@src/Infrastructure/DTO/TOrganizationDTO';
import { TWarehouseDTO } from '@src/Infrastructure/DTO/TWarehouseDTO';

export function emptyOrRows(rows: any) {
    if (!rows) return [];
    return rows;
}
export function setTableName(data: TCounterpartyDTO | TWarehouseDTO | TOrganizationDTO): string {
    const keyName = Object.keys(data)[3];
    switch (true) {
        case keyName.includes('counterparty'):
            return 'counterparty';
        case keyName.includes('warehouse'):
            return 'warehouse';
        case keyName.includes('organization'):
            return 'organization';
        default:
            return '';
    }
}
export function removeSymbol<T>(data: T, symbol: string): T {
    const regex = new RegExp(symbol, 'g');
    for (let [key, value] of Object.entries(data)) {
        data[key as keyof T] = typeof value === 'string' ? value.replace(regex, "'") : value;
    }
    return data;
}
