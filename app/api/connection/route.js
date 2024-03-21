import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { NextResponse } from "next/server";
export async function POST(req) {
  const json = await req.json();
  const { type, host, username, port, database, password } = json;
  const postgresDataSource = new DataSource({
    type: type,
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: postgresDataSource,
  }).catch((e) => e.error);
  return NextResponse.json(db);
}
