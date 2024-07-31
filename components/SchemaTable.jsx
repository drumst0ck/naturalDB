import React from "react";

const SchemaTable = ({ schema }) => {
  const parseSchema = (schemaString) => {
    const tables = schemaString.split("\n\n");
    return tables.map((table) => {
      const [tableName, ...columns] = table.split("\n");
      return {
        name: tableName.replace("CREATE TABLE ", "").replace(" (", ""),
        columns: columns
          .map((column) => {
            const [name, ...details] = column.trim().split(" ");
            return { name, details: details.join(" ") };
          })
          .filter((col) => col.name !== ")"),
      };
    });
  };

  const parsedSchema = parseSchema(schema);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#2a2a2a] text-sm">
        <thead>
          <tr className="bg-[#3a3a3a]">
            <th className="px-4 py-2 text-left text-[#5ad4e6]">Table</th>
            <th className="px-4 py-2 text-left text-[#5ad4e6]">Column</th>
            <th className="px-4 py-2 text-left text-[#5ad4e6]">Details</th>
          </tr>
        </thead>
        <tbody>
          {parsedSchema.map((table, tableIndex) => (
            <React.Fragment key={tableIndex}>
              {table.columns.map((column, columnIndex) => (
                <tr
                  key={`${tableIndex}-${columnIndex}`}
                  className="border-b border-gray-700"
                >
                  {columnIndex === 0 ? (
                    <td
                      rowSpan={table.columns.length}
                      className="px-4 py-2 align-top font-medium"
                    >
                      {table.name}
                    </td>
                  ) : null}
                  <td className="px-4 py-2">{column.name}</td>
                  <td className="px-4 py-2">{column.details}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchemaTable;
