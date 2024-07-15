import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(req) {
  try {
    const { dbConfig } = await req.json();
    const pool = new Pool({
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: parseInt(dbConfig.port),
      ssl: false,
    });

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
      `);
      return NextResponse.json(result.rows.map((row) => row.table_name));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Error al obtener las tablas", details: error.message },
      { status: 500 }
    );
  }
}
