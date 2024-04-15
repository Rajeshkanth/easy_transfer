import React, { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { store } from "../../App";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router";
import Loader from "../utils/Loader";
import DoneButton from "../utils/DoneButton";
import AlertModal from "../utils/AlertModal";
import { paymentFailedSvg } from "../utils/CautionSvg";

function Success() {
  const { socket, connectionMode } = useContext(store);
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  let sessionId;

  const home = () => {
    navigate("/beneficiaries");
  };

  // const paymentFailedSvgPattern = () => {
  //   return (
  //     <svg
  //       class="mx-auto mb-4 text-gray-500 w-12 h-12 "
  //       aria-hidden="true"
  //       xmlns="http://www.w3.org/2000/svg"
  //       fill="none"
  //       viewBox="0 0 20 20"
  //     >
  //       <path
  //         stroke="currentColor"
  //         stroke-linecap="round"
  //         stroke-linejoin="round"
  //         stroke-width="2"
  //         d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  //       />
  //     </svg>
  //   );
  // };
  // const paymentFailedSvg = paymentFailedSvgPattern();

  const paymentSuccessSvgPattern = () => {
    return (
      <svg
        class="checkmark w-14 h-14 rounded-full block border-2 border-white mx-auto my-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />{" "}
        <path
          class="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    );
  };

  const paymentSuccessSvg = paymentSuccessSvgPattern();

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
          `http://localhost:8080/api/transaction/transactionStatus/${uid}`
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
    <>
      {fail ? (
        <>
          <div className="bg-gray-800 h-screen w-screen text-white flex items-center justify-center font-poppins space-y-2">
            <AlertModal
              buttons={failedButton}
              icon={paymentFailedSvg}
              msg={"Payment transaction failed"}
            />
          </div>
        </>
      ) : (
        <>
          {check ? (
            <div className="bg-gray-800 h-screen w-screen flex flex-col items-center justify-center text-white font-poppins">
              <AlertModal
                buttons={successButton}
                icon={paymentSuccessSvg}
                msg={"Payment transaction success"}
              />
            </div>
          ) : (
            <Loader msg={"Your transaction is processing"} />
          )}
        </>
      )}
    </>
  );
}

export default memo(Success);
