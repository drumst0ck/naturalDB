import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
export async function POST(req) {
  const json = await req.json();
  const { type, host, username, port, database, password, mensaje } = json;
  const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

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
  });
  const executeQuery = new QuerySqlTool(db);
  const writeQuery = await createSqlQueryChain({
    llm,
    db,
    dialect: type,
  });
  const chain = writeQuery.pipe(executeQuery);
  const response = await chain.invoke({
    question: mensaje,
  });
  console.log(response);

  return NextResponse.json(response);
}
