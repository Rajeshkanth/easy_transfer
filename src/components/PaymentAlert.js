import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router";

function PaymentAlert() {
  const { socket, confirmReceiver, setConfirmReceiver } = useContext(store);
  console.log(confirmReceiver);

  //   const last =
  //     confirmReceiver.length > 0
  //       ? confirmReceiver[confirmReceiver.length - 1]
  //       : null;
  //   console.log(last);

  const [isConfirm, setIsConfirm] = useState(false);
  const [value, setValue] = useState(100);
  const navigate = useNavigate();

  const confrimPay = () => {
    if (confirmReceiver.AccNum && confirmReceiver.AccHolder) {
      setIsConfirm(true);
    }
  };

  return (
    <>
      <div className="alert">
        <div>
          <MdVerified />
          {value}
        </div>
        <div>
          <input
            type="number"
            id="rec-account-number"
            name="rec-account-number"
            placeholder="Account Number"
            // value={last ? last.AccNum : ""}
            // value={confirmReceiver.length > 0 ? confirmReceiver[0].AccNum : ""}
            readOnly
          />
        </div>

        <div className="input-cont">
          <input
            type="text"
            id="receiver-name"
            name="receiver-account-holder"
            placeholder="Account holder name"
            // value={
            //   confirmReceiver.length > 0 ? confirmReceiver[0].AccHolder : ""
            // }
            readOnly
          />
          <input type="button" value="Confirm" onClick={confrimPay} />
        </div>
      </div>
    </>
  );
}

export default memo(PaymentAlert);
