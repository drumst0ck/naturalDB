import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const FormattedJSONDisplay = ({ jsonString }) => {
  const formatJSON = (json) => {
    try {
      // Parse the JSON string to an object
      const obj = JSON.parse(json);
      // Stringify the object with indentation
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return json; // Return original string if parsing fails
    }
  };

  return (
    <SyntaxHighlighter language="json" style={docco}>
      {formatJSON(jsonString)}
    </SyntaxHighlighter>
  );
};

export default FormattedJSONDisplay;
