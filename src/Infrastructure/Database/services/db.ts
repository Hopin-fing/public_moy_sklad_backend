import mysql, { FieldPacket, ResultSetHeader } from 'mysql2/promise';

export async function DBquery(sql: string, params?: any) {
    const config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_TABLE
        },
        connection = await mysql.createConnection(config);
    try {
        const [results]: [ResultSetHeader, FieldPacket[]] = await connection.execute(sql, params);
        connection.end();
        return results;
    } catch (e) {
        connection.end();
        throw new Error(e.message);
    }
}
