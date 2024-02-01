import { createContext, useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Beneficiaries from "./components/Beneficiaries";
import HomePage from "./components/HomePage";
// import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Profile from "./components/Profile";
import Success from "./components/Success";

export const store = createContext();

function App() {
  const [amount, setAmount] = useState("");
  const [logOut, setLogOut] = useState(false);
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
  const [passwordError, setPasswordError] = useState(true);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [sendByBeneficiaries, setSendByBeneficiaries] = useState(false);
  const [savedAcc, setSavedAcc] = useState([]);
  const [loader, setLoader] = useState(false);
  const [notify, setNotify] = useState(true);
  const [plusIcon, setPlusIcon] = useState(false);

  const handleRegMobileNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setRegMobileNumber(sanitizedValue);
    }
  };

  const handleCreatePassword = (e) => {
    const value = e.target.value;

    const allowedPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_+={}[\]:;'"<>,./?]).{8,}$/;
    const testedValue = allowedPattern.test(value);
    setCreatePassword(value);
    if (testedValue) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;

    const allowedPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_+={}[\]:;'"<>,./?]).{8,}$/;
    const testedValue = allowedPattern.test(value);
    setConfirmPassword(value);
    if (testedValue) {
      setPasswordError(false);
    } else {
      setPassword(true);
    }
  };

  const handleUserName = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setUserName(e.target.value);
    }
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
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

    socket.on("connection_type", (data) => {
      if (data.type === "socket") {
        setConnectionMode("socket");
      } else {
        setConnectionMode("polling");
      }
    });
  }, [connectionMode]);

  useEffect(() => {
    const fetchData = async () => {
      if (connectionMode === "socket") {
        socket.emit("fetchList", {
          num: document.cookie,
        });

        socket.on("allSavedAccounts", (data) => {
          const savedDetail = {
            beneficiaryName: data.beneficiaryName,
            accNum: data.accNum,
            ifsc: data.ifsc,
            editable: data.editable,
          };

          const isAlreadyStored = savedAcc.some((detail) => {
            return (
              detail.beneficiaryName === savedDetail.beneficiaryName &&
              detail.accNum === savedDetail.accNum &&
              detail.ifsc === savedDetail.ifsc &&
              detail.editable === savedDetail.editable
            );
          });

          if (!isAlreadyStored) {
            setSavedAcc((prev) => [...prev, savedDetail]);
            console.log(savedAcc);
          }
        });
      }
    };

    fetchData();

    return () => {
      if (connectionMode !== "socket") {
      } else {
        socket.off();
      }
    };
  }, [connectionMode, socket, setSavedAcc]);

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
        passwordError,
        isProfileClicked,
        setIsProfileClicked,
        setPasswordError,
        sendByBeneficiaries,
        setSendByBeneficiaries,
        savedAcc,
        setSavedAcc,
        logOut,
        setLogOut,
        loader,
        setLoader,
        notify,
        setNotify,
        setPlusIcon,
        plusIcon,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/transferPage" element={<PaymentForm />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Beneficiaries" element={<Beneficiaries />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default App;
