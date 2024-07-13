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
  return await getPostgresSchema(config);
}

export default getDBSchema;
