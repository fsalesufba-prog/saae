import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function convertPlaceholders(sql: string): string {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
}

function convertOnDuplicateKey(sql: string): string {
    return sql.replace(
        /ON DUPLICATE KEY UPDATE([\s\S]+?)(?=;|$)/gi,
        (_match: string, updates: string) => {
            const parts = updates.trim().split(',').map((part: string) => {
                const eqIdx = part.indexOf('=');
                const col = part.substring(0, eqIdx).trim();
                return `${col} = EXCLUDED.${col}`;
            });
            return `ON CONFLICT DO UPDATE SET ${parts.join(', ')}`;
        }
    );
}

function addReturningId(sql: string): string {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('INSERT') && !trimmed.includes('RETURNING')) {
        return sql.trim() + ' RETURNING id';
    }
    return sql;
}

function transformSql(sql: string): string {
    let transformed = sql;
    transformed = convertOnDuplicateKey(transformed);
    transformed = addReturningId(transformed);
    transformed = convertPlaceholders(transformed);
    return transformed;
}

const pool = {
    async execute(sql: string, params?: any[]): Promise<any[]> {
        const transformedSql = transformSql(sql);
        const safeParams = params || [];

        try {
            const result = await pgPool.query(transformedSql, safeParams);
            const trimmedUpper = sql.trim().toUpperCase();
            const isInsert = trimmedUpper.startsWith('INSERT');
            const isSelect = trimmedUpper.startsWith('SELECT');

            if (isInsert) {
                const insertId = result.rows[0]?.id ?? null;
                const resultObj = {
                    insertId,
                    affectedRows: result.rowCount ?? 0,
                    rows: result.rows,
                };
                return [resultObj, []];
            }

            if (isSelect) {
                return [result.rows, []];
            }

            const updateObj = {
                affectedRows: result.rowCount ?? 0,
                insertId: null,
            };
            return [updateObj, []];
        } catch (error: any) {
            if (error.code === '23505') {
                const mysqlError: any = new Error(error.message);
                mysqlError.code = 'ER_DUP_ENTRY';
                throw mysqlError;
            }
            throw error;
        }
    },

    async query(sql: string, params?: any[]): Promise<any[]> {
        return this.execute(sql, params);
    },

    async getConnection() {
        const client = await pgPool.connect();
        return {
            async execute(sql: string, params?: any[]): Promise<any[]> {
                const transformedSql = transformSql(sql);
                const safeParams = params || [];
                const result = await client.query(transformedSql, safeParams);
                const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
                if (isInsert) {
                    const insertId = result.rows[0]?.id ?? null;
                    return [{ insertId, affectedRows: result.rowCount ?? 0 }, []];
                }
                return [result.rows, []];
            },
            async query(sql: string, params?: any[]): Promise<any[]> {
                return this.execute(sql, params);
            },
            release() {
                client.release();
            },
            async beginTransaction() {
                await client.query('BEGIN');
            },
            async commit() {
                await client.query('COMMIT');
            },
            async rollback() {
                await client.query('ROLLBACK');
            },
        };
    },
};

export default pool;
