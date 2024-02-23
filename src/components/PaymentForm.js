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

function PaymentForm() {
  const {
    setInitatedAmountSend,
    currentDate,
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
    setSavedAcc,
    setRecentTransactions,
    setIsLoggedOut,
    setSavedAccLength,
    handleSocket,
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();

  const [allInput, setAllInput] = useState(false);
  // const clickable = toAccountNumber.length > 15;
  const [accNumAlert, setAccNumAlert] = useState(false);
  const [IFSCAlert, setIFSCAlert] = useState(false);

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
      };

      const newTransactions = {
        Amount: amount,
        Date: currentDate,
        Description: `Sent to ${toAccountHolderName}`,
        Status: `Pending`,
        Name: toAccountHolderName,
        Uid: uuid(),
      };
      console.log(newTransactions);
      // setRecentTransactions((prev) => [...prev, newTransactions]);
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
      setAccNumAlert(false);
      setIFSCAlert(false);
      handleAllInput();
      navigate("/success");
    } else if (
      amount &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber &&
      toAccountNumber.length < 15
    ) {
      setAccNumAlert(true);
      // setAllInput(true);
    } else if (
      amount &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber &&
      toIFSCNumber.length < 8
    ) {
      setIFSCAlert(true);
    } else if (
      !amount &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      setAllInput(true);
    } else {
      setAllInput(true);
      console.log("else part");
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
    console.log("user is idle");

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
        sessionStorage.setItem("userName", data.user ? data.user : "");
        const userName = sessionStorage.getItem("userName");
        await setUserNameFromDb(userName);
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
  }, []);

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
      // if (connectionMode === "socket") {
      //   socket.off();
      // }
    };
  }, []);

  useEffect(() => {
    const length = savedAcc ? savedAcc.length : 0;
    sessionStorage.setItem("length", length);
    setSavedAccLength(sessionStorage.getItem("length"));
  }, [savedAcc]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (connectionMode !== "socket") {
  //     } else {
  //       socket.on("transactionDetailsFromDb", (data) => {
  //         const transaction = {
  //           Date: data.Date,
  //           Name: data.Name,
  //           Status: data.Status,
  //           Amount: data.Amount,
  //         };

  //         const isAlreadyStored = recentTransactions
  //           ? recentTransactions.some((detail) => {
  //               return (
  //                 detail.Date === transaction.Date &&
  //                 detail.Name === transaction.Name &&
  //                 detail.Status === transaction.Status &&
  //                 detail.Amount === transaction.Amount
  //               );
  //             })
  //           : false;
  //         if (!isAlreadyStored) {
  //           // setRecentTransactions((prev) => [...prev, transaction]);

  //           setRecentTransactions((prevTransact) => {
  //             const updatedTransact = prevTransact
  //               ? [...prevTransact, transaction]
  //               : [transaction];
  //             sessionStorage.setItem(
  //               "savedTransactions",
  //               JSON.stringify(updatedTransact)
  //             );
  //             return updatedTransact;
  //           });
  //         }
  //       });
  //       const length = recentTransactions ? recentTransactions.length : 0;
  //       setRecentTransactionsLength(length);
  //     }
  //   };
  //   fetchData();
  // }, [socket]);

  return (
    <>
      <div className=" h-screen   bg-gray-800 text-white font-sans fixed w-screen ">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        <div className="flex   w-full fixed top-[6%] md:top-[10%]  justify-center   ">
          <div className="w-[96vw]  flex  justify-evenly h-[90vh]  ">
            <div className="hidden sm:block sm:w-1/2 md:w-auto xl:w-[58%] xl:pl-[0vw] cursor-default">
              {" "}
              <h1 className="text-4xl font-sans  font-light mt-[12rem] ml-[0rem]  md:text-5xl lg:text-6xl ">
                The Secure, <br /> easiest and fastest <br /> way to transfer
                money.{" "}
              </h1>
              <p className="ml-[0rem] mt-[4rem] text-xs md:text-sm text-gray-300 lg:text-xl">
                send & receive money in minutes without paying extra charges.
              </p>
            </div>

            <form
              className={
                sendByBeneficiaries
                  ? "w-[80%] sm:w-5/12  h-[81vh] sm:h-[90%]  lg:h-[82%] md:w-2/5  lg:w-[40%] xl:w-1/3 relative pt-[0rem]  px-10 py-10  box-border mb-[2vh] md:mb-0  z-20 bg-white border-2 border-cyan-200  space-y-3 sm:space-y-0 rounded-md  mt-[3rem]   flex flex-col justify-center "
                  : "w-[80%] sm:w-5/12  h-[75vh] sm:h-[90%]  lg:h-[82%] md:w-2/5  lg:w-[40%] xl:w-1/3 relative pt-[0rem]  px-10 py-10  box-border mb-[2vh] md:mb-0  z-20 bg-white border-2 border-cyan-200  space-y-3 sm:space-y-0 rounded-md  mt-[3rem]   flex flex-col justify-center "
              }
            >
              <div className=" h-auto sm:h-1/6 pt-[1rem]  text-gray-800   w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className="  mt-2 sm:mt-4 md:mt-3 lg:mt-[1vh] sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-gray-600 text-[27px]">
                  Money Transfer
                </h1>
              </div>
              <div className="md:ml-[0vw] lg:ml-[0vw] min-h-[30%] top-[1rem] box-border  w-full ">
                <label className="block text-sm mb-[.2rem] md:ml-[2.4vw] lg:ml-[1vw] px-1 pointer-events-none leading-6 text-gray-800">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  className={
                    allInput && !toAccountHolderName
                      ? "block w-[100%] sm-11/12 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-[90%] m-auto  px-4 py-2 border mb-3 border-red-800  rounded-md focus:outline-none "
                      : "block w-[100%] sm-11/12 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-[90%] m-auto  px-4 py-2 border mb-3 border-gray-300  rounded-md focus:outline-none "
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
                    <p className="text-left text-xs text-red-600 mt-[-.4rem] md:mt-[-.8rem]  md:ml-[3vw] lg:ml-[1.4vw] mb-[0rem]">
                      Enter Name
                    </p>
                  </>
                ) : null}

                <label
                  // className="relative  top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-800"
                  className="block px-1 text-sm mb-[.2rem] pointer-events-none md:ml-[2.4vw] lg:ml-[1vw] leading-6 text-gray-800"
                >
                  Account Number
                </label>
                <input
                  className={
                    allInput && toAccountNumber.length < 16
                      ? "block  w-[100%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-[90%] m-auto  px-4 py-2 mb-3  border border-red-800 rounded-md focus:outline-none "
                      : toAccountNumber.length < 16 && toAccountNumber
                      ? "block  w-[100%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-[90%] m-auto  px-4 py-2 mb-3  border border-red-800 rounded-md focus:outline-none "
                      : "block  w-[100%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-[90%] m-auto  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none "
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
                    <p className="text-left text-xs text-red-600 mt-[-.6rem] md:mt-[-.8rem] md:ml-[3vw]  lg:ml-[1.4vw] mb-[.2rem]">
                      Account number should have 16 digits
                    </p>
                  </>
                ) : null}
                {!toAccountNumber && allInput ? (
                  <>
                    <p className="text-left text-xs text-red-600 mt-[-.6rem] md:mt-[-.8rem] md:ml-[3vw]  lg:ml-[1.4vw] mb-[.2rem]">
                      Enter Account Number
                    </p>
                  </>
                ) : null}

                <label
                  // className="relative w-25 top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-800"
                  className="block text-sm mb-[.2rem] px-1 pointer-events-none md:ml-[2.4vw] lg:ml-[1vw] leading-6 text-gray-800"
                >
                  IFSC code
                </label>
                <input
                  className={
                    allInput && !toIFSCNumber
                      ? "block  w-[100%] sm:11/12 sm:mb-[1rem] md:w-4/5 text-gray-800  lg:w-[90%] m-auto  px-4 py-2 mb-3  border border-red-800 rounded-md focus:outline-none "
                      : "block  w-[100%] sm:11/12 sm:mb-[1rem] md:w-4/5 text-gray-800  lg:w-[90%] m-auto  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none "
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
                    <p className="text-left text-xs text-red-600 ml-0 sm:ml-0 md:ml-[3vw] lg:ml-[1.4vw] mt-[-.4rem] md:mt-[-.8rem] mb-[0rem]">
                      Enter IFSC
                    </p>
                  </>
                ) : null}
                {String(toIFSCNumber).length < 10 && toIFSCNumber ? (
                  <p className="text-left text-xs text-red-600 mt-[-.6rem] md:mt-[-.8rem] md:ml-[3vw]  lg:ml-[1.4vw] mb-[.2rem]">
                    IFSC code should have 10 digits
                  </p>
                ) : null}

                <label
                  //  className="relative w-20 top-3 left-2 transition-all bg-black px-1 box-border pointer-events-none text-gray-800"
                  className="block text-sm mb-[.2rem] px-1 pointer-events-none md:ml-[2.4vw] lg:ml-[1vw] leading-6 text-gray-800"
                >
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  className={
                    !amount && allInput
                      ? " block  w-[100%]  sm:mb-[0rem]  md:w-4/5  lg:w-[90%] m-auto text-gray-800 px-4 py-2 bottom-2  border border-red-800 rounded-md focus:outline-none "
                      : " block  w-[100%]  sm:mb-[0rem]  md:w-4/5  lg:w-[90%] m-auto text-gray-800 px-4 py-2 bottom-2  border border-gray-300 rounded-md focus:outline-none "
                  }
                  value={amount}
                  onChange={(e) => handleAmountToSend(e)}
                  placeholder="Amount"
                />
                {!amount && allInput ? (
                  <>
                    <p className="text-left text-xs text-red-600 mt-[.2rem] md:mt-[0rem] md:ml-[3vw]  lg:ml-[1.4vw] mb-[.4rem]">
                      Enter Amount
                    </p>
                  </>
                ) : null}
                {/* {allInput ? (
                  <p className="text-left text-sm text-red-600 mt-[.4rem]">
                    Fill all input values
                  </p>
                ) : null} */}
              </div>
              <div className="w-full pt-0 sm:pt-[2rem] mt-[4vh] md:mt-0  min-h-[10%] box-border">
                <input
                  type="submit"
                  value="SEND"
                  className={
                    sendByBeneficiaries
                      ? "block w-full sm:w-11/12 md:w-4/5 lg:w-[90%]   px-4 py-2 m-auto mb-3 border-2  border-white rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                      : "block w-full sm:w-11/12 md:w-4/5 lg:w-[90%]   px-4 py-2 m-auto mb-3 top-2 border-2  border-white rounded-lg focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
                    className="block w-full sm:w-11/12 md:w-4/5 lg:w-[90%] m-auto  px-4 py-2  mt-3  border border-gray-300 rounded-md focus:outline-none  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
