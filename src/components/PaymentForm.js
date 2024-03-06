import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { TextGenerateEffect } from "../TextGenerate";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";

function PaymentForm() {
  const {
    setInitatedAmountSend,
    currentDate,
    amount,
    setAmount,
    toAccountNumber,
    setToAccountNumber,
    toIFSCNumber,
    setToIFSCNumber,
    toAccountHolderName,
    setToAccountHolderName,
    socket,
    connectionMode,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    isProfileClicked,
    setIsProfileClicked,
    sendByBeneficiaries,
    setSendByBeneficiaries,
    setEnterAccountHolderName,
    setEnterAccountNumber,
    setEnterToIfscNumber,
    setEnterAmount,
    setSavedAcc,
    setRecentTransactions,
    setIsLoggedOut,
    handleSocket,
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();
  const nav = [
    "Beneficiaries",
    "Profile",
    "Transactions",
    "Rewards",
    "Contact",
    "Log Out",
  ];

  const [allInput, setAllInput] = useState(false);

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Profile":
        navigate("/Profile ", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Back":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Transactions":
        navigate("/Transactions");
        setIsProfileClicked(false);
        break;
      case "Rewards":
        setIsProfileClicked(false);
        break;
      case "Contact":
        setIsProfileClicked(false);
        break;
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Log Out":
        handleSocket();
        setSavedAcc([]);
        setRecentTransactions([]);
        setIsLoggedOut(true);
        setIsProfileClicked(false);
        logout();
        break;
      default:
        console.log(`Unknown menu item: ${menuItem}`);
    }
  };

  const handleAmountToSend = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setAmount(sanitizedValue);
  };

  const handleAccNumToSend = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length <= 16) {
      setToAccountNumber(sanitizedValue);
    }
  };

  const handleToIfsc = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setToIFSCNumber(e.target.value);
    }
  };

  const logout = () => {
    setLoggedUser("");
    navigate("/");
  };

  const inputAlerts = () => {
    setAllInput(false);
    setEnterAccountHolderName(false);
    setEnterAccountNumber(false);
    setEnterAmount(false);
    setEnterToIfscNumber(false);
  };

  const sendAmountBySocket = (e) => {
    e.preventDefault();
    if (
      amount &&
      String(toAccountNumber).length > 15 &&
      String(toIFSCNumber).length > 9 &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      setSendByBeneficiaries(false);
      setInitatedAmountSend(true);
      const newReceiver = {
        Amount: amount,
        AccNum: toAccountNumber,
        AccHolder: toAccountHolderName,
        Ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "socket",
        mobileNumber: document.cookie,
      };

      const newTransactions = {
        Amount: amount,
        Date: currentDate,
        Description: `Sent to ${toAccountHolderName}`,
        Status: `Pending`,
        Name: toAccountHolderName,
        Uid: uuid(),
      };

      socket.emit("paymentPage", {
        mobileNumber: document.cookie,
        connected: true,
        NewReceiver: newReceiver,
        NewTransactions: newTransactions,
        Uid: uuid(),
      });
      inputAlerts();
      handleAllInput();
      navigate("/success");
    } else {
      setAllInput(true);
    }
  };

  const sendAmountByPolling = async (e) => {
    e.preventDefault();
    try {
      if (
        amount &&
        String(toAccountNumber).length > 15 &&
        String(toIFSCNumber).length > 9 &&
        toAccountNumber &&
        toAccountHolderName &&
        toIFSCNumber
      ) {
        setSendByBeneficiaries(false);
        setInitatedAmountSend(true);
        const newReceiver = {
          Amount: amount,
          AccNum: toAccountNumber,
          AccHolder: toAccountHolderName,
          Ifsc: toIFSCNumber,
          tabId: sessionStorage.getItem("tabId"),
          type: "polling",
          mobileNumber: document.cookie,
        };

        const newTransactions = {
          Amount: amount,
          Date: currentDate,
          Description: `Sent to ${toAccountHolderName}`,
          Status: `Pending`,
          Name: toAccountHolderName,
          Uid: uuid(),
        };

        navigate("/success");
        handleAllInput();

        const response = await axios.post(
          "http://localhost:8080/fromPaymentAlert",
          {
            data: newReceiver,
            newTransaction: newTransactions,
            mobileNumber: document.cookie,
          }
        );
        if (response.status === 200) {
          setAllInput(false);
        }
      } else {
        setAllInput(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAllInput = () => {
    setAmount("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };

  const getMenuProps = () => {
    if (windowWidth > 768) {
      return {
        nav,
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: [
          "Beneficiaries",
          "Profile",
          "Transactions",
          { icon: <RiMenuUnfoldFill />, id: "Menu" },
        ],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav,
    };
  };

  const sideBarProps = getSideBarProps();

  const cancelTransfer = () => {
    setSendByBeneficiaries(false);
    handleAllInput("");
    setAllInput(false);
    navigate("/Beneficiaries");
  };

  const onIdle = () => {
    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
      const tabId = sessionStorage.getItem("tabId");
      sessionStorage.clear();
      if (tabId) {
        sessionStorage.setItem("tabId", tabId);
      }
      setIsProfileClicked(false);
      logout();
    }, 3000);
    alert("Session expired! You will be redirected to login page");
  };

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    setAllInput(false);
    return () => {
      handleAllInput();
    };
  }, []);

  return (
    <>
      <div className="h-screen bg-gray-800 text-white font-sans fixed w-screen ">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        <div className="w-full h-full fixed sm:grid grid-cols-2  gap-10 ">
          <div className="w-auto hidden sm:block pl-8 cursor-default m-auto sm:mt-54 md:mt-32 xl:mt-48">
            <TextGenerateEffect
              words={`The Secure,  \n easiest and fastest \n way to transfer money.`}
            />
            <p className="ml-0 mt-16 text-xs md:text-sm text-gray-300 lg:text-xl">
              send & receive money in minutes without paying extra charges.
            </p>
          </div>
          <div className="w-4/5 xl:w-8/12 max-h-full pt-28 sm:pt-8 m-auto md:m-0 md:ml-12 lg:ml-16 xl:ml-40 md:pt-12 xl:pt-20">
            <form
              className={
                sendByBeneficiaries
                  ? "w-full h-auto relative pt-0 px-10  box-border mb-16 sm:mb-0  z-20 bg-white border-2 border-cyan-200 rounded-md flex flex-col justify-center "
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
                  <label className="block text-sm pointer-events-none  text-gray-800">
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
                    value={toAccountHolderName}
                    onChange={(e) => {
                      setToAccountHolderName(e.target.value);
                    }}
                  />
                  <div className="w-full">
                    {!toAccountHolderName && allInput ? (
                      <p className="relative top-1 text-red-500 text-xs">
                        Enter name
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col w-full text-gray-700 mb-2">
                  <label className="block text-sm pointer-events-none  text-gray-800">
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
                  />{" "}
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
                  {" "}
                  <label className="block text-sm pointer-events-none  text-gray-800">
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
                  />
                  {!toIFSCNumber && allInput ? (
                    <p className="relative top-1 text-red-500 text-xs ">
                      Enter IFSC
                    </p>
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
                  />
                  {!amount && allInput ? (
                    <p className="relative top-1 text-red-500 text-xs ">
                      Enter Amount
                    </p>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  sendByBeneficiaries
                    ? "w-full mt-4 mb-4 sm:pt-4 lg:pt-8  min-h-10 box-border"
                    : "w-full mt-8 mb-8 sm:pt-4 lg:pt-8  min-h-10 box-border"
                }
              >
                <input
                  type="submit"
                  value="SEND"
                  className={
                    sendByBeneficiaries
                      ? "block w-full px-4 py-2 m-auto mb-1 border-2  border-white rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                      : "block w-full px-4 py-2 m-auto mb-3 top-2 border-2  border-white rounded-lg focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                  }
                  onClick={
                    connectionMode === "socket"
                      ? sendAmountBySocket
                      : sendAmountByPolling
                  }
                />
                {sendByBeneficiaries ? (
                  <input
                    type="button"
                    value="CANCEL"
                    onClick={cancelTransfer}
                    className="block w-full  m-auto  px-4 py-2  mt-3 mb-3  border border-gray-300 rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                  />
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
      {windowWidth > 768 ? null : isProfileClicked ? (
        <>
          <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
        </>
      ) : null}
    </>
  );
}

export default memo(PaymentForm);
