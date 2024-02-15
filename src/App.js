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
import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Profile from "./components/Profile";
import Success from "./components/Success";
import Transactions from "./components/Transactions";

export const store = createContext();
const socket = io.connect("https://polling-server.onrender.com", {
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
  const [currentDate, setCurrentDate] = useState(getDate());
  const [recentTransactions, setRecentTransactions] = useState([]);
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
  const [enterAccountNumber, setEnterAccountNumber] = useState(false);
  const [enterAccountHolderName, setEnterAccountHolderName] = useState(false);
  const [enterToIfscNumber, setEnterToIfscNumber] = useState(false);
  const [enterAmount, setEnterAmount] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [savedAccLength, setSavedAccLength] = useState("");
  const [recentTransactionsLength, setRecentTransactionsLength] = useState(0);
  const [canceledPayments, setCanceledPaymentsCount] = useState(0);
  const [isNewUser, setNewUser] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginInputAlert, setLoginInputAlert] = useState(false);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [initatedAmountSend, setInitatedAmountSend] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [indiaCode, setIndiaCode] = useState(false);
  const [singaporeCode, setSingaporeCode] = useState(false);
  const [usRussiaCode, setUsRussiaCode] = useState(false);

  const handleRegMobileNumber = (value, country) => {
    // const value = e.target.value;
    // if (value.length <= 10) {
    // const sanitizedValue = value.replace(/[^0-9]/g, "");
    const countryCode = country.dialCode;
    if (countryCode === "91") {
      setIndiaCode(true);
      setSingaporeCode(false);
      setUsRussiaCode(false);
    } else if (countryCode === "1" || countryCode === "7") {
      setIndiaCode(false);
      setSingaporeCode(false);
      setUsRussiaCode(true);
    } else if (countryCode === "65") {
      setSingaporeCode(true);
      setIndiaCode(false);
      setUsRussiaCode(false);
    }
    setRegMobileNumber(value);
    // }
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
  useEffect(() => {
    const storedTabId = sessionStorage.getItem("tabId");
    if (storedTabId) {
      setTabId(storedTabId);
    } else {
      const newTabId = uuidv4();
      sessionStorage.setItem("tabId", newTabId);
      setTabId(newTabId);
    }

    // const socket = io.connect("https://polling-server.onrender.com", {
    //   query: {
    //     tabId: sessionStorage.getItem("tabId"),
    //   },
    // });

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

  useEffect(() => {
    socket.emit("fetchList", {
      num: document.cookie,
    });
    console.log("event emitted");
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (connectionMode !== "socket") {
  //     } else {
  //       await socket.on("allSavedAccounts", (data) => {
  //         const savedDetail = {
  //           beneficiaryName: data.beneficiaryName,
  //           accNum: data.accNum,
  //           ifsc: data.ifsc,
  //           editable: data.editable,
  //         };

  //         // Check if accNum is greater than 15 digits
  //         // if (String(savedDetail.accNum).length > 15) {
  //         //   const isAlreadyStored = savedAcc.some((detail) => {
  //         //     return (
  //         //       detail.beneficiaryName === savedDetail.beneficiaryName &&
  //         //       detail.accNum === savedDetail.accNum &&
  //         //       detail.ifsc === savedDetail.ifsc &&
  //         //       detail.editable === savedDetail.editable
  //         //     );
  //         //   });

  //         //   if (!isAlreadyStored) {
  //         //     setSavedAcc((prev) => [...prev, savedDetail]);
  //         //   }
  //         // }

  //         if (String(savedDetail.accNum).length > 15) {
  //           const isAlreadyStored = savedAcc
  //             ? savedAcc.some((detail) => {
  //                 return (
  //                   detail.beneficiaryName === savedDetail.beneficiaryName &&
  //                   detail.accNum === savedDetail.accNum &&
  //                   detail.ifsc === savedDetail.ifsc &&
  //                   detail.editable === savedDetail.editable
  //                 );
  //               })
  //             : false;

  //           if (!isAlreadyStored) {
  //             setSavedAcc((prevSavedAcc) => {
  //               const updatedSavedAcc = prevSavedAcc
  //                 ? [...prevSavedAcc, savedDetail]
  //                 : [savedDetail];
  //               sessionStorage.setItem(
  //                 "savedAcc",
  //                 JSON.stringify(updatedSavedAcc)
  //               );
  //               return updatedSavedAcc;
  //             });
  //           }
  //         }
  //         console.log("event received");
  //       });
  //     }
  //   };

  //   fetchData();
  //   console.log("from effect");
  // }, []);

  // useEffect(() => {
  //   if (connectionMode !== socket) {
  //   } else if (!logOut) {
  //     socket.on("getSavedBeneficiary", (data) => {
  //       const savedDetail = {
  //         beneficiaryName: data.beneficiaryName,
  //         accNum: data.accNum,
  //         ifsc: data.ifsc,
  //         editable: data.editable,
  //       };
  //       setSavedAcc((prev) => [...prev, savedDetail]);
  //     });
  //   }
  // }, [socket]);

  return (
    <store.Provider
      value={{
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
        setEnterAccountHolderName,
        setEnterAccountNumber,
        setEnterToIfscNumber,
        setEnterAmount,
        enterAccountHolderName,
        enterAccountNumber,
        enterToIfscNumber,
        enterAmount,
        balance,
        setBalance,
        savedAccLength,
        setSavedAccLength,
        recentTransactions,
        setRecentTransactions,
        currentDate,
        setCurrentDate,
        failedTransaction,
        setFailedTransaction,
        setHasLowerCase,
        setHasMinLength,
        setHasSpecialChar,
        setHasUpperCase,
        hasLowerCase,
        hasUpperCase,
        hasSpecialChar,
        hasMinLength,
        indiaCode,
        setIndiaCode,
        singaporeCode,
        setSingaporeCode,
        usRussiaCode,
        setUsRussiaCode,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/transferPage" element={<PaymentForm />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Beneficiaries" element={<Beneficiaries />}></Route>
          <Route path="/Transactions" element={<Transactions />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default App;
