import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router";

function PaymentAlert() {
  const { socket, confirmReceiver, setConfirmReceiver } = useContext(store);
  const [isConfirm, setIsConfirm] = useState(false);
  const navigate = useNavigate();
  const confrimPay = () => {
    if (confirmReceiver.AccNum && confirmReceiver.AccHolder) {
      setIsConfirm(true);
    }
  };

  useEffect(() => {
    socket.on("paymentConfirmAlert", (data) => {
      if (data.alert) {
        setConfirmReceiver(data.alert);
      }
    });
  }, []);
  useEffect(() => {
    socket.emit("confirmPayment", { pay: true });
    socket.on("paymentSuccess", () => {
      navigate("/success");
    });
  }, [isConfirm]);

  return (
    <>
      <div className="alert">
        <div>
          <MdVerified />
        </div>
        <div>
          <input
            type="number"
            id="rec-account-number"
            name="rec-account-number"
            placeholder="Account Number"
            value={confirmReceiver.AccNum}
            readOnly
          />
        </div>

        <div className="input-cont">
          <input
            type="text"
            id="receiver-name"
            name="receiver-account-holder"
            placeholder="Account holder name"
            value={confirmReceiver.AccHolder}
            readOnly
          />
          <input type="button" value="Confirm" onClick={confrimPay} />
        </div>
      </div>
    </>
  );
}

export default PaymentAlert;
