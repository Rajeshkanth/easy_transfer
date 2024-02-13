import React, { memo, useContext } from "react";
import { store } from "../App";
import { IoMdCloseCircle } from "react-icons/io";
import { CgClose } from "react-icons/cg";
function FailedTransactions() {
  const { recentTransactions, failedTransaction, setFailedTransaction } =
    useContext(store);
  return (
    <>
      <div className="flex h-screen w-screen bg-transparent backdrop-blur-md justify-center items-center font-poppins">
        <div className=" md:h-3/4 w-[70%] md:w-3/4 bg-white shadow-sm shadow-black  text-gray-100 p-0 md:pt-[8vh]  pb-5 box-border overflow-y-auto  rounded-md ">
          <div className="flex justify-between p-5 h-[8vh] box-border rounded-md rounded-b-none  w-[70%] top-[16.2vh] absolute md:top-[12.5vh] z-10 bg-gray-800  md:w-[75%] lg:pl-[5vw] text-2xl text-gray-100 items-center">
            <h1 className="font-bold text-lg w-1/2 md:text-2xl">
              Failed Transactions
            </h1>
            <h1
              onClick={() => setFailedTransaction(false)}
              className="text-2xl w-[10%] flex items-center text-center cursor-pointer"
            >
              <CgClose />
            </h1>
          </div>

          <div className=" w-full    space-y-4 h-auto md:mt-[0vh] md:pl-[0vw] md:p-2 md:pr-0 rounded-md rounded-t-none pt-[0vh] overflow-y-auto pb-[2vh]">
            {" "}
            <ul className="grid grid-cols-1 gap-2 md:gap-0 text-gray-700 md:pl-[5vw] pb-2 items-center space-y-5 text-sm md:text-xl border-b-2 overflow-y-auto">
              <ul className="grid grid-cols-4 space-y-0 text-center items-center  sticky top-0 font-bold capitalize">
                <li className="items-center flex text-center  ">Date</li>
                <li className="items-center flex text-center">Name</li>
                <li className="items-center flex text-center">Amount</li>
                <li className="items-center flex text-center ">Status</li>
              </ul>
            </ul>
            <div className="space-y-2 text-gray-700  cursor-default">
              {recentTransactions
                .filter((item) => item.Status === "canceled")
                .map((item, index) => (
                  <ul
                    key={index}
                    className="grid grid-cols-4  space-y-0 border-b-2 md:pl-[5vw] pb-2 text-center text-sm md:text-xl items-center capitalize "
                  >
                    <li className=" items-center flex text-center">
                      {item.Date}
                    </li>
                    <li className="items-center flex text-center">
                      {item.Name}
                    </li>
                    <li className="items-center flex text-center">
                      {item.Amount}
                    </li>
                    <li className="items-center flex text-center text-red-600">
                      {item.Status}
                    </li>
                  </ul>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(FailedTransactions);
