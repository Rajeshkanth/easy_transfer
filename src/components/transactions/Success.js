import React, { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { store } from "../../App";
import { useNavigate } from "react-router";
import Loader from "../utils/Loader";
import AlertModal from "../utils/AlertModal";
import { paymentFailedSvg } from "../utils/CautionSvg";
import { paymentSuccessSvg } from "../utils/SuccessSvg";

function Success() {
  const { socket, connectionMode } = useContext(store);
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  let sessionId;

  const home = () => {
    navigate("/");
  };

  const successButton = [
    {
      label: "Done",
      method: home,
      bg: "bg-green-600 hover:bg-green-800 focus:ring-green-400",
    },
  ];
  const failedButton = [
    {
      label: "Done",
      method: home,
      bg: "bg-red-600 hover:bg-red-800 focus:ring-red-400",
    },
  ];

  useEffect(() => {
    sessionId = sessionStorage.getItem("tabId");
    socket.emit("successPage", {
      socketRoom: sessionId,
    });

    const handleSuccess = (data) => {
      if (typeof data === "boolean") {
        setCheck(data);
        setFail(false);
        console.log("success");
      }
    };

    const handleFailure = (data) => {
      if (typeof data === "boolean") {
        setFail(data);
        setCheck(false);
      }
    };

    socket.on("success", handleSuccess);
    socket.on("failed", handleFailure);

    return () => {
      socket.off("success", handleSuccess);
      socket.off("failed", handleFailure);
    };
  }, [socket]);

  useEffect(() => {
    if (connectionMode === "socket") {
      socket.on("paymentConfirmAlert", (data) => {
        const receivedRoom = data.socketRoom;
        socket.join(receivedRoom);
      });
    }
  }, [socket, connectionMode]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const uid = sessionStorage.getItem("uid");

      try {
        const response = await axios.post(
          `http://localhost:8080/api/transaction/transactionStatus/${uid}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setCheck(true);
          setFail(false);
        }

        if (response.status === 201) {
          setCheck(false);
          setFail(true);
        }
      } catch (err) {
        console.log(err);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [check, fail]);

  return (
    <div className="bg-white h-screen w-screen text-white font-poppins flex items-center justify-center">
      {fail ? (
        <AlertModal
          buttons={failedButton}
          icon={paymentFailedSvg}
          msg="Payment transaction failed"
        />
      ) : (
        <>
          {check ? (
            <AlertModal
              buttons={successButton}
              icon={paymentSuccessSvg}
              msg="Payment transaction success"
            />
          ) : (
            <Loader msg="Your transaction is processing" />
          )}
        </>
      )}
    </div>
  );
}

export default memo(Success);
