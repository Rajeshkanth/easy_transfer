import React, { memo } from "react";
import { IoIosWallet } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";

function Balance() {
  return (
    <div className="h-full block w-full md:float-left md:border-b-0 pb-0 md:pb-8 xl:pb-0 mb-8 md:mb-16 m-auto bg-orange-400 space-y-4 box-border pl-8 sm:pl-16 items-center justify-center md:shadow-md shadow-gray-300 rounded-md text-gray-800 ">
      <div className="w-fit h-full flex justify-between items-center">
        <h1 className="w-14 m-0 text-4xl items-center flex justify-center border-2 rounded-full p-2 text-gray-700 bg-slate-100">
          <IoIosWallet />
        </h1>
        <div className="pl-4">
          <h1 className="text-base">Current Balance</h1>

          <h1 className="flex font-extrabold text-2xl items-center">
            <FaRupeeSign className="text-2xl font-extrabold" /> 1000
          </h1>
        </div>
      </div>
      {/* <div className="text-gray-800 bg-white">
        <h1>name</h1>
      </div> */}
    </div>
  );
}

export default memo(Balance);
