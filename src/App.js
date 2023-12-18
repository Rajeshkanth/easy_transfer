import { createContext, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Success from "./components/Success";

export const store = createContext();

// const uniqueID = window.localStorage.getItem("uniqueID");

function App() {
  const [amount, setAmount] = useState("");

  const [toAccountNumber, setToAccountNumber] = useState("");
  const [toConfirmAccountNumber, setToConfirmAccountNumber] = useState("");
  const [toIFSCNumber, setToIFSCNumber] = useState("");
  const [toAccountHolderName, setToAccountHolderName] = useState("");
  const [receiverAccounts, setReceiverAccounts] = useState([]);
  const [confirmReceiver, setConfirmReceiver] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);

  // const socket = io.connect("https://payment-server-461p.onrender.com", {
  //   query: {
  //     // source: uniqueID,
  //   },
  // });
  const socket = io.connect("http://localhost:3004");

  return (
    <store.Provider
      value={{
        amount,
        setAmount,

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
