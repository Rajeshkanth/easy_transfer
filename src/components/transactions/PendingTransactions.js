import React, { memo } from "react";

function PendingTransactions(props) {
  const { recentTransactions } = props.data;
  return (
    <div className="h-100 md:h-52 lg:h-52 xl:h-68 md:w-4/5 lg:w-4/5 xl:w-11/12 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
      <div className="grid  md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-12 pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
        <h1 className="text-sm  md:text-xs lg:text-md xl:text-16  md:pr-0 ">
          Pending Transactions
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-10 md:gap-5 lg:gap-5 text-gray-700  xl:gap-6 p-1 space-y-0 items-center md:pl-4 lg:pl-8 border-b-2 ">
        <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-4 md:gap-3 lg:gap-0 xl:gap-0 pl-4 sm:pl-8 md:pl-0 xl:pl-4  pr-4">
          <h1>Date</h1>
          <h1>Description</h1>
        </div>
        <div className="grid grid-cols-2 text-sm md:text-md items-center gap-7 lg:gap-10 xl:gap-4">
          <h1 className="">Amount</h1>
          <h1>Status</h1>
        </div>
      </div>
      {recentTransactions === null ? (
        <div className="grid  items-center h-1/2 text-gray-700 justify-center text-16">
          <p className=" pt-0">There is no recent transactions</p>
        </div>
      ) : recentTransactions.filter((item) => item.status === "pending")
          .length < 1 ? (
        <>
          <div className="grid  items-center  h-1/2 text-gray-700 justify-center text-16">
            <p className=" pt-0">There is no pending transactions</p>
          </div>{" "}
        </>
      ) : (
        recentTransactions
          .filter((item) => item.status === "pending")
          .map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-5 lg:gap-7 xl:gap-12 p-1 space-y-0 text-gray-700 items-center pl-4 sm:pl-8 md:pl-3 lg:pl-8 xl:pl-12 pr-4 border-b-2"
            >
              <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-2 xl:gap-5 items-center text-xs md:text-sm lg:text-md ">
                <h1 className="md:text-xs lg:text-md">{item.date}</h1>
                <h1 className="md:text-xs lg:text-md">{item.name}</h1>
              </div>
              <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-0 pl-5 md:pl-4 lg:pl-4 xl:pl-0 text-xs md:text-sm lg:text-md">
                <h1 className="md:text-xs lg:text-md">{item.amount}</h1>
                <h1 className="md:text-xs lg:text-md text-yellow-400 capitalize">
                  {item.status}
                </h1>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default memo(PendingTransactions);
