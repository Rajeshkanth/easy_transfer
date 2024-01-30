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
    setSavedAcc,
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
      socket.emit("paymentPageConnected", {
        connected: true,
        NewReceiver: newReceiver,
        Uid: uuid(),
      });
      setAllInput(false);
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

  return (
    <>
      <div className="paymentFormContainer h-screen w-screen  bg-gray-800 text-white font-sans fixed w-screen ">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        <div className="flex  w-full fixed top-[10%]  flex justify-center   ">
          <div className="w-[100vw]  flex justify-evenly h-[90vh]  ">
            <div className="hidden sm:block sm:w-1/2 md:w-auto">
              {" "}
              <h1 className="text-4xl font-sans  font-light mt-[11rem] ml-[1rem]   lg:text-6xl ">
                The Secure, <br /> easiest and fastest <br /> way to transfer
                money.{" "}
              </h1>
              <p className="ml-[1rem] mt-[4rem] text-xs md:text-sm lg:text-xl">
                send & receive money in minutes without paying extra charges.
              </p>
            </div>
            <form className="w-[60%] sm:w-5/12  h-[80vh] sm:h-[90%] md:w-2/5  lg:w-1/3 relative pt-0  px-10 py-10  box-border  z-20 bg-white border-2 border-cyan-200  space-y-2 sm:space-y-0 rounded-md  mt-[2rem]   flex flex-col justify-center ">
              <div className=" h-auto sm:h-1/6  mb-2 text-gray-800   w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className="  mt-2 sm:mt-4 md:mt-6 lg:mt-8 sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-gray-800 text-[23px]">
                  Money Transfer
                </h1>
              </div>
              <div className="md:ml-8  lg:ml-12 w-full">
                <label className="block   px-1 pointer-events-none leading-6 text-gray-800">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  className="block w-[95%] sm-w-11/12 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 border mb-3 border-gray-300  rounded-md focus:outline-none focus:border-gray-800"
                  name="receiver-account-holder"
                  placeholder="Account Holder's Name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />

                <label
                  // className="relative  top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-800"
                  className="block px-1 pointer-events-none leading-6 text-gray-800"
                >
                  Account Number
                </label>
                <input
                  className="block  w-[95%] sm:11/2 sm:mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
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
                  className="block   px-1 pointer-events-none leading-6 text-gray-800"
                >
                  IFSC code
                </label>
                <input
                  className="block  w-[95%] sm:11/12 sm:mb-[1rem] md:w-4/5 text-gray-800  lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
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
                  className="block   px-1 pointer-events-none leading-6 text-gray-800"
                >
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  className=" block  w-[95%] sm:10/12 sm:mb-[2rem]  md:w-4/5  lg:w-9/12 text-gray-800 px-4 py-2 mb-4  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  value={amount}
                  onChange={(e) => handleAmountToSend(e)}
                  placeholder="Amount"
                />

                {allInput ? (
                  <p className="text-left text-sm text-red-600 mb-[1rem]">
                    *fill all input values
                  </p>
                ) : null}
              </div>

              <input
                type="submit"
                value="SEND"
                className="block w-1/2  px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
                  className="block w-1/2  px-4 py-2 m-auto mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                />
              ) : null}
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
