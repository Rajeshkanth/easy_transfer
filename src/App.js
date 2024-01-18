import { createContext, useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import HomePage from "./components/HomePage";
// import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Profile from "./components/Profile";
import Success from "./components/Success";

export const store = createContext();

function App() {
  const [amount, setAmount] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [regMobileNumber, setRegMobileNumber] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState("");
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
  const [receiverAccounts, setReceiverAccounts] = useState([]);
  const [confirmReceiver, setConfirmReceiver] = useState([]);
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);
  const [tabId, setTabId] = useState("");
  const [connectionMode, setConnectionMode] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [userNameFromDb, setUserNameFromDb] = useState("");
  const [ageFromDb, setAgeFromDb] = useState("");
  const [accFromDb, setAccFromDb] = useState("");
  const [mobileFromDb, setMobileFromDb] = useState("");
  const [dobFromDb, setDobFromDb] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLogin, setIsLogin] = useState(true);

  const handleRegMobileNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setRegMobileNumber(sanitizedValue);
    }
  };

  const handleCreatePassword = (e) => {
    const value = e.target.value;
    const allowedPattern = /^[a-zA-Z0-9@$]*$/;
    if (allowedPattern.test(value)) {
      setCreatePassword(value);
    }
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    const allowedPattern = /^[a-zA-Z0-9@$]*$/;
    if (allowedPattern.test(value)) {
      setConfirmPassword(value);
    }
  };

  const handleUserName = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setUserName(e.target.value);
    }
  };
  const socket =
    connectionMode === "socket"
      ? io.connect("https://polling-server.onrender.com")
      : null;

  useEffect(() => {
    const storedTabId = sessionStorage.getItem("tabId");
    if (storedTabId) {
      setTabId(storedTabId);
    } else {
      const newTabId = uuidv4();
      sessionStorage.setItem("tabId", newTabId);
      setTabId(newTabId);
    }

    const socket = io.connect("https://polling-server.onrender.com");

    setInterval(() => {
      socket.on("connection_type", (data) => {
        if (data.type === "socket") {
          setConnectionMode("socket");
        } else {
          setConnectionMode("polling");
        }
      });
    }, 1000);
  }, [connectionMode]);

  return (
    <store.Provider
      value={{
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
        receiverAccounts,
        setReceiverAccounts,
        socket,
        confirmReceiver,
        setConfirmReceiver,
        check,
        setCheck,
        fail,
        setFail,
        connectionMode,
        mobileNumber,
        setMobileNumber,
        password,
        setPassword,
        regMobileNumber,
        setRegMobileNumber,
        setCreatePassword,
        setConfirmPassword,
        createPassword,
        confirmPassword,
        registeredUsers,
        setRegisteredUsers,
        handleConfirmPassword,
        handleCreatePassword,
        handleRegMobileNumber,
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
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/transferPage" element={<PaymentForm />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default App;
