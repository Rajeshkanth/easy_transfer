import { TextField } from "@mui/material";
import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import AlertModal from "../utils/AlertModal";
import { paymentFailedSvg } from "../utils/CautionSvg";
import { Toast } from "flowbite-react";
import { Toaster, toast } from "sonner";

function HomePageSavedAccounts(props) {
  const {
    savedAcc,
    filteredAccounts,
    searchBarActive,
    sendMoney,
    setSearchBarActive,
    setFilteredAccounts,
    transferPage,
    windowWidth,
  } = props.data;
  const [accounts, setAccounts] = useState([]);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [accountNumberToDelete, setAccountNumberToDelete] = useState("");

  const deleteBeneficiary = async (loggedMobileNumber, accountNumber) => {
    try {
      if (!loggedMobileNumber || !accountNumber) {
        return alert("Invalid item");
      }
      setAlertModalOpen(true);
      setAccountNumberToDelete(accountNumber);
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      alert("Internal error");
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/removeBeneficiary`,
        {
          mobileNumber: sessionStorage.getItem("mobileNumber"),
          accountNumber: accountNumberToDelete,
        }
      );

      if (response.status === 200) {
        setAccounts(
          accounts.filter(
            (account) => account.accountNumber !== accountNumberToDelete
          )
        );
      } else {
        alert("Failed to remove account");
      }
    } catch (error) {
      alert("An error occurred while deleting account, reload the page.");
    } finally {
      setAlertModalOpen(false);
      toast.success("Account removed successfully", {
        className: "text-green-500",
      });
      setAccountNumberToDelete("");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmed(false);
    setAlertModalOpen(false);
  };

  const buttons = [
    {
      label: "Yes",
      method: confirmDelete,
      bg: "bg-gray-800 focus:ring-gray-600 text-lg font-semibold",
    },
    {
      label: "No",
      method: cancelDelete,
      bg: "bg-red-600 focus:ring-gray-600 text-lg font-semibold",
    },
  ];

  const searchBeneficiary = (e) => {
    setSearchBarActive(true);
    const searchText = e.target.value.toLowerCase();
    const searchFilteredAccounts = savedAcc.filter((item) => {
      const beneficiaryName = item.beneficiaryName.toLowerCase();
      return beneficiaryName.startsWith(searchText);
    });
    if (searchFilteredAccounts) {
      setFilteredAccounts(searchFilteredAccounts);
    }
  };

  useEffect(() => {
    if (searchBarActive) {
      setAccounts(filteredAccounts);
    } else {
      setAccounts(savedAcc);
    }
  }, [searchBarActive, filteredAccounts, savedAcc]);

  return (
    <>
      <Toaster className="text-green-500 bg-red-500" />
      <div className="fixed z-100 top-8 flex items-center justify-center w-screen left-0"></div>
      <div className="sm:w-full h-106 md:h-full bg-white pt-0 md:pb-0 lg:ml-60 box-borde border border-gray-200 overflow-y-auto rounded-md backdrop-blur-xl mt-0 shadow-md md:float-right font-poppins">
        <div className="sticky top-0 bg-white w-full h-auto md:h-auto lg:gap-6 xl:gap-0 px-5 md:px-6 lg:px-8 pt-4 sm:pt-6 sm:pb-2 rounded-md box-border flex justify-between">
          <input
            type="search"
            className="w-full sm:w-2/3 md:w-3/5 lg:w-4/6 xl:w-4/5 mt-0 py-2 sm:py-3 border border-gray-500 focus:outline-none mb-4 text-lg bg-white placeholder-black placeholder-opacity-70 text-black pl-4 sm:pl-6 pr-4 md:pl-3 lg:pl-5 lg:pr-4 font-poppins rounded-md"
            onChange={searchBeneficiary}
            placeholder="Search beneficiaries"
          />
          {windowWidth > 640 ? (
            <button
              className="font-bold w-auto md:w-2/6 lg:w-1/3 xl:w-auto md:p-2 lg:p-3 px-8 md:px-4 lg:px-8 xl:px-6 rounded-md cursor-pointer outline-none hover:bg-gray-900 text-center text-sm xl:text-base bg-gray-800 text-slate-100 mb-4"
              onClick={transferPage}
            >
              New Transfer
            </button>
          ) : null}
        </div>

        {accounts.length < 1 ? (
          <div className="h-4/5 sm:w-full gap-4 flex justify-center items-center">
            <p className="text-black ">No saved account found</p>
          </div>
        ) : (
          <div className="px-3 sm:grid md:grid-cols-1 lg:grid-cols-2">
            {accounts.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between md:justify-around xl:justify-evenly h-auto min-w-60 w-11/12 md:w-11/12 lg:w-11/12 m-auto p-2 py-4 sm:pl-3 md:pl-2 lg:p-4 px-4 lg:px-2 xl:px-0 text-gray-800 bg-white border mb-3 sm:mb-6 rounded-md hover:shadow-gray-800 box-border shadow-md"
              >
                <div className="h-12 w-12 hidden sm:h-11 sm:w-14 md:h-11 md:w-11 px-6 sm:px-2 md:px-4 border rounded-full text-center items-center justify-center sm:flex text-base font-bold shadow-xl cursor-default">
                  {`${item.beneficiaryName.charAt(0).toUpperCase()}${
                    item.beneficiaryName.includes(" ")
                      ? item.beneficiaryName
                          .split(" ")[1]
                          .charAt(0)
                          .toUpperCase()
                      : ""
                  }`}
                </div>
                <ul className="w-max sm:ml-8 md:ml-0 grid sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 cursor-default pl-0">
                  <li className="font-semibold">{item.beneficiaryName}</li>
                  <li className="w-fit lg:text-sm xl:text-base sm:-ml-8 md:ml-0">
                    {item.accountNumber
                      .slice(-4)
                      .padStart(item.accountNumber.length, "x")}
                  </li>
                </ul>
                <FaTrash
                  className="lg:text-sm xl:text-base hover:cursor-pointer"
                  onClick={() =>
                    deleteBeneficiary(
                      sessionStorage.getItem("mobileNumber"),
                      item.accountNumber
                    )
                  }
                />
                <button
                  onClick={() => sendMoney(index)}
                  className=" px-3 sm:px-0 py-3 text-sm md:text-base lg:px-0 w-auto sm:w-24 md:w-16 xl:w-20 xl:ml-2 focus:outline-none rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-900 hover:cursor-pointer"
                >
                  Send
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {alertModalOpen ? (
        <div className="h-screen w-screen fixed left-0 z-100 top-0 bg-transparent flex items-center justify-center">
          <AlertModal
            buttons={buttons}
            icon={paymentFailedSvg}
            msg={`Do you want to delete ?`}
            accNum={`${accountNumberToDelete
              .slice(-4)
              .padStart(accountNumberToDelete.length, "x")}`}
          />
        </div>
      ) : null}
    </>
  );
}

export default memo(HomePageSavedAccounts);
