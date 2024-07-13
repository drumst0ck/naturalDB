import { NextResponse } from "next/server";
import getDBSchema from "../../../lib/getDBSchema";

export async function POST(req) {
  try {
    console.log("Iniciando POST request");
    const dbConfig = await req.json();
    console.log("dbConfig recibido:", dbConfig);
    console.log("Llamando a getDBSchema");
    const schema = await getDBSchema(dbConfig);
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
