import React from "react";

function PrettyPrintJson(props) {
  return (
    <div>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </div>
  );
}
export default PrettyPrintJson;
