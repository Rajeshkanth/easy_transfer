import React from "react";

function ConfirmTick() {
  return (
    <>
      <svg
        class="checkmark w-14 h-14 rounded-full block border-2 border-white  mx-auto my-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        {" "}
        <circle
          class="checkmark__circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
        />{" "}
        <path
          class="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    </>
  );
}

export default ConfirmTick;
