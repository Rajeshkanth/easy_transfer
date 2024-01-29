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

function PaymentForm() {
  const {
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
        nav: ["Profile", "Beneficiaries", "Menu"],
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
            <form className=" sm:w-5/12  sm:h-[90%] md:w-2/5  lg:w-1/3 relative  px-10 py-10 box-border h-5/6 z-20 bg-white border-2 border-cyan-200   rounded-md  mt-[2rem]   flex flex-col justify-center ">
              {/* <h1>Enter recepient details</h1> */}
              <div className=" bg-white h-1/6 text-slate-500 m-auto mt-1  mb-6 w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className=" my-auto  text-4xl font-extrabold text-gray-800 text-[34px]">
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
                  className="block w-[95%] sm-w-11/12 mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 border mb-3 border-gray-300  rounded-md focus:outline-none focus:border-gray-800"
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
                  className="block  w-[95%] sm:11/2 mb-[1rem] md:w-4/5 text-gray-800 lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
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
                  className="block  w-[95%] sm:11/12 mb-[1rem] md:w-4/5 text-gray-800  lg:w-9/12  px-4 py-2 mb-3  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
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
                  className=" block  w-[95%] sm:10/12 mb-[1rem] md:w-4/5  lg:w-9/12 text-gray-800 px-4 py-2 mb-8  border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  value={amount}
                  onChange={(e) => handleAmountToSend(e)}
                  placeholder="Amount"
                />

                {allInput ? (
                  <p className="text-left text-sm text-gray-800 mb-2">
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
                  className="block w-1/2  px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                />
              ) : null}
            </form>
          </div>
        </div>
      </div>

      {windowWidth > 1024 ? null : isProfileClicked ? (
        <>
          <div
            className="w-1/2 sm:w-1/2 md:w-[33%] lg:w-1/4 bg-gray-800 backdrop-blur-xl h-screen font-sans fixed text-black"
            // className={
            // windowWidth < 780
            // ? "w-1/2 h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
            // : " sm:w-[33vw]  h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
            // }
          >
            <div className=" pt-2 pb-8 border-box h-[85vh] font-sans">
              <div className="flex justify-between items-center border-b-2 border-gray-600  text-white box-border pb-[.8rem] cursor-pointer ">
                <h1 className="ml-[2rem] text-xl font-bold ">Menu</h1>
                <p className=" mr-[1rem]  " onClick={closeProfile}>
                  <RiMenuFoldFill />
                </p>
              </div>
              <div className="space-y-2 flex text-white w-[80%] justify-center pl-6 flex-col items-left  pt-5 border-box text-lg    cursor-pointer ">
                <h1
                  className="hover:font-bold hover:border-2   rounded px-4 box-border rounded- px-4 box-border py-1"
                  onClick={navigateToProfile}
                >
                  Profile
                </h1>
                <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2  py-1">
                  Rewards
                </h1>
                <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2 py-1">
                  Contact us
                </h1>
                <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2 py-1">
                  Transactions
                </h1>
                <h1
                  className="hover:font-bold hover:border-2   rounded px-4 box-border  px-4 box-border py-1"
                  onClick={savedAccounts}
                >
                  Beneficiaries
                </h1>
                <h1
                  className="hover:font-bold hover:border-2   rounded px-4 box-border  px-4 box-border py-1"
                  onClick={logout}
                >
                  Log out
                </h1>
              </div>
            </div>

            {/* <div className=" h-[8vh] sm:h-[15vh] flex items-center">
              <button
                className={
                  "block w-1/2  px-4 py-2 m-auto ml-[10vw] mb-5 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 bg-white text-black hover:bg-gray-600 hover:cursor-pointer"
                  // windowWidth < 780
                  //   ? "bg-green-500  rounded-full p-2 pl-8 pr-8 border-box text-black z-[10] left-[19vw] sm:left-[25vw] mt-[1vh]   font-light fixed  sm:w-1/8 hover:bg-blue-500 hover:border"
                  //   : "bg-green-500  rounded-full p-2 pl-8 pr-8 text-black z-[10]  left-[18vw] mt-[0vh] font-light fixed  w-1/8 hover:bg-blue-500 hover:border"
                }
                onClick={logout}
              >
                Log out
              </button>
            </div> */}
          </div>
        </>
      ) : null}
    </>
  );
}

export default memo(PaymentForm);
