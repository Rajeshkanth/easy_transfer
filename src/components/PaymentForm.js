import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import { IoWarningOutline } from "react-icons/io5";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { RiMenuFoldFill } from "react-icons/ri";
import Menu from "./Menu";
import SideBar from "./SideBar";

function PaymentForm() {
  const {
    currentDate,
    setCurrentDate,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
    userNameFromDb,
    setUserNameFromDb,
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
    enterAccountHolderName,
    enterAccountNumber,
    enterToIfscNumber,
    enterAmount,
    setSavedAcc,
    balance,
    setBalance,
    recentTransactions,
    setRecentTransactions,
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();
  const [allInput, setAllInput] = useState(false);
  const [sessionTiemedOut, setSessionTiemedOut] = useState(false);

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Profile":
        navigate("/Profile ", { state: { prevPath: location.pathname } });
        break;
      case "Back":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries", { state: { prevPath: location.pathname } });
        break;
      case "Rewards":
        console.log("Navigating to Rewards page");
        break;
      case "Contact":
        console.log("Navigating to Contact page");
        break;
      case "Transactions":
        console.log("Navigating to Transactions page");
        break;
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Log out":
        setSavedAcc([]);
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
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
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

  const sendAmountBySocket = (e) => {
    e.preventDefault();
    if (amount && toAccountNumber && toAccountHolderName && toIFSCNumber) {
      const newReceiver = {
        Amount: amount,
        AccNum: toAccountNumber,
        AccHolder: toAccountHolderName,
        Ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "socket",
      };
      setBalance((prev) => prev - amount);
      const newTransactions = {
        Amount: amount,
        Date: currentDate,
        Description: `Sent to ${toAccountHolderName}`,
        Status: `Pending`,
        Name: toAccountHolderName,
        Uid: uuid(),
      };
      console.log(newTransactions);
      setRecentTransactions((prev) => [...prev, newTransactions]);
      socket.emit("paymentPageConnected", {
        num: document.cookie,
        connected: true,
        NewReceiver: newReceiver,
        NewTransactions: newTransactions,
        Uid: uuid(),
      });
      setAllInput(false);
      setEnterAccountHolderName(false);
      setEnterAccountNumber(false);
      setEnterAmount(false);
      setEnterToIfscNumber(false);
      handleAllInput();
      navigate("/success");
    } else {
      setAllInput(true);
    }
  };

  const sendAmountByPolling = async (e) => {
    try {
      e.preventDefault();
      if (amount && toAccountNumber && toAccountHolderName && toIFSCNumber) {
        const newReceiver = {
          Amount: amount,
          AccNum: toAccountNumber,
          AccHolder: toAccountHolderName,
          Ifsc: toIFSCNumber,
          tabId: sessionStorage.getItem("tabId"),
          type: "polling",
        };
        console.log("hello");
        navigate("/success");
        handleAllInput();
        const response = await axios.post(
          "https://polling-server.onrender.com/fromPaymentAlert",
          // `http://localhost:8080/fromPaymentAlert`,
          {
            data: newReceiver,
          }
        );
        setAllInput(false);
      } else {
        setAllInput(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAllInput = () => {
    setAmount("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };
  const navigateToProfile = () => {
    navigate("/profile");
  };

  const savedAccounts = () => {
    navigate("/Beneficiaries");
  };

  const getMenuProps = () => {
    if (windowWidth > 1024) {
      return {
        nav: [
          "Profile",
          "Beneficiaries",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          "Profile",
          "Beneficiaries",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: ["Profile", "Beneficiaries", "Menu"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    if (windowWidth > 640) {
      return {
        nav: ["Rewards", "Contact", "Transactions", "Log out"],
      };
    } else {
      return {
        nav: [
          "Profile",
          "Beneficiaries",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
      };
    }
  };

  const sideBarProps = getSideBarProps();

  const cancelTransfer = () => {
    setSendByBeneficiaries(false);
    handleAllInput("");
    setAllInput(false);
    navigate("/Beneficiaries");
  };

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
          } else {
            setUserNameFromDb("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      socket.emit("checkUserName", {
        regNumber: document.cookie,
      });
      socket.on("userNameAvailable", async (data) => {
        await setUserNameFromDb(data.user);
      });
      socket.on("userNotFound", async () => {
        await setUserNameFromDb("");
      });
    }
  }, [userNameFromDb, connectionMode, socket]);

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
            setAgeFromDb(response.data.age);
            setAgeFromDb(response.data.age);
            setDobFromDb(response.data.dob);
            setAccFromDb(response.data.accNum);
          } else {
            setUserNameFromDb("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      socket.emit("checkUserName", {
        regNumber: document.cookie,
      });
      socket.on("userNameAvailable", (data) => {
        setUserNameFromDb(data.user);
        setAgeFromDb(data.age);
        setDobFromDb(data.dob);
        setAccFromDb(data.accNum);
        // setCard(data.card);
        // setCvv()
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
        setAgeFromDb("");
      });
      // socket.on("transactionDetails", (data) => {
      //   const { lastTransaction } = data;
      //   setRecentTransactions((prev) => [...prev, lastTransaction]);
      // });
    }
  }, [socket, connectionMode, setUserNameFromDb]);

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
    return () => {
      handleAllInput();
      if (connectionMode === "socket") {
        socket.off();
      }
    };
  }, []);

  return (
    <>
      <div className="paymentFormContainer h-screen   bg-gray-800 text-white font-sans fixed w-screen ">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        <div className="flex   w-full fixed top-[10%]  justify-center   ">
          <div className="w-[100vw]  flex  justify-evenly h-[90vh]  ">
            <div className="hidden sm:block sm:w-1/2 md:w-auto">
              {" "}
              <h1 className="text-4xl font-sans  font-light mt-[12rem] ml-[1rem]   lg:text-6xl ">
                The Secure, <br /> easiest and fastest <br /> way to transfer
                money.{" "}
              </h1>
              <p className="ml-[1rem] mt-[4rem] text-xs md:text-sm text-gray-300 lg:text-xl">
                send & receive money in minutes without paying extra charges.
              </p>
            </div>

            <form className="w-[80%] sm:w-5/12  h-[80vh] sm:h-[90%] md:w-2/5  lg:w-[40%] xl:w-1/3 relative pt-[2rem]  px-10 py-10  box-border  z-20 bg-white border-2 border-cyan-200  space-y-3 sm:space-y-0 rounded-md  mt-[2rem]   flex flex-col justify-center ">
              <div className=" h-auto sm:h-1/6 pt-[1rem]  text-gray-800   w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className="  mt-2 sm:mt-4 md:mt-6 lg:mt-[1.8vh] sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-gray-600 text-[27px]">
                  Money Transfer
                </h1>
              </div>
              <div className="md:ml-[3vw] lg:ml-[3.5vw] pt-[1rem] box-border  w-full">
                <label className="block text-sm mb-[.2rem] px-1 pointer-events-none leading-6 text-gray-800">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  className={
                    !toAccountHolderName
                      ? "block w-[100%] sm-11/12 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 border mb-3 border-red-800  rounded-md focus:outline-none focus:border-gray-800"
                      : "block w-[100%] sm-11/12 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 border mb-3 border-gray-300  rounded-md focus:outline-none focus:border-gray-800"
                  }
                  name="receiver-account-holder"
                  placeholder="Account Holder's Name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />

                <label
                  // className="relative  top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-800"
                  className="block px-1 text-sm mb-[.2rem] pointer-events-none leading-6 text-gray-800"
                >
                  Account Number
                </label>
                <input
                  className={
                    !toAccountNumber
                      ? "block  w-[100%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 mb-3  border border-red-800 rounded-md focus:outline-none focus:border-gray-800"
                      : "block  w-[100%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  }
                  type="tel"
                  id="rec-account-number"
                  name="rec-account-number"
                  placeholder="Account Number"
                  value={toAccountNumber}
                  onChange={(e) => {
                    handleAccNumToSend(e);
                  }}
                />

                <label
                  // className="relative w-25 top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-800"
                  className="block text-sm mb-[.2rem] px-1 pointer-events-none leading-6 text-gray-800"
                >
                  IFSC code
                </label>
                <input
                  className={
                    !toIFSCNumber
                      ? "block  w-[100%] sm:11/12 sm:mb-[1rem] md:w-4/5 text-gray-800  lg:w-9/12  px-4 py-2 mb-3  border border-red-800 rounded-md focus:outline-none focus:border-gray-800"
                      : "block  w-[100%] sm:11/12 sm:mb-[1rem] md:w-4/5 text-gray-800  lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  }
                  type="text"
                  id="rec-ifsc-number"
                  name="rec-ifsc-number"
                  placeholder="IFSC Code"
                  value={toIFSCNumber}
                  onChange={(e) => {
                    handleToIfsc(e);
                  }}
                />

                <label
                  //  className="relative w-20 top-3 left-2 transition-all bg-black px-1 box-border pointer-events-none text-gray-800"
                  className="block text-sm mb-[.2rem] px-1 pointer-events-none leading-6 text-gray-800"
                >
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  className={
                    !amount
                      ? " block  w-[100%]  sm:mb-[0rem]  md:w-4/5  lg:w-9/12 text-gray-800 px-4 py-2 mb-4  border border-red-800 rounded-md focus:outline-none focus:border-gray-800"
                      : " block  w-[100%]  sm:mb-[0rem]  md:w-4/5  lg:w-9/12 text-gray-800 px-4 py-2 mb-4  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  }
                  value={amount}
                  onChange={(e) => handleAmountToSend(e)}
                  placeholder="Amount"
                />

                {allInput ? (
                  <p className="text-left text-sm text-red-600 mt-[.4rem]">
                    *fill all input values
                  </p>
                ) : null}
              </div>
              <div className="w-full pt-0 sm:pt-6 box-border">
                <input
                  type="submit"
                  value="SEND"
                  className={
                    sendByBeneficiaries
                      ? "block w-full sm:w-11/12 md:w-4/5 lg:w-9/12  px-4 py-2 m-auto mb-3 border-2  border-white rounded-md focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                      : "block w-full sm:w-11/12 md:w-4/5 lg:w-9/12  px-4 py-2 m-auto mb-3 mt-2 border-2  border-white rounded-lg focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
                    className="block w-full sm:w-11/12 md:w-4/5 lg:w-9/12  px-4 py-2 m-auto mt-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
