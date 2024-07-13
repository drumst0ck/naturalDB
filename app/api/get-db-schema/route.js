import { NextResponse } from "next/server";
import getDBSchema from "../../../lib/getDBSchema";

export async function POST(req) {
  try {
    console.log("Iniciando POST request");
    const dbConfig = await req.json();
    console.log("dbConfig recibido:", dbConfig);
    console.log("Llamando a getDBSchema");
    const testDB = {
      type: "test",
      host: "157.90.123.33",
      username: "drumstock",
      password: "test123",
      port: 10299,
      database: "test",
      type: "postgres",
    };
    const schema = await getDBSchema(testDB);
    console.log("Schema obtenido:", schema);
    return NextResponse.json(schema);
  } catch (error) {
    console.error("Error getting DB schema:", error);
    return NextResponse.json(
      { error: "Failed to get database schema", details: error.message },
      { status: 500 }
    );
  }
}
