import { NextResponse } from "next/server";
import client from "@/lib/directus";
import { createItem, readItems, deleteItem } from "@directus/sdk";
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
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const result = await client
      .request(readItems("db", { filter: { id: id } }))
      .catch((e) => e.error);

    return NextResponse.json(result);
  }
  const { userId } = auth();
  const result = await client.request(
    readItems("db", { filter: { user: userId }, sort: ["-date_created"] })
  );

  return NextResponse.json(result);
}
export async function DELETE(req) {
  const { userId } = auth();
  const json = await req.json();
  const { id } = json;

  const result = await client
    .request(deleteItem("db", id))
    .catch((e) => e.error);

  return NextResponse.json(result);
}
