import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(req) {
  let client;
  try {
    const { query, dbConfig } = await req.json();
    const pool = new Pool({
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: parseInt(dbConfig.port),
      ssl: false,
    });

    client = await pool.connect();

    await client.query("BEGIN");

    const result = await client.query(query);

    let processedResult;
    const upperQuery = query.toUpperCase().trim();

    if (
      upperQuery.startsWith("INSERT INTO") ||
      upperQuery.startsWith("UPDATE")
    ) {
      const tableName = getTableName(query);
      const whereClause = upperQuery.startsWith("UPDATE")
        ? getWhereClause(query)
        : "";
      const selectQuery = `SELECT * FROM ${tableName} ${whereClause} ORDER BY ctid DESC LIMIT ${result.rowCount}`;
      const selectResult = await client.query(selectQuery);

      processedResult = {
        message: `Operation successful. ${result.rowCount} row(s) affected.`,
        affectedRows: result.rowCount,
        data: selectResult.rows,
      };
    } else if (upperQuery.startsWith("DELETE FROM")) {
      processedResult = {
        message: `Operation successful. ${result.rowCount} row(s) deleted.`,
        affectedRows: result.rowCount,
      };
    } else {
      processedResult = result.rows;
    }

    await client.query("COMMIT");

    return NextResponse.json(processedResult);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Error al ejecutar la consulta", details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

function getTableName(query) {
  const match = query.match(/(?:INSERT INTO|UPDATE|DELETE FROM)\s+(\w+)/i);
  return match ? match[1] : "";
}

function getWhereClause(query) {
  const whereIndex = query.toUpperCase().indexOf("WHERE");
  return whereIndex !== -1 ? query.slice(whereIndex) : "";
}
