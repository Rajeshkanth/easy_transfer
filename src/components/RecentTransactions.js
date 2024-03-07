import React, { memo } from "react";

function RecentTransactions(props) {
  const { recentActivity, goTo, IoIosArrowForward, windowWidth } = props.data;
  return (
    <div
      className={
        recentActivity.length < 4
          ? "h-1/2 md:h-full md:w-full md:-ml-16 lg:-ml-20 xl:-ml-28 md:-mt-20 lg:-mt-28 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white hover:bg-gray-100 md:shadow-md shadow-gray-300 md:rounded-md"
          : "h-1/2 md:h-full md:w-full md:-ml-16 lg:-ml-20 xl:-ml-28 md:-mt-20 lg:-mt-28 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white hover:bg-gray-100 md:shadow-md shadow-gray-300 md:rounded-md"
      }
    >
      <div className="flex justify-between md:gap-0 sticky top-0 z-5 bg-slate-700 text-white h-12 pl-4 border-b-2  items-center">
        <h1 className="text-sm md:text-xs lg:text-xl xl:text-xl md:pr-0 ">
          Recent Activity
        </h1>
        <h1
          className="text-xs md:text-xs xl:text-sm mr-12 flex items-center text-gray-200 hover:cursor-pointer"
          onClick={() => goTo("transactions")}
        >
          View more <IoIosArrowForward />
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-6 p-1 space-y-0 items-center pl-2 border-b-2">
        <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-2 md:gap-0 pl-2 md:pl-0 lg:pl-2">
          <h1>Date</h1>
          <h1>Description</h1>
        </div>
        <div className="grid grid-cols-2 text-sm md:text-md items-center gap-5 lg:gap-10 xl:gap-4">
          <h1 className="">Amount</h1>
          <h1>Status</h1>
        </div>
      </div>
      {recentActivity.length < 1 ? (
        <p className="flex items-center justify-center pt-20 pb-20">
          There is no recent transactions
        </p>
      ) : (
        recentActivity
          .slice(-13)
          .reverse()
          .map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-5 md:gap-3 lg:gap-7 xl:gap-16 p-1 space-y-0 items-center pl-4 md:pl-2 lg:pl-4 pr-4 border-b-2 text-xs md:text-xs lg:text-md"
            >
              <div className="grid grid-cols-2 gap-0 lg:gap-2 xl:gap-6 items-cente">
                <h1 className="">{item.date}</h1>
                {windowWidth > 767 && windowWidth < 1000 ? (
                  <h1 className=" overflow-x-auto md:pl-2 md:w-28 lg:w-24">{`To ${item.name}`}</h1>
                ) : (
                  <h1 className=" overflow-x-auto w-28 lg:w-32">{`Sent to ${item.name}`}</h1>
                )}
              </div>
              <div className="grid grid-cols-2 pl-4 md:pl-4 lg:pl-2 xl:pl-0 gap-0">
                <h1 className="">{item.amount}</h1>
                <h1
                  className={
                    item.status === "completed"
                      ? " text-green-600 capitalize"
                      : item.status === "canceled"
                      ? " text-red-800 capitalize"
                      : " text-yellow-400 capitalize"
                  }
                >
                  {item.status}
                </h1>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default memo(RecentTransactions);
