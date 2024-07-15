import pg from "pg";

async function getPostgresSchema(config) {
  const client = new pg.Client({
    user: config.username,
    host: config.host,
    database: config.database,
    password: config.password,
    port: parseInt(config.port),
    ssl: false,
  });

  await client.connect();

  // Query to get table structure including autoincrement information
  const schemaQuery = `
    SELECT 
      t.table_name, 
      c.column_name, 
      c.data_type,
      c.is_nullable,
      c.column_default,
      CASE 
        WHEN pg_get_serial_sequence(t.table_name, c.column_name) IS NOT NULL THEN true
        ELSE false
      END AS is_autoincrement
    FROM 
      information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE 
      t.table_schema = 'public'
    ORDER BY 
      t.table_name, 
      c.ordinal_position;
  `;

  const res = await client.query(schemaQuery);
  await client.end();
  return formatSchemaResult(res.rows);
}

function formatSchemaResult(rows) {
  let schema = "";
  let currentTable = "";

  for (let row of rows) {
    if (row.table_name !== currentTable) {
      if (currentTable !== "") {
        schema += ");\n\n";
      }
      schema += `CREATE TABLE ${row.table_name} (\n`;
      currentTable = row.table_name;
    }

    let columnDef = `  ${row.column_name} ${row.data_type}`;

    if (row.is_autoincrement) {
      columnDef += " SERIAL";
    }

    if (row.is_nullable === "NO") {
      columnDef += " NOT NULL";
    }

    if (row.column_default && !row.is_autoincrement) {
      columnDef += ` DEFAULT ${row.column_default}`;
    }

    schema += columnDef + ",\n";
  }

  if (currentTable !== "") {
    schema = schema.slice(0, -2) + "\n);"; // Remove last comma and close the last table
  }

  return schema;
}

async function getDBSchema(config) {
  return await getPostgresSchema(config);
}

export default getDBSchema;
