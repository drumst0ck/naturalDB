import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const formatJSON = (data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
};

const RenderQuery = (result, viewMode) => {
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
      const arrayData = extractArray(result);

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
  } else if (viewMode === "json") {
    return (
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        customStyle={{
          background: "transparent",
          padding: "1em",
          margin: "0",
          borderRadius: "4px",
        }}
      >
        {formatJSON(result)}
      </SyntaxHighlighter>
    );
  }

  return (
    <SyntaxHighlighter
      language="sql"
      style={vscDarkPlus}
      customStyle={{
        background: "transparent",
        padding: "1em",
        margin: "0",
        borderRadius: "4px",
      }}
    >
      {result}
    </SyntaxHighlighter>
  );
};

export default RenderQuery;
