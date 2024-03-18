import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
export async function POST(req) {
  const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });
  /*   const MysqlDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
  }); */

  const postgresDataSource = new DataSource({
    type: "postgres",
    host: "157.90.123.33",
    port: 9002,
    username: "postgres",
    password: "L4QysZYDFqN0Kbw2tVPpK1CsHMevhRP3",
    database: "postgres",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: postgresDataSource,
  });
  const executeQuery = new QuerySqlTool(db);
  const writeQuery = await createSqlQueryChain({
    llm,
    db,
    dialect: "postgres",
  });
  const chain = writeQuery.pipe(executeQuery);
  const response = await chain.invoke({
    question: "Dime el ultimo mensaje registrado y el usuario que lo dijo",
  });
  console.log(response);

  return NextResponse.json(response);
}
