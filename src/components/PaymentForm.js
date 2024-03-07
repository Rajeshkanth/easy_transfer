import React, { memo } from "react";

function PaymentForm(props) {
  const {
    sendAmountByPolling,
    sendAmountBySocket,
    sendByBeneficiaries,
    allInput,
    toAccountHolderName,
    toAccountNumber,
    toIFSCNumber,
    setToAccountHolderName,
    handleAccNumToSend,
    handleToIfsc,
    handleAmountToSend,
    amount,
    connectionMode,
    cancelTransfer,
  } = props.data;
  return (
    <form
      onSubmit={
        connectionMode === "socket" ? sendAmountBySocket : sendAmountByPolling
      }
      className={
        sendByBeneficiaries
          ? "w-full h-auto relative pt-0 px-10 box-border mb-16 sm:mb-0 z-20 bg-white border-2 border-cyan-200 rounded-md flex flex-col justify-center "
          : "w-full h-auto relative pt-0 px-10 box-border z-20 bg-white border-2 border-cyan-200 rounded-md flex flex-col justify-center "
      }
    >
      <div className=" h-auto mt-8 mb-4 lg:mt-4 lg:mb-0 text-gray-800 w-full text-center flex justify-center rounded-md rounded-b-none">
        <h1 className="cursor-default text-xl sm:text-xl lg:text-3xl xl:text-4xl font-extrabold text-gray-600 ">
          Money Transfer
        </h1>
      </div>
      <div className="min-h-30 relative top-2 lg:top-8 box-border w-full text-gray-700">
        <div className="w-full flex flex-col mb-2">
          <label className="block text-sm pointer-events-none text-gray-800">
            Beneficiary name
          </label>
          <input
            type="text"
            id="receiver-name"
            className={
              allInput && !toAccountHolderName
                ? "w-full border-red-800 border p-2 px-4 text-md focus:outline-none rounded-lg"
                : "w-full border-slate-300 border p-2 px-4 text-md focus:outline-none rounded-lg"
            }
            name="receiver-account-holder"
            placeholder="Name"
            minLength={3}
            value={toAccountHolderName}
            onChange={(e) => {
              setToAccountHolderName(e.target.value);
            }}
            required
          />
          <div className="w-full">
            {!toAccountHolderName && allInput ? (
              <p className="relative top-1 text-red-500 text-xs">Enter name</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col w-full text-gray-700 mb-2">
          <label className="block text-sm pointer-events-none text-gray-800">
            Account number
          </label>
          <input
            className={
              allInput && toAccountNumber.length < 16
                ? "w-full border-red-800 border p-2 px-4 text-md focus:outline-none rounded-lg"
                : toAccountNumber.length < 16 && toAccountNumber
                ? "w-full border-red-800 border p-2 px-4 text-md focus:outline-none rounded-lg"
                : "w-full border-slate-300 border p-2 px-4 text-md focus:outline-none rounded-lg"
            }
            type="tel"
            minLength={16}
            id="rec-account-number"
            name="rec-account-number"
            placeholder="Account number"
            value={toAccountNumber}
            onChange={handleAccNumToSend}
            required
          />

          {String(toAccountNumber).length < 16 && toAccountNumber ? (
            <>
              <p className="w-full relative top-1 text-red-500 text-xs">
                Must have 16 digits
              </p>
            </>
          ) : null}
          {!toAccountNumber && allInput ? (
            <>
              <p className="relative top-1 text-red-500 text-xs">
                Enter account number
              </p>
            </>
          ) : null}
        </div>

        <div className="w-full flex flex-col mb-2">
          <label className="block text-sm pointer-events-none text-gray-800">
            IFSC code
          </label>
          <input
            className={
              allInput && !toIFSCNumber
                ? "w-full border-red-800 border py-2 px-4 text-md focus:outline-none rounded-lg"
                : toIFSCNumber.length < 10 && toIFSCNumber
                ? "w-full border-red-800 border py-2 px-4 text-md focus:outline-none rounded-lg"
                : "w-full border-slate-300 border py-2 px-4 text-md focus:outline-none rounded-lg"
            }
            type="text"
            id="rec-ifsc-number"
            name="rec-ifsc-number"
            placeholder="IFSC Code"
            minLength={10}
            value={toIFSCNumber}
            onChange={(e) => {
              handleToIfsc(e);
            }}
            required
          />

          {!toIFSCNumber && allInput ? (
            <p className="relative top-1 text-red-500 text-xs ">Enter IFSC</p>
          ) : null}
          {String(toIFSCNumber).length < 10 && toIFSCNumber ? (
            <p className="w-full relative top-1 text-red-500 text-xs">
              Must have 10 digits
            </p>
          ) : null}
        </div>

        <div className="w-full flex flex-col mb-0">
          <label className="block  text-sm pointer-events-none  text-gray-800">
            Amount
          </label>
          <input
            type="tel"
            name="amount"
            id="amount"
            className={
              !amount && allInput
                ? "w-full border-red-800 border p-2 px-4 text-md focus:outline-none rounded-lg"
                : "w-full border-slate-300 border p-2 px-4 text-md focus:outline-none rounded-lg"
            }
            value={amount}
            onChange={(e) => handleAmountToSend(e)}
            placeholder="Amount"
            required
          />
          {!amount && allInput ? (
            <p className="relative top-1 text-red-500 text-xs ">Enter Amount</p>
          ) : null}
        </div>
      </div>
      <div
        className={
          sendByBeneficiaries
            ? "w-full mt-4 mb-4 sm:pt-4 lg:pt-8 min-h-10 box-border"
            : "w-full mt-8 mb-8 sm:pt-4 lg:pt-8 min-h-10 box-border"
        }
      >
        <input
          type="submit"
          value="SEND"
          className={
            sendByBeneficiaries
              ? "block w-full px-4 py-2 m-auto mb-1 border-2 border-white rounded-md focus:outline-none bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
              : "block w-full px-4 py-2 m-auto mb-3 top-2 border-2 border-white rounded-lg focus:outline-none bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
          }
        />
        {sendByBeneficiaries ? (
          <input
            type="button"
            value="CANCEL"
            onClick={cancelTransfer}
            className="block w-full m-auto px-4 py-2 mt-3 mb-3 border border-gray-300 rounded-md focus:outline-none bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
          />
        ) : null}
      </div>
    </form>
  );
}

export default memo(PaymentForm);
