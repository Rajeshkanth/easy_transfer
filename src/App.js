import { createContext, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import PaymentAlert from "./components/PaymentAlert";
import PaymentForm from "./components/PaymentForm";
import Success from "./components/Success";
export const store = createContext();
function App() {
  const socket = io.connect("https://payment-server-461p.onrender.com");
  const [amount, setAmount] = useState("");
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [fromConfirmAccountNumber, setFromConfirmAccountNumber] = useState("");
  const [fromIFSCNumber, setFromIFSCNumber] = useState("");
  const [fromAccountHolderName, setFromAccountHolderName] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [toConfirmAccountNumber, setToConfirmAccountNumber] = useState("");
  const [toIFSCNumber, setToIFSCNumber] = useState("");
  const [toAccountHolderName, setToAccountHolderName] = useState("");
  const [receiverAccounts, setReceiverAccounts] = useState([]);
  const [confirmReceiver, setConfirmReceiver] = useState([]);
  return (
    <store.Provider
      value={{
        amount,
        setAmount,
        fromAccountNumber,
        setFromAccountNumber,
        fromConfirmAccountNumber,
        setFromConfirmAccountNumber,
        fromIFSCNumber,
        setFromIFSCNumber,
        fromAccountHolderName,
        setFromAccountHolderName,
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
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<PaymentForm />}></Route>
          <Route path="/paymentconfirm" element={<PaymentAlert />}></Route>
          <Route path="/success" element={<Success />}></Route>
        </Routes>
      </Router>
    </store.Provider>
  );
}

export default App;
