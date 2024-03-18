import { NextResponse } from "next/server";
import client from "@/lib/directus";
export async function POST(req) {
  const json = await req.json();
  const { type, host, username, port, database, password } = json;
  const newItem = await client
    .items("DB")
    .createOne({
      type: type,
      host: host,
      username: username,
      port: port,
      database: database,
      password: password,
    })
    .catch((error) => console.log(error));
  return NextResponse.json({ message: "Hello, World!" });
}
