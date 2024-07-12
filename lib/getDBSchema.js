import pg from 'pg';
import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function detectDatabaseType(config) {
    if (config.filename) {
        return 'sqlite';
    }

    try {
        const client = new pg.Client(config);
        await client.connect();
        await client.end();
        return 'postgresql';
    } catch (error) {
        try {
            const connection = await mysql.createConnection(config);
            await connection.end();
            return 'mysql';
        } catch (error) {
            throw new Error('Unable to detect database type or unsupported database');
        }
    }
}

async function getPostgresSchema(config) {
    const client = new pg.Client(config);
    await client.connect();
    const res = await client.query(`
    SELECT 
      table_name, 
      column_name, 
      data_type
    FROM 
      information_schema.columns
    WHERE 
      table_schema = 'public'
    ORDER BY 
      table_name, 
      ordinal_position;
  `);
    await client.end();
    return formatSchemaResult(res.rows);
}

async function getMySQLSchema(config) {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(`
    SELECT 
      TABLE_NAME, 
      COLUMN_NAME, 
      DATA_TYPE
    FROM 
      INFORMATION_SCHEMA.COLUMNS
    WHERE 
      TABLE_SCHEMA = ?
    ORDER BY 
      TABLE_NAME, 
      ORDINAL_POSITION;
  `, [config.database]);
    await connection.end();
    return formatSchemaResult(rows);
}

async function getSQLiteSchema(config) {
    const db = await open({
        filename: config.filename,
        driver: sqlite3.Database
    });
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    let rows = [];
    for (let table of tables) {
        const columns = await db.all(`PRAGMA table_info(${table.name})`);
        rows = rows.concat(columns.map(col => ({
            table_name: table.name,
            column_name: col.name,
            data_type: col.type
        })));
    }
    await db.close();
    return formatSchemaResult(rows);
}

function formatSchemaResult(rows) {
    let schema = '';
    let currentTable = '';

    for (let row of rows) {
        if (row.table_name !== currentTable) {
            if (currentTable !== '') {
                schema += ');\n\n';
            }
            schema += `CREATE TABLE ${row.table_name} (\n`;
            currentTable = row.table_name;
        }
        schema += `  ${row.column_name} ${row.data_type},\n`;
    }

    if (currentTable !== '') {
        schema += ');';
    }

    return schema;
}

async function getDBSchema(config) {
    const dbType = await detectDatabaseType(config);

    switch (dbType) {
        case 'postgresql':
            return await getPostgresSchema(config);
        case 'mysql':
            return await getMySQLSchema(config);
        case 'sqlite':
            return await getSQLiteSchema(config);
        default:
            throw new Error('Unsupported database type');
    }
}

export default getDBSchema;