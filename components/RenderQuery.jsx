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
  if (viewMode === "table") {
    try {
      const data = JSON.parse(result);
      if (Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]);
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
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  // Fallback to JSON view
  return renderSQLCode(result);
};
export default RenderQuery;
