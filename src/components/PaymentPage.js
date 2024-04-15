import React, { memo, useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { store } from "../App";
import { useIdleTimer } from "react-idle-timer";
import PaymentForm from "../components/forms/PaymentForm";
import ScrollReveal from "scrollreveal";
import { Toaster, toast } from "sonner";

function PaymentPage(props) {
  const {
    clearSession,
    setInitatedAmountSend,
    currentDate,
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
    setIsProfileClicked,
    sendByBeneficiaries,
    setSendByBeneficiaries,
    setEnterAccountHolderName,
    setEnterAccountNumber,
    setEnterToIfscNumber,
    setEnterAmount,
    setSavedAcc,
    setRecentTransactions,
    setIsLoggedOut,
    handleSocket,
    saveBeneficiary,
    handleSaveBeneficiaryCheckMark,
  } = useContext(store);
  const { setNewReceiver, newReceiver } = props.data;

  const navigate = useNavigate();
  const [allInput, setAllInput] = useState(false);
  const [saveBenficiaryCheck, setSaveBeneficiaryCheck] = useState(false);

  const handleAmountToSend = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setAmount(sanitizedValue);
  };

  const handleAccNumToSend = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length <= 16) {
      setToAccountNumber(sanitizedValue);
    }
  };

  const handleToIfsc = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setToIFSCNumber(e.target.value);
    }
  };

  const logout = () => {
    clearSession();
    setLoggedUser("");
    navigate("/");
  };

  const inputAlerts = () => {
    setAllInput(false);
    setEnterAccountHolderName(false);
    setEnterAccountNumber(false);
    setEnterAmount(false);
    setEnterToIfscNumber(false);
  };

  const sendAmountBySocket = (e) => {
    e.preventDefault();
    if (
      amount &&
      String(toAccountNumber).length > 15 &&
      String(toIFSCNumber).length > 9 &&
      toAccountNumber &&
      toAccountHolderName &&
      toIFSCNumber
    ) {
      setSendByBeneficiaries(false);
      setInitatedAmountSend(true);
      const newReceiver = {
        amount: amount,
        accNum: toAccountNumber,
        accHolder: toAccountHolderName,
        ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "socket",
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      };

      const newTransactions = {
        amount: amount,
        date: currentDate,
        description: `Sent to ${toAccountHolderName}`,
        status: "pending",
        name: toAccountHolderName,
        uid: uuid(),
      };

      socket.emit("paymentPage", {
        mobileNumber: sessionStorage.getItem("mobileNumber"),
        connected: true,
        newReceiver: newReceiver,
        newTransactions: newTransactions,
        uid: uuid(),
      });
      inputAlerts();
      handleAllInput();
      navigate("/success");
    } else {
      setAllInput(true);
    }
  };

  const sendAmountByPolling = async (e) => {
    e.preventDefault();
    const uid = uuid();
    sessionStorage.setItem("uid", uid);

    try {
      setSendByBeneficiaries(false);
      setInitatedAmountSend(true);
      const newTransactions = {
        amount: amount,
        accountNumber: toAccountNumber,
        name: toAccountHolderName,
        ifsc: toIFSCNumber,
        tabId: sessionStorage.getItem("tabId"),
        type: "polling",
        mobileNumber: sessionStorage.getItem("mobileNumber"),
        uid: uid,
        date: currentDate,
        status: `pending`,
      };
      if (saveBenficiaryCheck) {
        await axios
          .post("http://localhost:8080/api/user/addNewBeneficiary", {
            beneficiaryName: toAccountHolderName,
            accountNumber: toAccountNumber,
            ifsc: toIFSCNumber,
            mobileNumber: sessionStorage.getItem("mobileNumber"),
          })
          .then((res) => {
            if (res.status === 400) {
              return toast.error("Account already exists");
            }
            switch (res.status) {
              case 200:
                const savedDetail = {
                  beneficiaryName: res.data.beneficiaryName,
                  accountNumber: res.data.accountNumber,
                  ifsc: res.data.ifsc,
                };
                setSavedAcc((prev) => [...prev, savedDetail]);
                break;
              case 400:
                alert("Account number already saved");
                toast.error("Account number already saved");
                break;
              default:
                break;
            }
          });

        navigate("/success");
        handleAllInput();

        await axios
          .post("http://localhost:8080/api/transaction/fromPaymentAlert", {
            newTransaction: newTransactions,
            mobileNumber: sessionStorage.getItem("mobileNumber"),
          })
          .then((response) => {
            switch (response.status) {
              case 200:
                setAllInput(false);
                break;
              default:
                break;
            }
          });
      }
    } catch (err) {
      if (err.response.status === 400)
        return toast.error("Account number already exists", {
          className: "text-red-600 z-200",
        });
      toast.error("Internal server error");
    }
  };

  const handleAllInput = () => {
    setAmount("");
    setToAccountHolderName("");
    setToAccountNumber("");
    setToIFSCNumber("");
  };

  const cancelTransfer = () => {
    setSendByBeneficiaries(false);
    handleAllInput("");
    setAllInput(false);
    setNewReceiver(!newReceiver);
  };

  const onIdle = () => {
    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
      const tabId = sessionStorage.getItem("tabId");
      sessionStorage.clear();
      if (tabId) {
        sessionStorage.setItem("tabId", tabId);
      }
      setIsProfileClicked(false);
      logout();
    }, 3000);
    alert("Session expired! You will be redirected to login page");
  };

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    setAllInput(false);
    return () => {
      handleAllInput();
    };
  }, []);

  return (
    <>
      <div
        className="h-screen backdrop-blur-sm flex justify-center items-center text-white font-poppins w-screen top-0 fixed px-5 sm:px-0"
        onClick={() => setNewReceiver(!newReceiver)}
      >
        <PaymentForm
          data={{
            sendAmountByPolling,
            sendAmountBySocket,
            sendByBeneficiaries,
            allInput,
            toAccountHolderName,
            toAccountNumber,
            toIFSCNumber,
            setToAccountHolderName,
            handleAccNumToSend,
            handleToIfsc,
            handleAmountToSend,
            amount,
            connectionMode,
            cancelTransfer,
            handleSaveBeneficiaryCheckMark,
            setSaveBeneficiaryCheck,
            saveBenficiaryCheck,
          }}
        />
        <Toaster />
      </div>
    </>
  );
}

export default memo(PaymentPage);
