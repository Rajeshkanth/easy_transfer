import React from "react";
import { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";

function ReceiverAccountForm() {
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
      socket.on("userNameAvailable", (data) => {
        setUserNameFromDb(data.user);
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
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
      <form className=" sm:w-5/12  sm:h-[90%] md:w-2/5  lg:w-1/3 relative  px-10 py-10 box-border h-5/6 z-20 bg-white border-2 border-cyan-200   rounded-md  mt-[2rem]   flex flex-col justify-center ">
        {/* <h1>Enter recepient details</h1> */}
        <div className=" bg-white h-1/6 text-slate-500 m-auto mt-4  mb-3 w-full text-center flex justify-center  rounded-md rounded-b-none  ">
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
            className="block px-1 pointer-events-none leading-6 text-gray-600"
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
            className=" block  w-[95%] sm:10/12 md:w-4/5  lg:w-9/12  px-4 py-2 mb-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="Amount"
          />

          {allInput ? (
            <p className="text-left mb-2">*fill all input values</p>
          ) : null}
        </div>

        <input
          type="submit"
          value="SAVE"
          className="block w-1/2  px-4 py-2 m-auto mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
          onClick={
            connectionMode === "socket"
              ? sendAmountBySocket
              : sendAmountByPolling
          }
        />
      </form>
    </>
  );
}

export default memo(ReceiverAccountForm);
