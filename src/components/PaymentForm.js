import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import { IoWarningOutline } from "react-icons/io5";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { RiMenuFoldFill } from "react-icons/ri";

function PaymentForm() {
  const {
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
    loggedUser,
    setLoggedUser,
    registeredUsers,
    mobileNumber,
    key,
    setKey,
  } = useContext(store);

  const navigate = useNavigate();
  const [allInput, setAllInput] = useState(false);
  const [sessionTiemedOut, setSessionTiemedOut] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);

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
      navigate("/success");
    } else {
      setAllInput(true);
    }
    handleAllInput();
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
      handleAllInput();
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

  const profile = () => {
    setIsProfileClicked(true);
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };
  const navigateToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    console.log(loggedUser);
    console.log(mobileNumber);
    // if (JSON.parse(sessionStorage.getItem(document.cookie)).UserName) {
    //   setLoggedUser(
    //     JSON.parse(sessionStorage.getItem(document.cookie)).UserName
    // );
    // }

    // if () {
    //   setSessionTiemedOut(true);
    // } else {
    //   setSessionTiemedOut(false);
    // }
  }, []);

  return (
    <>
      <div className="paymentFormContainer h-screen w-screen bg-slate-50  fixed w-screen bg-blue-500">
        <div className="h-[10%] w-full fixed  top-0 flex text-center items-center pt-4 box-border align-center  bg-gradient-to-r  from-cyan-500 to-blue-500 p-1px ">
          <h1 className="text-4xl italic font-extrabold text-white ml-[2rem] sm:ml-[4rem] lg:ml-[16rem] pointer-events-none text-center">
            Easy Transfer
          </h1>

          {sessionTiemedOut ? null : (
            <div className="p-2 pl-8 pr-8 text-white font-bold   border-box absolute border-r-2   w-1/8 flex items-center space-x-2">
              <AiOutlineMenuUnfold
                onClick={profile}
                className="text-3xl text-black"
              />
              <button className=" text-xl text-black">
                {JSON.parse(sessionStorage.getItem(document.cookie)).UserName
                  ? JSON.parse(sessionStorage.getItem(document.cookie)).UserName
                  : document.cookie}
              </button>
            </div>
          )}
        </div>
        <div className="flex  w-full fixed top-[10%]  flex justify-center  bg-gradient-to-r from-cyan-500 to-blue-500 ">
          <div className="w-[100vw]  flex justify-evenly h-[90vh]  ">
            <div className="hidden sm:block sm:w-1/2 md:w-auto">
              {" "}
              <h1 className="text-4xl font-sans text-white font-light mt-[11rem] ml-[1rem]   lg:text-6xl ">
                The Secure, <br /> easiest and fastest <br /> way to transfer
                money.{" "}
              </h1>
              <p className="ml-[1rem] mt-[4rem] text-xs md:text-sm lg:text-xl">
                send & receive money in minutes without paying extra charges.
              </p>
            </div>
            <form className=" sm:w-5/12  sm:h-[90%] md:w-2/5  lg:w-1/3 relative  px-10 py-10 box-border h-5/6 z-20 bg-white border-2 border-cyan-200   rounded-md  mt-[2rem]   flex flex-col justify-center ">
              {/* <h1>Enter recepient details</h1> */}
              <div className=" bg-white h-1/6 text-slate-500 m-auto mt-4  mb-6 w-full text-center flex justify-center  rounded-md rounded-b-none  ">
                <h1 className=" my-auto  text-4xl font-extrabold text-gray-600 text-[34px]">
                  Money Transfer
                </h1>
              </div>
              <div className="md:ml-8  lg:ml-12 w-full">
                <label className="block   px-1 pointer-events-none leading-6 text-gray-600">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  className="block w-[95%] sm-w-11/12 md:w-4/5  lg:w-9/12  px-4 py-2 border mb-3 border-gray-300 bg-slate-100 rounded-md focus:outline-none focus:border-blue-500"
                  name="receiver-account-holder"
                  placeholder="Account Holder's Name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />

                <label
                  // className="relative  top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-600"
                  className="block   px-1 pointer-events-none leading-6 text-gray-600"
                >
                  Account Number
                </label>
                <input
                  className="block  w-[95%] sm:11/2 md:w-4/5  lg:w-9/12  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  type="number"
                  id="rec-account-number"
                  name="rec-account-number"
                  placeholder="Account Number"
                  value={toAccountNumber}
                  onChange={(e) => {
                    setToAccountNumber(e.target.value);
                  }}
                />

                <label
                  // className="relative w-25 top-3 left-2 transition-all bg-white px-1 pointer-events-none text-gray-600"
                  className="block   px-1 pointer-events-none leading-6 text-gray-600"
                >
                  IFSC code
                </label>
                <input
                  className="block  w-[95%] sm:11/12 md:w-4/5  lg:w-9/12  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  type="text"
                  id="rec-ifsc-number"
                  name="rec-ifsc-number"
                  placeholder="IFSC Code"
                  value={toIFSCNumber}
                  onChange={(e) => {
                    setToIFSCNumber(e.target.value);
                  }}
                />

                <label
                  //  className="relative w-20 top-3 left-2 transition-all bg-black px-1 box-border pointer-events-none text-gray-600"
                  className="block   px-1 pointer-events-none leading-6 text-gray-600"
                >
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  className=" block  w-[95%] sm:10/12 md:w-4/5  lg:w-9/12  px-4 py-2 mb-8 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  placeholder="Amount"
                />

                {allInput ? (
                  <p className="text-left mb-2">*fill all input values</p>
                ) : null}

                {/* <div className="relative top-5  transition-all bg-white  pointer-events-none text-gray-600"> */}

                {/* </div> */}
              </div>
              {/* <input
                type="button"
                value="SEND via Socket"
                id="pay"
                className="block  w-auto px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                onClick={sendAmountBySocket}
              /> */}

              <input
                type="submit"
                value="SEND"
                className="block w-1/2  px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                onClick={
                  connectionMode === "socket"
                    ? sendAmountBySocket
                    : sendAmountByPolling
                }
              />
            </form>
          </div>
        </div>
      </div>

      {sessionTiemedOut ? (
        <>
          <div className=" fixed w-screen h-screen bg-white  text-2xl font-['Open-Sans'] text-red-500 space-y-2 flex flex-col items-center  justify-center">
            <IoWarningOutline className="text-4xl text-red-500" />
            <h1>Session Expired !</h1>
            <h2>
              Please{" "}
              <strong className="underline" onClick={() => navigate("/")}>
                {" "}
                login
              </strong>{" "}
              again to continue
            </h2>
          </div>
        </>
      ) : null}

      {isProfileClicked ? (
        <>
          <div className="w-1/4 h-screen   bg-blue-500  border rounded-2xl rounded-l-none fixed ">
            <div className=" pt-2 pb-8 border-box h-[90vh]">
              <div className="flex justify-between items-center border-b-2 font-sans cursor-pointer ">
                <h1 className="ml-[2rem] text-2xl font-bold text-white">
                  Dashboard
                </h1>
                <p className=" mr-[1rem] text-white " onClick={closeProfile}>
                  <RiMenuFoldFill />
                </p>
              </div>
              <div className="space-y-2 flex  flex-col items-left pl-9 pt-5 border-box text-2xl text-white font-sans  cursor-pointer ">
                <h1
                  className="hover:font-bold hover:border-b-2 "
                  onClick={navigateToProfile}
                >
                  Profile
                </h1>
                <h1 className="hover:font-bold hover:border-b-2">Rewards</h1>
                <h1 className="hover:font-bold hover:border-b-2">Contact us</h1>
                <h1 className="hover:font-bold hover:border-b-2">
                  Transaction history
                </h1>
              </div>
            </div>

            <div className="border-t-2 h-[10vh] flex items-center">
              <button
                className="bg-green-500  rounded-full p-2 pl-8 pr-8 text-white z-[10]  left-[15vw] font-light absolute  w-1/8 hover:bg-blue-500 hover:border"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default memo(PaymentForm);
