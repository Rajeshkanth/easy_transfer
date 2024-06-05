import React, { memo } from "react";

function RecentTransactions(props) {
  const { recentActivity, goTo } = props.data;

  return (
    <div className="w-full md:w-72 md:max-w-md xl:w-96 p-8 py-6 bg-white border border-gray-200 rounded-lg shadow-md m-auto mt-8 md:mt-0 sm:p-8 sm:pb-4 md:p-4 md:pb-3 xl:p-7 xl:pb-4 box-border">
      <div className="flex items-center justify-between mb-4 md:mb-1 xl:mb-4">
        <h5 className="md:text-base lg:text-xl font-bold leading-none text-gray-900 dark:text-white">
          Recent activities
        </h5>
        <span
          onClick={() => goTo("transactions")}
          className="text-xs xl:text-sm font-medium text-slate-700 hover:cursor-pointer hover:underline"
        >
          View all
        </span>
      </div>
      <div
        className={recentActivity.length < 5 ? "md:h-60 xl:h-72" : "flow-root"}
      >
        <ul role="list" className="divide-y divide-gray-200 overflow-y-auto">
          {recentActivity.length < 1 ? (
            <div className="h-72 pt-24">
              <span className="text-gray-900 items-center text-center flex justify-center">
                No recent activities
              </span>
            </div>
          ) : (
            recentActivity
              .slice(-5)
              .reverse()
              .map((item, index) => (
                <li key={index} className="py-3 sm:py-2 md:py-1 xl:py-2">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {item.accountNumber
                          .slice(-4)
                          .padStart(item.accountNumber.length, "x")}
                      </p>
                    </div>
                    <div
                      className={
                        item.status === "confirmed"
                          ? "inline-flex items-center text-base font-semibold text-gray-900"
                          : "inline-flex items-center text-base font-semibold text-red-500"
                      }
                    >
                      ₹{item.amount}
                    </div>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default memo(RecentTransactions);
