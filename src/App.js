import { createContext, useState, useEffect, memo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Keycloak from "keycloak-js";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Beneficiaries from "./components/accounts/Beneficiaries";
import Success from "./components/transactions/Success";
import Transactions from "./components/transactions/Transactions";
import PaymentPage from "./components/PaymentPage";
import ServerError from "./components/auth/ServerError";
import Toast from "./components/utils/Toast";
import axios from "axios";
import { toast } from "sonner";

const httpClient = axios.create({});

export { httpClient };

let initOption = {
  url: "http://localhost:8180/",
  realm: "easy_transfer_realm",
  clientId: "react",
};

let kc = new Keycloak(initOption);

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

  useEffect(() => {
    kc.init({
      onLoad: "login-required",
      checkLoginIframe: true,
      pkceMethod: "S256",
    }).then(
      (auth) => {
        if (!auth) {
          alert(auth);
        }
        sessionStorage.setItem("token", kc.token ? kc.token : "");

        httpClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${kc.token}`;

        axios
          .get(
            "http://localhost:8180/realms/easy_transfer_realm/protocol/openid-connect/userinfo",
            {
              headers: {
                Authorization: `Bearer ${kc.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            sessionStorage.setItem("mobileNumber", response.data.preferred_username);
          })
          .catch((error) => {
            toast.error("Internal error occurred");
            console.error("Failed to fetch user info:", error);
          });

        kc.onTokenExpired = () => {
          toast.error("Session expired");
        };
      },

      () => {
        toast.error("Authentication failed!");
      }
    );
  }, []);

  return (
    <store.Provider
      value={{
        kc,
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
          <Route path="/" Component={Beneficiaries}></Route>
          <Route path="/transferPage" Component={PaymentPage}></Route>
          <Route path="/success" Component={Success}></Route>
          <Route path="/transactions" Component={Transactions}></Route>
          <Route path="/error" Component={ServerError}></Route>
          <Route path="/toast" Component={Toast}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default memo(App);
