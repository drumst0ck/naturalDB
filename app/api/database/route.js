import { NextResponse } from "next/server";
import client from "@/lib/directus";
import { createItem } from "@directus/sdk";
export async function POST(req) {
  const json = await req.json();
  const { type, host, username, port, database, password } = json;
  const newItem = await client
    .request(
      createItem("db", {
        type: type,
        host: host,
        username: username,
        port: parseInt(port),
        database: database,
        password: password,
      })
    )
    .catch((e) => NextResponse.error(e));

  return NextResponse.json(newItem);
}
