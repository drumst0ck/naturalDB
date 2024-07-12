import { DataSource } from "typeorm";
import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function POST(req) {
    const { type, host, username, port, database, password } = await req.json();

    if (type === 'mysql') {
        try {
            const connection = await mysql.createConnection({
                host,
                user: username,
                password,
                database,
                port,
            });

            await connection.connect();
            await connection.end();

            return NextResponse.json({ connected: true });
        } catch (error) {
            console.error('MySQL connection error:', error);
            return NextResponse.json({ connected: false, error: error.message });
        }
    } else if (type === 'postgres') {
        const dataSourceOptions = {
            type: 'postgres',
            host,
            port,
            username,
            password,
            database,
            synchronize: false,
        };

        try {
            const dataSource = new DataSource(dataSourceOptions);
            await dataSource.initialize();
            await dataSource.destroy();
            return NextResponse.json({ connected: true });
        } catch (error) {
            console.error('PostgreSQL connection error:', error);
            return NextResponse.json({ connected: false, error: error.message });
        }
    } else {
        return NextResponse.json({ connected: false, error: 'Unsupported database type' }, { status: 400 });
    }
}