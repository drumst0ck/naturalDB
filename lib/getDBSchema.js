import pg from "pg";
async function detectDatabaseType(config) {
  console.log("primero", config);
  const client = new pg.Client(config);
  await client.connect();
  await client.end();
  return "postgresql";
}
async function getPostgresSchema(config) {
  console.log(config);
  const client = new pg.Client(config);
  await client.connect();
  const res = await client.query(`
    SELECT 
      table_name, 
      column_name, 
      data_type
    FROM 
      information_schema.columns
    WHERE 
      table_schema = 'public'
    ORDER BY 
      table_name, 
      ordinal_position;
  `);
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
    schema += `  ${row.column_name} ${row.data_type},\n`;
  }

  if (currentTable !== "") {
    schema += ");";
  }

  return schema;
}
async function getDBSchema(config) {
  const dbType = await detectDatabaseType(config);
  switch (dbType) {
    case "postgresql":
      return await getPostgresSchema(config);
    default:
      throw new Error("Unsupported database type");
  }
}

export default getDBSchema;
