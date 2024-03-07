import React from "react";

function SaveAccountForm(props) {
  const {
    closeBeneficiaryAdding,
    handleSaveButtonClick,
    savedBeneficiaryName,
    allInputsAlert,
    handleSavedBenificiaryName,
    savedIfsc,
    savedAccNum,
    handleSavedAccNum,
    handleSavedIfsc,
  } = props.data;
  return (
    <div
      className="fixed top-0 box-border z-200 backdrop-blur-xl h-screen w-screen flex items-center font-poppins"
      onClick={closeBeneficiaryAdding}
    >
      <div className="w-3/4 m-auto box-border">
        <form
          onSubmit={(e) => handleSaveButtonClick(e)}
          onClick={(e) => e.stopPropagation()}
          className="w-auto md:w-4/5 lg:w-3/5 min-h-40 m-auto py-12 border-2 bg-white shadow-md shadow-ash-800 mt-0 text-gray-600 rounded-lg border-white box-border text-base"
        >
          <div className="m-auto py-3 font-poppins sm:p-2 text-gray-200 relative bg-gray-700 w-4/5 sm:w-4/5 mb-2 rounded-md grid items-center justify-center">
            <h1 className="text-lg">Add Beneficiary</h1>
          </div>
          <div
            className={
              allInputsAlert
                ? "w-4/5 m-auto space-y-2 sm:space-y-2 pt-4 "
                : "w-4/5 m-auto space-y-5 sm:space-y-5 pt-4 "
            }
          >
            <div className="sapce-y-1">
              <input
                type="text"
                className={
                  allInputsAlert && !savedBeneficiaryName
                    ? "block w-full px-4 py-2 border-red-500  outline-none rounded-lg bg-white  border"
                    : "block w-full px-4 py-2 border-gray-300 outline-none rounded-lg bg-white  border "
                }
                placeholder="Enter beneficiary name"
                value={savedBeneficiaryName}
                onChange={handleSavedBenificiaryName}
                required
              />
              {allInputsAlert && !savedBeneficiaryName ? (
                <span className="text-xs text-red-600 pointer-events-none box-border">
                  Enter name
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              <input
                type="tel"
                className={
                  allInputsAlert && !savedAccNum
                    ? "block w-full px-4 py-2 border-red-500  outline-none rounded-lg bg-white border"
                    : "block w-full px-4 py-2 border-gray-300 outline-none rounded-lg bg-white border"
                }
                placeholder="Enter Account Number"
                value={savedAccNum}
                onChange={handleSavedAccNum}
                required
                minLength={16}
              />
              {savedAccNum.length < 16 && savedAccNum ? (
                <span className="text-xs text-red-600 pointer-events-none box-border">
                  Account number should have 16 digits
                </span>
              ) : null}
              {allInputsAlert && !savedAccNum ? (
                <span className="text-xs text-red-600 pointer-events-none box-border">
                  Enter account number
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              <input
                type="text"
                className={
                  allInputsAlert && !savedIfsc
                    ? "block w-full px-4 py-2 border-red-500  outline-none rounded-lg bg-white border "
                    : "block w-full px-4 py-2 border-gray-300  outline-none rounded-lg bg-white border "
                }
                placeholder="Enter IFSC code"
                value={savedIfsc}
                onChange={handleSavedIfsc}
                required
              />
              {allInputsAlert && !savedIfsc ? (
                <span className="text-xs text-red-600 pointer-events-none box-border">
                  Enter IFSC code
                </span>
              ) : null}
              {String(savedIfsc).length < 10 && savedIfsc ? (
                <span className="text-xs text-red-600 pointer-events-none box-border">
                  IFSC code should have 10 digits
                </span>
              ) : null}
            </div>
            <input
              type="submit"
              value="Save"
              className="w-full py-2 hover:bg-gray-600 bg-gray-800 hover:cursor-pointer text-white rounded-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveAccountForm;
