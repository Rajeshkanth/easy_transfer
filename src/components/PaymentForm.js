import React, { memo, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

import { store } from "../App";

function PaymentForm() {
  const {
    amount,
    setAmount,
    fromAccountNumber,
    setFromAccountNumber,
    fromConfirmAccountNumber,
    setFromConfirmAccountNumber,
    fromIFSCNumber,
    setFromIFSCNumber,
    fromAccountHolderName,
    setFromAccountHolderName,
    toAccountNumber,
    setToAccountNumber,
    toConfirmAccountNumber,
    setToConfirmAccountNumber,
    toIFSCNumber,
    setToIFSCNumber,
    toAccountHolderName,
    setToAccountHolderName,
    receiverAccounts,
    setReceiverAccounts,
    socket,
  } = useContext(store);

  const navigate = useNavigate();

  const newReceiver = {
    Amount: amount,
    AccNum: toAccountNumber,
    AccHolder: toAccountHolderName,
  };
  const sendAmount = (e) => {
    e.preventDefault();
    if (
      amount &&
      fromAccountNumber &&
      fromConfirmAccountNumber &&
      fromAccountHolderName &&
      fromIFSCNumber &&
      toAccountNumber &&
      toConfirmAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      setReceiverAccounts((prev) => [...prev, newReceiver]);
    }
  };

  useEffect(() => {
    socket.emit("patmentPageConnected", { connected: true });
  }, []);
  useEffect(() => {
    console.log(receiverAccounts);
    socket.emit("sendReceiverDetails", { NewReceiver: newReceiver });
    socket.on("paymentSuccess", () => {
      navigate("/success");
    });
  }, [receiverAccounts]);
  return (
    <>
      <div className="paymentFormContainer">
        <div className="container">
          <div className="left-box">
            <div className="amount">
              <input
                type="tel"
                name="amount"
                id="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                className="input"
                placeholder="0"
              />
              <label htmlFor="amount" className="label">
                {" "}
                Amount to pay
              </label>
            </div>
          </div>
          <div className="right-box">
            <h1 className="title">Beneficiary Details</h1>
            <form className="from" onSubmit={sendAmount}>
              <h1>From</h1>
              <div className="input-cont">
                <input
                  type="number"
                  id="account-number"
                  name="account-number"
                  placeholder="Account Number"
                  value={fromAccountNumber}
                  onChange={(e) => {
                    setFromAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="number"
                  id="confirm-acc-number"
                  name="confirm-number"
                  placeholder="Confirm Account Number"
                  value={fromConfirmAccountNumber}
                  onChange={(e) => {
                    setFromConfirmAccountNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="text"
                  id="ifsc-number"
                  name="ifsc-number"
                  placeholder="IFSC Number"
                  value={fromIFSCNumber}
                  onChange={(e) => {
                    setFromIFSCNumber(e.target.value);
                  }}
                />
              </div>
              <div className="input-cont">
                <input
                  type="text"
                  id="acc-name"
                  name="account-holder"
                  placeholder="Account holder name"
                  value={fromAccountHolderName}
                  onChange={(e) => {
                    setFromAccountHolderName(e.target.value);
                  }}
                />
              </div>
              {/* </form> */}
              <br />
              <br />
              {/* <form action="" className="to"> */}
              <h1>To</h1>
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
