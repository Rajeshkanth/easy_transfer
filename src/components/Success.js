import React, { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { store } from "../App";

import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router";
import Loader from "./Loader";

function Success() {
  const { socket, connectionMode } = useContext(store);
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  const [room, setRoom] = useState(0);
  const [uid, setUid] = useState("");
  const [socketRoom, setSocketRoom] = useState("");
  let sessionId;

  useEffect(() => {
    sessionId = sessionStorage.getItem("tabId");
    socket.emit("join_success_room", {
      SocketRoom: sessionId,
    });

    const handleSuccess = (data) => {
      if (typeof data === "boolean") {
        setCheck(data);
        setFail(false);
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
    if (connectionMode !== "socket") {
    } else {
      socket.on("paymentConfirmAlert", (data) => {
        setRoom(data.UniqueId); // Use UniqueId
        const receivedRoom = data.socketRoom;
        console.log(receivedRoom);
        setSocketRoom(receivedRoom);
      });
    }
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const tabId = sessionStorage.getItem("tabId");
      try {
        const response = await axios.post(
          `https://polling-server.onrender.com/success/${tabId}`
          // `http://localhost:8080/success/${tabId}`
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

  useEffect(() => {
    if (check || fail === true) {
      setTimeout(() => {
        navigate("/transferPage");
      }, 3000);
    }
  }, [check, fail]);

  return (
    <>
      {fail ? (
        <>
          {" "}
          <div className="loading font-poppins space-y-2">
            <div class="wrapper">
              <MdOutlineCancel className="fail-icon" />{" "}
            </div>
            <h3 className="text-white">Payment Transaction Failed!</h3>
            <p className="text-white">Redirecting to the home page....</p>
          </div>
        </>
      ) : (
        <>
          {check ? (
            <div className="loading font-poppins">
              <div class="wrapper">
                {" "}
                <svg
                  class="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  {" "}
                  <circle
                    class="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />{" "}
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>

              <h3 className="text-white">Payment Transaction Successful !</h3>
              <br />
            </div>
          ) : (
            <Loader msg={"waiting for the transaction confirmation"} />
          )}
        </>
      )}
    </>
  );
}

export default memo(Success);
