import React, { memo } from "react";

function Loader(props) {
  const { msg, bg } = props;

  return (
    <>
      <div
        className={`loading  h-screen w-screen flex flex-col items-center justify-center
           font-poppins ${bg}`}
      >
        <div className="loader "></div>
        <p>
          <strong className="text-white">{msg}</strong>{" "}
        </p>
      </div>
    </>
  );
}

export default memo(Loader);
