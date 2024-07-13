import { NextResponse } from "next/server";
import { Pool } from "pg";
export async function POST(req) {
  try {
    const { query, dbConfig } = await req.json();
    if (!/^SELECT/i.test(query.trim())) {
      return NextResponse.json(
        { error: "Solo se permiten consultas SELECT" },
        { status: 400 }
      );
    }
    const pool = new Pool({
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: parseInt(dbConfig.port),
      ssl: false,
    });
    const result = await pool.query(query);
    await pool.end();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Error al ejecutar la consulta" },
      { status: 500 }
    );
  }
}
