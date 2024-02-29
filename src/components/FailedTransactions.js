import React, { memo } from "react";

function FailedTransactions(props) {
  const { recentActivity, setFailedTransaction } = props.state;

  return (
    <>
      <div
        className="flex h-screen w-screen bg-transparent backdrop-blur-md justify-center items-center font-poppins"
        onClick={() => setFailedTransaction(false)}
      >
        <div
          className="h-[65%] md:h-3/4 w-[70%] md:w-3/4 bg-white shadow-sm shadow-black  text-gray-100 p-0 md:pt-[8vh]  pb-5 box-border overflow-y-auto  rounded-md "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between p-5 h-[8vh] pb-10 box-border rounded-md rounded-b-none  w-[70.1%] top-[10.2vh] absolute md:top-[12.5vh] z-10 bg-gray-800  md:w-[75%] md:pl-[5vw] lg:pl-[5vw] text-2xl text-gray-100 items-center">
            <h1 className="font-bold text-xs m-auto text-center justify-center w-1/2  md:text-2xl">
              Failed Transactions
            </h1>
          </div>

          <div className=" w-full    space-y-4 h-auto mt-[3vh] md:mt-[0vh] md:pl-[0vw] md:p-2 md:pr-0 rounded-md rounded-t-none pt-[0vh] overflow-y-auto pb-[2vh]">
            <ul className="grid grid-cols-1 gap-2 md:gap-0 text-gray-700 pl-[4vw] md:pl-[5vw] pb-2 items-center space-y-5 text-sm md:text-xl border-b-2 overflow-y-auto">
              <ul className="grid grid-cols-4 space-y-0 text-center items-center  sticky top-0  capitalize">
                <li className="items-center flex text-center">Date</li>
                <li className="items-center flex text-center">Name</li>
                <li className="items-center flex text-center">Amount</li>
                <li className="items-center flex text-center">Status</li>
              </ul>
            </ul>
            <div className="space-y-2 text-gray-700  cursor-default">
              {recentActivity.filter((item) => item.Status === "canceled")
                .length > 0 ? (
                recentActivity
                  .filter((item) => item.Status === "canceled")
                  .map((item, index) => (
                    <ul
                      key={index}
                      className="grid grid-cols-4  space-y-0 border-b-2  pl-[4vw] md:pl-[5vw] pb-2 text-center text-xs md:text-[1rem] items-center capitalize "
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
                  ))
              ) : (
                <p className="text-gray-700 grid items-center justify-center mt-[10rem] text-sm lg:text-lg">
                  There is no canceled transactions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(FailedTransactions);
