import React from "react";

function DoneButton(props) {
  return (
    <>
      {" "}
      <button
        onClick={props.method}
        className={`text-white ${props.bg} focus:ring-2 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
      >
        {props.value}
      </button>
    </>
  );
}

export default DoneButton;
