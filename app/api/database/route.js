import { NextResponse } from "next/server";
import client from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { auth } from "@clerk/nextjs";
export async function POST(req) {
  const { userId } = auth();
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
        user: userId,
      })
    )
    .catch((e) => e.error);

  return NextResponse.json(newItem);
}
