import { createContext, useState, useEffect, memo } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Beneficiaries from "./components/Beneficiaries";
import HomePage from "./components/HomePage";
import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Profile from "./components/Profile";
import Success from "./components/Success";
import Transactions from "./components/Transactions";
import PrivateRoutes from "./components/PrivateRoutes";
export const store = createContext();
const socket = io.connect("http://localhost:8080", {
  query: {
    tabId: sessionStorage.getItem("tabId"),
  },
});

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

function App() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [logOut, setLogOut] = useState(false);
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [card, setCard] = useState("");
  const [cvv, setCvv] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [key, setKey] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [toConfirmAccountNumber, setToConfirmAccountNumber] = useState("");
  const [toIFSCNumber, setToIFSCNumber] = useState("");
  const [toAccountHolderName, setToAccountHolderName] = useState("");
  const [tabId, setTabId] = useState("");
  const [connectionMode, setConnectionMode] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [userNameFromDb, setUserNameFromDb] = useState("");
  const [ageFromDb, setAgeFromDb] = useState("");
  const [accFromDb, setAccFromDb] = useState("");
  const [mobileFromDb, setMobileFromDb] = useState("");
  const [dobFromDb, setDobFromDb] = useState("");
  const [cardFromDb, setCardFromDb] = useState("");
  const [cvvFromDb, setCvvFromDb] = useState("");
  const [expireDateFromDb, setExpireDateFromDb] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLogin, setIsLogin] = useState(true);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [sendByBeneficiaries, setSendByBeneficiaries] = useState(false);
  const [savedAcc, setSavedAcc] = useState([]);
  const [loader, setLoader] = useState(false);
  const [notify, setNotify] = useState(true);
  const [enterAccountNumber, setEnterAccountNumber] = useState(false);
  const [enterAccountHolderName, setEnterAccountHolderName] = useState(false);
  const [enterToIfscNumber, setEnterToIfscNumber] = useState(false);
  const [enterAmount, setEnterAmount] = useState(false);
  const [savedAccLength, setSavedAccLength] = useState("");
  const [recentTransactionsLength, setRecentTransactionsLength] = useState(0);
  const [canceledPayments, setCanceledPaymentsCount] = useState(0);
  const [isNewUser, setNewUser] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginInputAlert, setLoginInputAlert] = useState(false);
  const [initatedAmountSend, setInitatedAmountSend] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [inputValues, setInputValues] = useState({});

  const handleSocket = () => {
    if (connectionMode === "socket") {
      socket.off();
    }
  };

  const clearAll = () => {
    setAccFromDb("");
    setCardFromDb("");
    setCvvFromDb("");
    setExpireDateFromDb("");
    setSavedAcc([]);
    setRecentTransactions([]);
    setIsLoggedOut(true);
    const tabId = sessionStorage.getItem("tabId");
    sessionStorage.clear();
    if (tabId) {
      sessionStorage.setItem("tabId", tabId);
    }
    setIsProfileClicked(false);
  };

  const handleUserName = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setUserName(e.target.value);
    }
  };

  useEffect(() => {
    const storedTabId = sessionStorage.getItem("tabId");
    if (storedTabId) {
      setTabId(storedTabId);
    } else {
      const newTabId = uuidv4();
      sessionStorage.setItem("tabId", newTabId);
      setTabId(newTabId);
    }

    socket.on("connection_type", (data) => {
      if (data.type === "socket") {
        setConnectionMode("socket");
        console.log("socket");
      } else {
        setConnectionMode("polling");
        console.log("polling");
      }
    });

    return () => {
      socket.disconnect();
      setSavedAcc([]);
      setRecentTransactions([]);
    };
  }, []);

  return (
    <store.Provider
      value={{
        cardFromDb,
        cvvFromDb,
        expireDateFromDb,
        setCardFromDb,
        setCvvFromDb,
        setExpireDateFromDb,
        isEditProfile,
        setIsEditProfile,
        inputValues,
        setInputValues,
        recentActivity,
        setRecentActivity,
        handleSocket,
        isLoggedOut,
        setIsLoggedOut,
        setIsValidNumber,
        isValidNumber,
        setSavedAccLength,
        setTabId,
        setConnectionMode,
        initatedAmountSend,
        setInitatedAmountSend,
        loginFailed,
        setLoginFailed,
        loginInputAlert,
        setLoginInputAlert,
        isNewUser,
        setNewUser,
        setCanceledPaymentsCount,
        canceledPayments,
        recentTransactionsLength,
        setRecentTransactionsLength,
        amount,
        setAmount,
        tabId,
        toAccountNumber,
        setToAccountNumber,
        toConfirmAccountNumber,
        setToConfirmAccountNumber,
        toIFSCNumber,
        setToIFSCNumber,
        toAccountHolderName,
        setToAccountHolderName,
        socket,
        connectionMode,
        setUserName,
        handleUserName,
        loggedUser,
        setLoggedUser,
        userName,
        age,
        setAge,
        dob,
        setDob,
        accNumber,
        setAccNumber,
        card,
        setCard,
        cvv,
        setCvv,
        expireDate,
        setExpireDate,
        key,
        setKey,
        userNameFromDb,
        setUserNameFromDb,
        ageFromDb,
        accFromDb,
        mobileFromDb,
        dobFromDb,
        setAgeFromDb,
        setAccFromDb,
        setMobileFromDb,
        setDobFromDb,
        windowWidth,
        setWindowWidth,
        isLogin,
        setIsLogin,
        isProfileClicked,
        setIsProfileClicked,
        sendByBeneficiaries,
        setSendByBeneficiaries,
        savedAcc,
        setSavedAcc,
        logOut,
        setLogOut,
        setEnterAccountHolderName,
        setEnterAccountNumber,
        setEnterToIfscNumber,
        setEnterAmount,
        enterAccountHolderName,
        enterAccountNumber,
        enterToIfscNumber,
        enterAmount,
        savedAccLength,
        setSavedAccLength,
        recentTransactions,
        setRecentTransactions,
        currentDate,
        setCurrentDate,
        clearAll,
        loader,
        setLoader,
        notify,
        setNotify,
      }}
    >
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/transferPage" element={<PaymentForm />}></Route>
            <Route path="/success" element={<Success />}></Route>
            <Route path="/Profile" element={<Profile />}></Route>
            <Route path="/Beneficiaries" element={<Beneficiaries />}></Route>
            <Route path="/Transactions" element={<Transactions />}></Route>
          </Route>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default memo(App);
