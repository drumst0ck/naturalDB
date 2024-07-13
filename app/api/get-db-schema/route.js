import { NextResponse } from "next/server";
import getDBSchema from "../../../lib/getDBSchema";

export async function POST(req) {
  try {
    const dbConfig = await req.json();
    const schema = await getDBSchema(dbConfig);
    return NextResponse.json(schema);
  } catch (error) {
    console.error("Error getting DB schema:", error);
    return NextResponse.json(
      { error: "Failed to get database schema", details: error.message },
      { status: 500 }
    );
  }
}
