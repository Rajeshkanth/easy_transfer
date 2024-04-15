import React, { memo } from "react";
import DoneButton from "./DoneButton";

function AlertModal(props) {
  return (
    <>
      <div className="bg-transparent backdrop-blur-sm h-screen w-screen text-white flex items-center justify-center font-poppins space-y-2 fixed top-0 z-200">
        <div class="relative p-4 w-full max-w-md max-h-full px-8 md:px-0">
          <div class="relative bg-white rounded-lg shadow-md py-4 border border-gray-200">
            <div class="p-4 md:p-5 text-center">
              {props.icon}
              <h3 className="mb-5 text-lg font-normal text-gray-600 ">
                {props.msg} <br />
                {props.accNum ? props.accNum : null}
              </h3>

              <div className="flex gap-5 mb-3 items-center justify-center">
                {props.buttons.map((button, index) => (
                  <DoneButton
                    key={index}
                    method={button.method}
                    value={button.label}
                    bg={button.bg}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(AlertModal);
