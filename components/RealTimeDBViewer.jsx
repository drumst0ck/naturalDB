import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const fetchTables = async (dbConfig) => {
  const response = await fetch("/api/fetch-tables", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dbConfig }),
  });
  if (!response.ok) throw new Error("Failed to fetch tables");
  return response.json();
};

const fetchTableData = async (tableName, dbConfig) => {
  const response = await fetch("/api/fetch-table-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableName, dbConfig }),
  });
  if (!response.ok) throw new Error("Failed to fetch table data");
  return response.json();
};

export default function RealTimeDBViewer({ dbConfig }) {
  const [selectedTable, setSelectedTable] = useState(null);

  const {
    data: tables,
    isLoading: tablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["tables", dbConfig],
    queryFn: () => fetchTables(dbConfig),
  });

  const {
    data: tableData,
    isLoading: dataLoading,
    error: dataError,
  } = useQuery({
    queryKey: ["tableData", selectedTable, dbConfig],
    queryFn: () => fetchTableData(selectedTable, dbConfig),
    enabled: !!selectedTable,
  });

  const renderTableList = () => (
    <div className="bg-[#2D2D2D] p-4 rounded-lg overflow-y-auto h-[calc(100vh-150px)]">
      <h2 className="text-[#E0E0E0] text-lg mb-4">Database Tables</h2>
      {tables?.map((table) => (
        <div
          key={table}
          className={`cursor-pointer p-2 rounded ${
            selectedTable === table ? "bg-[#4A4A4A]" : "hover:bg-[#3A3A3A]"
          }`}
          onClick={() => setSelectedTable(table)}
        >
          <span className="text-[#E0E0E0]">{table}</span>
        </div>
      ))}
    </div>
  );

  const renderTableData = () => (
    <div className="bg-[#2D2D2D] p-4 rounded-lg overflow-auto h-[calc(100vh-150px)]">
      <h2 className="text-[#E0E0E0] text-lg mb-4">{selectedTable} Data</h2>
      {dataLoading ? (
        <Loader2 className="h-8 w-8 animate-spin text-[#E0E0E0]" />
      ) : dataError ? (
        <p className="text-red-500">Error loading table data</p>
      ) : tableData && tableData.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th
                  key={key}
                  className="p-2 border-b border-[#4A4A4A] text-[#A0A0A0]"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="p-2 border-b border-[#4A4A4A] text-[#E0E0E0]"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-[#E0E0E0]">No data available</p>
      )}
    </div>
  );

  return (
    <div className="flex space-x-4 p-4 bg-[#1E1E1E] text-[#E0E0E0] font-mono">
      <div className="w-1/3">{renderTableList()}</div>
      <div className="w-2/3">
        {selectedTable ? (
          renderTableData()
        ) : (
          <p>Select a table to view its data</p>
        )}
      </div>
    </div>
  );
}
