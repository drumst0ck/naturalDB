
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { type, host, username, port, database, password } = await req.json();

    try {
        const dataSource = new DataSource({
            type,
            host,
            port,
            username,
            password,
            database,
        });

        // Attempt to connect
        await SqlDatabase.fromDataSourceParams({
            appDataSource: dataSource,
        });

        // If we reach this point, connection was successful
        return NextResponse.json({ connected: true });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ connected: false, error: error.message });
    }
}