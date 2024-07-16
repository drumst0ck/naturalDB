import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(req) {
  try {
    const { tableName, dbConfig } = await req.json();
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
      const result = await client.query(
        `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 300;`
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
    return NextResponse.json(
      {
        error: "Error al obtener los datos de la tabla",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
