import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import { FaRupeeSign } from "react-icons/fa";
import axios from "axios";

import { store } from "../App";

function PaymentForm() {
  const {
    amount,
    setAmount,
    toAccountNumber,
    setToAccountNumber,
    toConfirmAccountNumber,
    setToConfirmAccountNumber,
    toIFSCNumber,
    setToIFSCNumber,
    toAccountHolderName,
    setToAccountHolderName,
    socket,
  } = useContext(store);

  const receiverDomain = "https://rajeshkanth.github.io/payment-app";

  const navigate = useNavigate();
  const [allInput, setAllInput] = useState(false);
  let dataToSend;

  const sendAmount = (e) => {
    e.preventDefault();
    if (
      amount &&
      toAccountNumber &&
      toConfirmAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      const newReceiver = {
        Amount: amount,
        AccNum: toAccountNumber,
        AccHolder: toAccountHolderName,
        tabId: sessionStorage.getItem("tabId"),
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
      // Handle incomplete form
    }
    // Resetting form values
    setAmount("");
    setToConfirmAccountNumber("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };
  const sendAmountUsingPostMessage = () => {
    if (
      amount &&
      toAccountNumber &&
      toConfirmAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      const dataToSend = {
        Amount: amount,
        AccNum: toAccountNumber,
        AccHolder: toAccountHolderName,
      };

      // Open a new window and post the data
      const receiverWindow = window.open(receiverDomain);
      receiverWindow.postMessage(dataToSend, receiverDomain);
      setAllInput(false);
    } else {
      setAllInput(true);
    }
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin === receiverDomain) {
        console.log("Received message from payment confirm app:", event.data);
        // Handle the response received from the other domain
        // This could be used to process a response from the other page
      }
    });
  }, []);
  return (
    <>
      <div className="paymentFormContainer">
        <div className="container">
          <div className="left-box">
            <h1>Easy Transfer</h1>
          </div>
          <div className="right-box">
            <form className="from" onSubmit={sendAmount}>
              <h1>Enter recepient details</h1>

              <div className="input-cont">
                <label htmlFor="rec-account-number">Enter account number</label>
                <input
                  type="number"
                  id="rec-account-number"
                  name="rec-account-number"
                  placeholder="account number"
                  value={toAccountNumber}
                  onChange={(e) => {
                    setToAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <label htmlFor="rec-confirm-number">
                  Confirm Account number
                </label>
                <input
                  type="number"
                  id="rec-confirm-number"
                  name="rec-confirm-number"
                  placeholder="confirm account number"
                  value={toConfirmAccountNumber}
                  onChange={(e) => {
                    setToConfirmAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <label htmlFor="rec-ifsc-number">Enter IFSC code</label>
                <input
                  type="text"
                  id="rec-ifsc-number"
                  name="rec-ifsc-number"
                  placeholder="IFSC code"
                  value={toIFSCNumber}
                  onChange={(e) => {
                    setToIFSCNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <label htmlFor="receiver-account-holder">
                  Enter Account holder's name
                </label>
                <input
                  type="text"
                  id="receiver-name"
                  name="receiver-account-holder"
                  placeholder="account holder's name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <label className="label"> Amount </label>
                <input
                  type="tel"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  className="amount-input"
                  placeholder="0"
                />
              </div>
              {allInput ? <p>fill all input values</p> : null}
              <div className="input-cont">
                <input type="submit" value="SEND" id="pay" />
              </div>
              <div>
                <input
                  type="button"
                  value="post"
                  onClick={sendAmountUsingPostMessage}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PaymentForm);
