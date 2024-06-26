import React, { memo } from "react";

function SavedAccounts(props) {
  const { beneficiaries, goTo, IoIosArrowForward } = props.data;
  return (
    <div
      className={
        "h-1/2 md:h-80 lg:h-80 xl:h-96 md:-ml-20 lg:-ml-24 xl:-ml-32 md:-mt-28 lg:-mt-28 xl:-mt-28 md:w-64 lg:w-4/5 xl:w-5/6 border-b-2 md:border-b-0 bg-white hover:bg-gray-100 space-y-2 md:space-y-1 md:shadow-md shadow-gray-300 rounded-md pt-4 pb-8"
      }
    >
      <div className="flex justify-between sm:grid sm:grid-cols-2 sm:gap-80 md:gap-0 xl:gap-20 pl-4 lg:pl-8">
        <h1 className="text-lg md:text-sm lg:text-xl ">Recipients</h1>
        <h1
          className="text-sm md:text-xs lg:text-md xl:text-sm md:ml-4 lg:ml-8 flex items-center pr-12 sm:pr-0 text-gray-900 hover:cursor-pointer"
          onClick={() => goTo("beneficiaries")}
        >
          View more <IoIosArrowForward />
        </h1>
      </div>
      <div
        className={
          beneficiaries && beneficiaries.length < 5
            ? "h-96 pt-4 xl:h-full pl-4 md:pl-4 lg:pl-8 md:pt-0 md:pb-4"
            : "grid h-1/2 pt-0 xl:h-full pl-4 md:pl-4 lg:pl-8 md:pt-4 md:pb-4"
        }
      >
        {beneficiaries.length > 0 ? (
          beneficiaries.slice(0, 6).map((item, index) => (
            <div key={index} className="space-y-0 xl:h-12 leading-0">
              <h1
                key={index}
                className="text-md md:text-sm lg:text-base capitalize font-bold"
              >
                {item.name}
              </h1>
              <h1 className="text-sm md:text-sm">
                {item.account.slice(-4).padStart(item.account.length, "x")}
              </h1>
            </div>
          ))
        ) : (
          <p className="flex items-center text-sm justify-center h-full">
            No saved accounts.
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(SavedAccounts);
