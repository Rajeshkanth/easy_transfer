import React, { memo } from "react";

function PaymentForm(props) {
  const {
    sendAmountByPolling,
    sendAmountBySocket,
    sendByBeneficiaries,
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
    setSaveBeneficiaryCheck,
    saveBenficiaryCheck,
  } = props.data;

  const handleSaveBeneficiaryCheckMark = () => {
    setSaveBeneficiaryCheck(!saveBenficiaryCheck);
  };

  return (
    <form
      onSubmit={
        connectionMode === "socket" ? sendAmountBySocket : sendAmountByPolling
      }
      autoComplete="off"
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 sm:w-4/5 md:w-2/5 lg:w-1/3 max-w-md mx-auto bg-white shadow-sm shadow-gray-700 rounded-md p-8 px-10 sm:px-12 box-border"
    >
      <span className="cursor-default text-xl sm:text-xl lg:text-3xl xl:text-2xl mb-4 font-extrabold text-gray-600 flex justify-center">
        Money Transfer
      </span>
      <div className="grid md:gap-6">
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="floating_name"
            id="floating_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            minLength={3}
            value={toAccountHolderName}
            onChange={(e) => {
              setToAccountHolderName(e.target.value);
            }}
            onInvalid={(F) =>
              F.target.setCustomValidity("Enter beneficiary name")
            }
            onInput={(F) => F.target.setCustomValidity("")}
            required
          />
          <label
            for="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Beneficiary name
          </label>
        </div>
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <input
          name="floating_account_number"
          id="floating_account_number"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
          maxLength={16}
          type="tel"
          placeholder=" "
          value={toAccountNumber}
          onChange={handleAccNumToSend}
          onInvalid={(F) => F.target.setCustomValidity("Enter account number")}
          onInput={(F) => F.target.setCustomValidity("")}
        />
        <label
          for="floating_account_number"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Account number
        </label>
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <input
          type="tel"
          name="floating_card"
          id="floating_card"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          minLength={10}
          value={toIFSCNumber}
          onChange={(e) => {
            handleToIfsc(e);
          }}
          onInvalid={(F) => F.target.setCustomValidity("Enter IFSC code")}
          onInput={(F) => F.target.setCustomValidity("")}
        />
        <label
          for="floating_card"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          IFSC code
        </label>
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <input
          type="tel"
          name="repeat_password"
          id="floating_repeat_password"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={amount}
          onChange={(e) => handleAmountToSend(e)}
          onInvalid={(F) => F.target.setCustomValidity("Enter amount")}
          onInput={(F) => F.target.setCustomValidity("")}
        />
        <label
          for="floating_repeat_password"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Amount
        </label>
      </div>

      {sendByBeneficiaries ? null : (
        <div class="flex items-center pl-1">
          <input
            id="saveAccountCheckbox"
            type="checkbox"
            class="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded "
            onClick={() => handleSaveBeneficiaryCheckMark()}
          />
          <label
            for="saveAccountCheckbox"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Save beneficiary
          </label>
        </div>
      )}

      <div
        className={
          sendByBeneficiaries
            ? "w-full mt-4 mb-4 sm:pt-4 lg:pt-8 min-h-10 box-border"
            : "w-full mt-4 mb-4 sm:pt-4 lg:pt-8 min-h-10 box-border"
        }
      >
        <input
          type="submit"
          value="Send"
          disabled={
            !toAccountHolderName || !toAccountNumber || !toIFSCNumber || !amount
          }
          className={
            sendByBeneficiaries
              ? `block w-full px-4 py-2 m-auto mb-1 border-2  rounded-md focus:outline-none ${
                  amount
                    ? `bg-gray-800 border-gray-800 text-white  hover:cursor-pointer`
                    : `bg-gray-300 border-gray-100 text-gray-600`
                } `
              : `block w-full px-4 py-2 m-auto mb-3 top-2 border-2  rounded-lg focus:outline-none  ${
                  amount
                    ? `bg-gray-800 text-white hover:cursor-pointer border-gray-800`
                    : `bg-gray-300 text-gray-600 border-gray-300`
                }`
          }
        />
        {sendByBeneficiaries ? (
          <input
            type="button"
            value="Cancel"
            onClick={cancelTransfer}
            className="block w-full m-auto px-4 py-2 mt-3 mb-3 border border-red-600 rounded-md focus:outline-none bg-red-600 text-white hover:bg-red-500 hover:cursor-pointer"
          />
        ) : null}
      </div>
    </form>
  );
}

export default memo(PaymentForm);
