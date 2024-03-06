import React, { memo } from "react";

function Loader(props) {
  const { msg, bg } = props;

  return (
    <>
      <div
        className={`bg-gray-700 h-screen w-screen flex flex-col items-center justify-center
           font-poppins ${bg}`}
      >
        <div class="loader w-14 h-12 mb-4"></div>

        <p>
          <strong className="text-white">{msg}</strong>
        </p>
      </div>
    </>
  );
}

export default memo(Loader);
