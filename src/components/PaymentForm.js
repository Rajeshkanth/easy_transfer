import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";

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
  } = useContext(store);

  const navigate = useNavigate();
  const [allInput, setAllInput] = useState(false);

  const useSocket = process.env.REACT_APP_SOCKET_API === "true";

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

  return (
    <>
      <div className="paymentFormContainer h-screen w-screen bg-slate-50  fixed w-screen bg-blue-500">
        <div className="h-[10%] w-full fixed top-0 z-10 flex text-center pt-4 box-border align-center  bg-gradient-to-r  from-cyan-500 to-blue-500">
          <h1 className="text-4xl italic font-extrabold text-white ml-[2rem] sm:ml-[4rem] lg:ml-[10rem] text-center">
            Easy Transfer
          </h1>
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
                  className="block w-[95%] sm-w-11/12 md:w-4/5  lg:w-9/12  px-4 py-2 border mb-3 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                  className="block  w-[95%] sm:11/2 md:w-4/5  lg:w-9/12  px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                  className="block  w-[95%] sm:11/12 md:w-4/5  lg:w-9/12  px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                  className=" block  w-[95%] sm:10/12 md:w-4/5  lg:w-9/12  px-4 py-2 mb-8  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
              <input
                type="button"
                value="SEND via Socket"
                id="pay"
                className="block  w-auto px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                onClick={sendAmountBySocket}
              />

              <input
                type="submit"
                value="SEND via Polling"
                className="block w-auto px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                onClick={sendAmountByPolling}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PaymentForm);
