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
    toConfirmAccountNumber,
    setToConfirmAccountNumber,
    toIFSCNumber,
    setToIFSCNumber,
    toAccountHolderName,
    setToAccountHolderName,

    socket,
  } = useContext(store);

  const navigate = useNavigate();

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
      navigate("/success");
    } else {
      // Handle incomplete form
    }
    // Resetting form values
    setAmount("");
    setToConfirmAccountNumber("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };

  // ... (rest of the existing code)

  return (
    <>
      <div className="paymentFormContainer">
        <div className="container">
          <div className="left-box"></div>
          <div className="right-box">
            <h1 className="title">Beneficiary Details</h1>
            <form className="from" onSubmit={sendAmount}>
              <div className="amount-box">
                <h1 className="label"> Amount to pay</h1>
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

              <br />
              <br />

              <h1>Enter recepient details</h1>
              <div className="input-cont">
                <input
                  type="number"
                  id="rec-account-number"
                  name="rec-account-number"
                  placeholder="Account Number"
                  value={toAccountNumber}
                  onChange={(e) => {
                    setToAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="number"
                  id="rec-confirm-number"
                  name="rec-confirm-number"
                  placeholder="Confirm Account Number"
                  value={toConfirmAccountNumber}
                  onChange={(e) => {
                    setToConfirmAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="text"
                  id="rec-ifsc-number"
                  name="rec-ifsc-number"
                  placeholder="IFSC Number"
                  value={toIFSCNumber}
                  onChange={(e) => {
                    setToIFSCNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="text"
                  id="receiver-name"
                  name="receiver-account-holder"
                  placeholder="Account holder name"
                  value={toAccountHolderName}
                  onChange={(e) => {
                    setToAccountHolderName(e.target.value);
                  }}
                />
                <input type="submit" value="SEND" id="pay" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PaymentForm);
