import { DataSource } from "typeorm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { type, host, username, port, database, password } = await req.json();

  if (type === "postgres") {
    const dataSourceOptions = {
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      synchronize: false,
    };
    try {
      const dataSource = new DataSource(dataSourceOptions);
      await dataSource.initialize();
      await dataSource.destroy();
      return NextResponse.json({ connected: true });
    } catch (error) {
      console.error("PostgreSQL connection error:", error);
      return NextResponse.json({ connected: false, error: error.message });
    }
  } else {
    return NextResponse.json(
      { connected: false, error: "Unsupported database type" },
      { status: 400 }
    );
  }
}
