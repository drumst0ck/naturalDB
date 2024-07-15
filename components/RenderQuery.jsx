import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderSQLCode } from "@/lib/utils";

const RenderQuery = (result, viewMode) => {
  console.log(result);

  const extractJsonArray = (str) => {
    const match = str.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error("Error parsing extracted JSON:", e);
        return null;
      }
    }
    return null;
  };

  const extractArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    }
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
    return null;
  };

  if (viewMode === "table") {
    try {
      let data;
      if (typeof result === "string") {
        data = extractJsonArray(result);
      } else {
        data = result;
      }

      const arrayData = extractArray(data);

      if (arrayData && arrayData.length > 0) {
        const columns = Object.keys(arrayData[0]);
        return (
          <UITable className="w-full max-w-[900px] overflow-auto">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {arrayData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {JSON.stringify(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        );
      }
    } catch (error) {
      console.error("Error parsing or rendering data:", error);
    }
  }
  return renderSQLCode(result);
};

export default RenderQuery;
