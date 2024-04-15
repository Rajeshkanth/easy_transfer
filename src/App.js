import { createContext, useState, useEffect, memo } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Beneficiaries from "./components/accounts/Beneficiaries";
import HomePage from "./components/auth/HomePage";
import Profile from "./components/Profile";
import Success from "./components/transactions/Success";
import Transactions from "./components/transactions/Transactions";
import PrivateRoutes from "./components/routes/PrivateRoutes";
import PaymentPage from "./components/PaymentPage";
import ServerError from "./components/auth/ServerError";
import ProfileForm from "./components/forms/ProfileForm";
import Toast from "./components/utils/Toast";
export const store = createContext();

const socket = io.connect("http://localhost:8081", {
  query: {
    tabId: sessionStorage.getItem("tabId"),
  },
});

function getDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const date = String(today.getDate()).padStart(2, "0");
  return `${year}/${month}/${date}`;
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
  const [signOutAlert, setSignOutAlert] = useState(false);

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
    setIsProfileClicked(false);
  };

  const logOutCanceled = () => {
    setSignOutAlert(false);
  };

  const handleUserName = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setUserName(e.target.value);
    }
  };

  const clearSession = () => {
    const storedTabId = sessionStorage.getItem("tabId");
    if (storedTabId) {
      setTabId(storedTabId);
    } else {
      const newTabId = uuidv4();
      sessionStorage.setItem("tabId", newTabId);
      setTabId(newTabId);
    }
  };

  useEffect(() => {
    clearSession();
    socket.on("connection_type", (data) => {
      if (data.type === "socket") {
        setConnectionMode("socket");
      } else {
        setConnectionMode("polling");
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
        clearSession,
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
        signOutAlert,
        setSignOutAlert,
        logOutCanceled,
      }}
    >
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/transferPage" element={<PaymentPage />}></Route>
            <Route path="/success" element={<Success />}></Route>
            <Route path="/beneficiaries" element={<Beneficiaries />}></Route>
            <Route path="/transactions" element={<Transactions />}></Route>
          </Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/error" element={<ServerError />}></Route>
          <Route path="/toast" element={<Toast />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default memo(App);
