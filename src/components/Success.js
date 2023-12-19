import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";

import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router";

function Success() {
  const { socket } = useContext(store);
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
    if (check || fail === true) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [check, fail]);
  useEffect(() => {}, []);

  useEffect(() => {
    socket.on("paymentConfirmAlert", (data) => {
      setRoom(data.UniqueId); // Use UniqueId
      const receivedRoom = data.socketRoom;
      console.log(receivedRoom);
      setSocketRoom(receivedRoom);
    });
  }, [socket]);

  // ... (rest of the existing code)

  return (
    <>
      {fail ? (
        <>
          {" "}
          <div className="loading">
            <div class="wrapper">
              <MdOutlineCancel className="fail-icon" />{" "}
            </div>
            <h3>payment transaction failed!</h3>
            <br />
            <p>redirecting to the home page....</p>
          </div>
        </>
      ) : (
        <>
          {check ? (
            <div className="loading">
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
              <h3>payment transaction successful!</h3>
              <br />
              <p>redirecting to the home page....</p>
            </div>
          ) : (
            <div className="loading">
              <div className="loader"></div>
              <p>
                <strong>
                  Open your payment application and confirm the payment...
                </strong>{" "}
              </p>
              <p>
                <strong>Reminder: </strong>Payments need confirmation within 2
                seconds. Unconfirmed transactions will be canceled
                automatically.{" "}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Success;
