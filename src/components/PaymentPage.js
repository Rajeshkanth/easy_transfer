import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import Menu from "./utils/Menu";
import SideBar from "./utils/SideBar";
import { TextGenerateEffect } from "./utils/TextGenerate";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import PaymentForm from "../components/forms/PaymentForm";

function PaymentPage() {
  const {
    clearSession,
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
  const [allInput, setAllInput] = useState(false);
  const nav = [
    "Beneficiaries",
    "Profile",
    "Transactions",
    "Rewards",
    "Contact",
    "Log Out",
  ];

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Profile":
        navigate("/profile ", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Back":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/beneficiaries", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Transactions":
        navigate("/transactions");
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
    clearSession();
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
        amount: amount,
        accNum: toAccountNumber,
        accHolder: toAccountHolderName,
        ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "socket",
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      };

      const newTransactions = {
        amount: amount,
        date: currentDate,
        description: `Sent to ${toAccountHolderName}`,
        status: "pending",
        name: toAccountHolderName,
        uid: uuid(),
      };

      socket.emit("paymentPage", {
        mobileNumber: sessionStorage.getItem("mobileNumber"),
        connected: true,
        newReceiver: newReceiver,
        newTransactions: newTransactions,
        uid: uuid(),
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
      setSendByBeneficiaries(false);
      setInitatedAmountSend(true);
      const newReceiver = {
        amount: amount,
        accNum: toAccountNumber,
        accHolder: toAccountHolderName,
        ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "polling",
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      };

      const newTransactions = {
        amount: amount,
        date: currentDate,
        description: `Sent to ${toAccountHolderName}`,
        status: `pending`,
        name: toAccountHolderName,
        uid: uuid(),
      };

      navigate("/success");
      handleAllInput();

      const response = await axios.post(
        "http://localhost:8080/api/transaction/fromPaymentAlert",
        {
          data: newReceiver,
          newTransaction: newTransactions,
          mobileNumber: sessionStorage.getItem("mobileNumber"),
        }
      );
      if (response.status === 200) {
        setAllInput(false);
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
    navigate("/beneficiaries");
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
            <PaymentForm
              data={{
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
              }}
            />
          </div>
        </div>
      </div>
      {windowWidth > 768 ? null : isProfileClicked ? (
        <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
      ) : null}
    </>
  );
}

export default memo(PaymentPage);
