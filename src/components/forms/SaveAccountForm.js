import React from "react";

function SaveAccountForm(props) {
  const {
    closeBeneficiaryAdding,
    handleSaveButtonClick,
    savedBeneficiaryName,
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
      <div className="w-4/5 sm:w-4/6 m-auto box-border font-poppins">
        <form
          onSubmit={(e) => handleSaveButtonClick(e)}
          onClick={(e) => e.stopPropagation()}
          className="w-auto md:w-4/5 lg:w-3/5 min-h-40 m-auto py-12 pt-7 border-2 bg-white shadow-md shadow-ash-800 mt-0 text-gray-600 rounded-lg border-white box-border text-base"
        >
          <h1 className="text-xl lg:text-2xl font-semibold flex w-full justify-center">
            Add Beneficiary
          </h1>

          <div className="w-4/5 m-auto space-y-5 sm:space-y-6 pt-5">
            <div className="sapce-y-1">
              <input
                type="text"
                className="block w-full px-4 py-2 border-gray-300 outline-none rounded-lg bg-white  border "
                placeholder="Enter beneficiary name"
                value={savedBeneficiaryName}
                onChange={handleSavedBenificiaryName}
                required
                minLength={3}
                onInvalid={(F) =>
                  F.target.setCustomValidity("Enter beneficiary name")
                }
                onInput={(F) => F.target.setCustomValidity("")}
              />
            </div>
            <div className="space-y-1 relative">
              <input
                type="tel"
                className="block w-full px-4 py-2 border-gray-300 outline-none rounded-lg bg-white border"
                placeholder="Enter Account Number"
                value={savedAccNum}
                onChange={handleSavedAccNum}
                required
                minLength={16}
                onInvalid={(F) =>
                  F.target.setCustomValidity("Enter account number")
                }
                onInput={(F) => F.target.setCustomValidity("")}
              />
              {savedAccNum.length < 16 && savedAccNum ? (
                <span className="absolute text-xs text-red-600 pointer-events-none box-border pl-1">
                  Must have 16 digits
                </span>
              ) : null}
            </div>
            <div className="space-y-1 relative">
              <input
                type="text"
                className="block w-full px-4 py-2 border-gray-300  outline-none rounded-lg bg-white border "
                placeholder="Enter IFSC code"
                value={savedIfsc}
                onChange={handleSavedIfsc}
                required
                onInvalid={(F) => F.target.setCustomValidity("Enter ifsc")}
                onInput={(F) => F.target.setCustomValidity("")}
              />

              {String(savedIfsc).length < 10 && savedIfsc ? (
                <span className="absolute text-xs text-red-600 pointer-events-none box-border pl-1">
                  Must have 10 digits
                </span>
              ) : null}
            </div>
            <input
              type="submit"
              value="Save"
              className="w-full py-2 hover:bg-gray-900 bg-gray-800 hover:cursor-pointer text-white rounded-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveAccountForm;
