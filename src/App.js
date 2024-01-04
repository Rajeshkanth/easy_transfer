import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
// import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Success from "./components/Success";

export const store = createContext();

function App() {
  const [amount, setAmount] = useState("");

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

  const socket = io.connect("https://polling-server.onrender.com");

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
      } else {
        setConnectionMode("polling");
      }
    });
    // if (connectionMode !== "socket") {
    //   const pollingConnection = axios.get(
    //     "https://polling-server.onrender.com/connectionType"
    //   );
    //   if (pollingConnection.status === 201) {
    //     setConnectionMode("polling");
    //   } else {
    //     setConnectionMode("socket");
    //   }
    // }
  }, []);

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
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<PaymentForm />}></Route>
          <Route path="/success" element={<Success />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default App;
