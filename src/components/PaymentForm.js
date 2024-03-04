import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import { TextGenerateEffect } from "../TextGenerate";

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
    savedAcc,
    setEnterAccountHolderName,
    setEnterAccountNumber,
    setEnterToIfscNumber,
    setEnterAmount,
    setSavedAcc,
    setRecentTransactions,
    setIsLoggedOut,
    setSavedAccLength,
    handleSocket,
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();

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
        console.log("Navigating to Rewards page");
        setIsProfileClicked(false);
        break;
      case "Contact":
        console.log("Navigating to Contact page");
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
        const tabId = sessionStorage.getItem("tabId");
        sessionStorage.clear();
        if (tabId) {
          sessionStorage.setItem("tabId", tabId);
        }
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
    console.log("clicked");
    if (
      amount &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber &&
      String(toAccountNumber).length > 15 &&
      String(toIFSCNumber).length > 9
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
    } else if (
      !amount &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      setAllInput(true);
    } else {
      setAllInput(true);
    }
  };

  const sendAmountByPolling = async (e) => {
    try {
      e.preventDefault();
      if (
        amount &&
        toAccountNumber &&
        toAccountHolderName &&
        toIFSCNumber &&
        String(toAccountNumber).length > 15 &&
        String(toIFSCNumber).length > 9
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
      } else if (
        !amount &&
        toAccountNumber &&
        toAccountHolderName &&
        toIFSCNumber
      ) {
        setAllInput(true);
      } else {
        setAllInput(true);
      }
    } catch (err) {
      return err;
    }
  };

  const handleAllInput = () => {
    setAmount("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };

  const getMenuProps = () => {
    if (windowWidth > 1024) {
      return {
        nav: [
          "Beneficiaries",
          "Profile",
          "Transactions",
          "Rewards",
          "Contact",
          "Log Out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          "Beneficiaries",
          "Profile",
          "Transactions",
          "Rewards",
          "Contact",
          "Log Out",
        ],
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
      nav: [
        "Profile",
        "Beneficiaries",
        "Transactions",
        "Rewards",
        "Contact",
        "Log Out",
      ],
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

  useEffect(() => {
    const length = savedAcc ? savedAcc.length : 0;
    sessionStorage.setItem("length", length);
    setSavedAccLength(sessionStorage.getItem("length"));
  }, [savedAcc]);

  return (
    <>
      <div className="h-screen bg-gray-800 text-white font-sans fixed w-screen ">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        <div className="flex w-full fixed justify-center items-center">
          <div className="w-custom-98  flex  justify-evenly xl:h-custom-40">
            <div className="hidden sm:block sm:w-1/2 md:w-auto xl:w-custom-58 xl:pl-0 cursor-default">
              {" "}
              <TextGenerateEffect
                words={`The Secure,  \n easiest and fastest \n way to transfer money.`}
              />
              <p className="ml-0 mt-16 text-xs md:text-sm text-gray-300 lg:text-xl">
                send & receive money in minutes without paying extra charges.
              </p>
            </div>
            <form
              className={
                sendByBeneficiaries
                  ? "w-custom-80 sm:w-5/12  h-custom-81 sm:h-custom-90  md:w-2/5   xl:w-1/3 relative pt-0  px-10 py-10  box-border mb-16 md:mb-0  z-20 bg-white border-2 border-cyan-200  space-y-3 sm:space-y-0 rounded-md mt-28   md:mt-12   flex flex-col justify-center "
                  : "w-custom-80 sm:w-5/12  h-custom-80 md:h-custom-90  md:w-2/5   xl:w-1/3 relative pt-0  px-10 py-10  box-border mb-16 md:mb-0  z-20 bg-white border-2 border-cyan-200  space-y-3 sm:space-y-0 rounded-md mt-28  md:mt-12   flex flex-col justify-center "
              }
            >
              <div className=" h-auto sm:h-1/6 pt-4 pb-4 lg:pb-0 text-gray-800   w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className="cursor-default mt-3  sm:mt-4 md:mt-1 lg:mt-1 sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-600 text-2xl">
                  Money Transfer
                </h1>
              </div>
              <div className="md:ml-0  min-h-30 relative top-2 lg:top-8 xl:top-4 box-border  w-full ">
                <label className="block  text-sm  md:ml-5   pointer-events-none leading-6 text-gray-800">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  className={
                    allInput && !toAccountHolderName
                      ? "block relative w-full sm-11/12 sm:mb-4 md:w-custom-85 text-gray-800 lg:w-custom-90 m-auto  px-4 py-2 border mb-4 border-red-800  rounded-md focus:outline-none "
                      : "block relative w-full sm-11/12 sm:mb-4 md:w-custom-85 text-gray-800 lg:w-custom-90 m-auto  px-4 py-2 border mb-4 border-gray-300  rounded-md focus:outline-none "
                  }
                  name="receiver-account-holder"
                  placeholder="Account Holder's Name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />
                {!toAccountHolderName && allInput ? (
                  <>
                    <p className="text-left absolute text-xs text-red-600 mt-mt-8 md:ml-5  lg:ml-5 mb-2">
                      Enter name
                    </p>
                  </>
                ) : null}
                <label className="block  text-sm  md:ml-5   pointer-events-none leading-6 text-gray-800">
                  Account Number
                </label>
                <input
                  className={
                    allInput && toAccountNumber.length < 16
                      ? "block relative w-full sm:11/2 sm:mb-4 md:w-custom-85 text-gray-800 lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-red-800 rounded-md focus:outline-none "
                      : toAccountNumber.length < 16 && toAccountNumber
                      ? "block relative w-full sm:11/2 sm:mb-4 md:w-custom-85 text-gray-800 lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-red-800 rounded-md focus:outline-none "
                      : "block relative w-full sm:11/2 sm:mb-4 md:w-custom-85 text-gray-800 lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-gray-300 rounded-md focus:outline-none "
                  }
                  type="tel"
                  minLength={16}
                  id="rec-account-number"
                  name="rec-account-number"
                  placeholder="Account Number"
                  value={toAccountNumber}
                  onChange={handleAccNumToSend}
                />
                {String(toAccountNumber).length < 16 && toAccountNumber ? (
                  <>
                    <p className="text-left absolute text-xs text-red-600 mt-mt-8 md:ml-5  lg:ml-5 mb-2">
                      Account number should have 16 digits
                    </p>
                  </>
                ) : null}
                {!toAccountNumber && allInput ? (
                  <>
                    <p className="text-left absolute text-xs text-red-600 mt-mt-8 md:ml-5  lg:ml-5 mb-2">
                      Enter account number
                    </p>
                  </>
                ) : null}
                <label className="block  text-sm  md:ml-5  pointer-events-none leading-6 text-gray-800">
                  IFSC code
                </label>
                <input
                  className={
                    allInput && !toIFSCNumber
                      ? "block relative w-full sm:11/12 sm:mb-4 md:w-custom-85 text-gray-800  lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-red-800 rounded-md focus:outline-none "
                      : toIFSCNumber.length < 10 && toIFSCNumber
                      ? "block relative w-full sm:11/12 sm:mb-4 md:w-custom-85 text-gray-800  lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-red-800 rounded-md focus:outline-none "
                      : "block relative w-full sm:11/12 sm:mb-4 md:w-custom-85 text-gray-800  lg:w-custom-90 m-auto  px-4 py-2 mb-4  border border-gray-300 rounded-md focus:outline-none "
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
                  <>
                    <p className="text-left absolute text-xs text-red-600  mt-mt-8 md:ml-5  lg:ml-5 mb-2">
                      Enter IFSC
                    </p>
                  </>
                ) : null}
                {String(toIFSCNumber).length < 10 && toIFSCNumber ? (
                  <p className="text-left absolute text-xs text-red-600 mt-mt-8 md:ml-5  lg:ml-5 mb-2">
                    IFSC code should have 10 digits
                  </p>
                ) : null}
                <label className="block  text-sm  md:ml-5   pointer-events-none leading-6 text-gray-800">
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  className={
                    !amount && allInput
                      ? " block relative w-full  sm:mb-0  md:w-custom-85  lg:w-custom-90 m-auto text-gray-800 px-4 py-2 bottom  border border-red-800 rounded-md focus:outline-none "
                      : " block relative w-full  sm:mb-0  md:w-custom-85  lg:w-custom-90 m-auto text-gray-800 px-4 py-2 bottom  border border-gray-300 rounded-md focus:outline-none "
                  }
                  value={amount}
                  onChange={(e) => handleAmountToSend(e)}
                  placeholder="Amount"
                />
                {!amount && allInput ? (
                  <>
                    <p className="text-left absolute text-xs text-red-600   md:ml-5  lg:ml-5 mb-2">
                      Enter Amount
                    </p>
                  </>
                ) : null}
              </div>
              <div className="w-full pt-8 sm:pt-16  min-h-10 box-border">
                <input
                  type="submit"
                  value="SEND"
                  className={
                    sendByBeneficiaries
                      ? "block w-full sm:w-11/12 md:w-4/5 lg:w-custom-90   px-4 py-2 m-auto mb-3 border-2  border-white rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                      : "block w-full sm:w-11/12 md:w-4/5 lg:w-custom-90   px-4 py-2 m-auto mb-3 top-2 border-2  border-white rounded-lg focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
                    className="block w-full sm:w-11/12 md:w-4/5 lg:w-custom-90 m-auto  px-4 py-2  mt-3  border border-gray-300 rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
