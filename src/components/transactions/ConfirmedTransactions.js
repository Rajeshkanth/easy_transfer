import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { PiArrowUpRightBold } from "react-icons/pi";

function ConfirmedTransactions(props) {
  const {
    currentTransactions,
    handlePageChange,
    currentPage,
    totalPages,
    windowWidth,
  } = props.data;

  return (
    <div className="w-11/12 h-full lg:max-h-full xl:h-full m-auto shadow-md bg-white font-poppins rounded-md mt-20 md:mt-5 lg:mt-0 xl:mt-3 md:pt-0 overflow-y-auto border border-gray-200">
      <div className="sticky top-0 bg-white text-gray-800 h-auto w-full flex justify-between items-center px-5 sm:px-10 py-2 sm:py-4 rounded-md">
        <div className="text-lg md:text-2xl font-light flex items-center">
          Statement
        </div>
        <div className="flex justify-center items-center">
          <span className="flex items-center pr-4 font-semibold text-xs md:text-base">
            Page : {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={
              currentPage === 1
                ? "mr-2 px-1 py-1 bg-green-300 text-white rounded-md cursor-not-allowed sm:text-2xl"
                : "mr-2 px-1 py-1 bg-green-500 text-white rounded-md sm:text-2xl active:text-violet-700"
            }
          >
            <MdKeyboardArrowLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "bg-green-300 px-1 py-1 text-white rounded-md cursor-not-allowed sm:text-2xl"
                : "px-1 py-1 bg-green-500 text-white rounded-md sm:text-2xl active:text-violet-700"
            }
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
      <div className="sticky top-11 sm:top-0 md:top-0 lg:top-16 grid grid-cols-3 sm:grid-cols-5 md:gap-2 lg:gap-0 items-center text-gray-700 bg-slate-100 font-semibold m-auto pl-5 sm:pl-10 text-sm md:text-base lg:text-lg py-2 sm:py-3">
        {windowWidth < 640 ? (
          <h1>Description</h1>
        ) : (
          <>
            <h1>Date</h1>
            <h1>Name</h1>
          </>
        )}
        <h1 className="w-40 sm:w-56 sm:-ml-8 md:-ml-4 lg:ml-0">
          Account number
        </h1>
        <h1 className="ml-8 sm:ml-0">Amount</h1>
        <h1 className="hidden sm:block">Status</h1>
      </div>

      {currentTransactions.length < 1 ? (
        <div className="grid items-center h-4/5 text-gray-800 justify-center">
          <p className=" pt-0">No transactions available</p>
        </div>
      ) : (
        currentTransactions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-5 items-center justify-center pl-5 sm:pl-10 mb-0 py-2 sm:py-4 box-border border-b rounded-md font-light text-sm md:text-sm  xl:text-base text-gray-600 pt-3 cursor-default"
          >
            {windowWidth < 640 ? (
              <div className="grid grid-rows-2">
                <h1 className="w-fit">{item.date}</h1>
                <h1 className="w-fit flex items-center font-semibold sm:font-medium">
                  {item.name}
                </h1>
              </div>
            ) : (
              <>
                <h1 className="w-fit">{item.date}</h1>

                <h1 className="w-fit flex items-center">{item.name}</h1>
              </>
            )}
            <h1 className="w-fit sm:-ml-8 md:-ml-4 lg:ml-0">
              {item.accountNumber
                .slice(-4)
                .padStart(item.accountNumber.length, "x")}
            </h1>
            <h1
              className={
                item.status === "confirmed"
                  ? " font-medium w-fit ml-8 sm:ml-2 flex items-center gap-1"
                  : " font-medium w-fit ml-8 sm:ml-2 flex items-center justify-around"
              }
            >
              ₹{item.amount}{" "}
              {item.status === "confirmed" ? (
                <PiArrowUpRightBold className="text-red-500" />
              ) : null}
            </h1>
            <h1
              className={
                item.status === "confirmed"
                  ? "hidden sm:block md:text-xs lg:text-base text-green-600 capitalize font-medium"
                  : "hidden sm:block md:text-xs lg:text-base text-red-600 capitalize font-medium"
              }
            >
              {item.status}
            </h1>
          </div>
        ))
      )}
    </div>
  );
}

export default ConfirmedTransactions;
