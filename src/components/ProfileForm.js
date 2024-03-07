import React, { memo, useEffect } from "react";
import axios from "axios";

function ProfileForm(props) {
  const {
    setIsEditProfile,
    userName,
    setUserNameFromDb,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
    setCardFromDb,
    setCvvFromDb,
    setExpireDateFromDb,
    cardFromDb,
    cvvFromDb,
    expireDateFromDb,
    setUserName,
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
    connectionMode,
    socket,
    accFromDb,
    dobFromDb,
  } = props.states;

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleAge = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAge(sanitizedValue);
    }
  };

  const handleDob = (e) => {
    const value = e.target.value;
    setDob(value);
  };

  const handleAccNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAccNumber(sanitizedValue);
    }
  };

  const handleCardNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCard(sanitizedValue);
    }
  };

  const handleExpireDate = (e) => {
    let enteredValue = e.target.value;
    enteredValue = enteredValue.replace(/\D/g, "");
    let month = enteredValue.slice(0, 2);
    let year = enteredValue.slice(2);
    if (month.length === 2) {
      month = parseInt(month, 10);
      !isNaN(month) && month >= 1 && month <= 12
        ? (month = month.toString().padStart(2, "0"))
        : (month = "");
    } else if (month.length === 1 && parseInt(month, 10) > 1) {
      month = "0" + month;
    }

    let formattedValue = month + (year ? "/" + year : "");
    if (enteredValue.length <= 4) setExpireDate(formattedValue);
  };

  const handleCvv = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCvv(sanitizedValue);
    }
  };

  const cancelEdit = () => {
    setIsEditProfile(false);
    setUserName("");
    setAge("");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const allFieldsFilled =
      userName &&
      age &&
      (dob || dobFromDb) &&
      (accNumber || accFromDb) &&
      (card || cardFromDb) &&
      (cvv || cvvFromDb) &&
      (expireDate || expireDateFromDb !== undefined);
    if (!allFieldsFilled) {
      alert("Enter all details");
      return;
    }

    const mobileNumber = sessionStorage.getItem("mobileNumber");
    try {
      if (connectionMode !== "socket") {
        await axios
          .post("http://localhost:8080/updateProfile", {
            mobileNumber: mobileNumber,
            name: userName,
            age: age,
            dob: dob || dobFromDb,
            accNum: accNumber || accFromDb,
            card: card || cardFromDb,
            cvv: cvv || cvvFromDb,
            expireDate: expireDate || expireDateFromDb,
          })
          .then((res) => {
            if (res.status === 200) {
              const { userName, age, dob, accNum, card, cvv, expireDate } =
                res.data;
              setUserNameFromDb(userName);
              setAccFromDb(accNum);
              setAgeFromDb(age);
              setDobFromDb(dob);
              setCardFromDb(card);
              setCvvFromDb(cvv);
              setExpireDateFromDb(expireDate);
              cancelEdit();
            }
          });
      } else {
        socket.emit("updateProfile", {
          mobileNumber: mobileNumber,
          name: userName,
          age: age,
          dob: dob,
          accNum: accNumber,
          card: card,
          cvv: cvv,
          expireDate: expireDate,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    socket.on("profileUpdated", (data) => {
      const { userName, accNum, dob, card, cvv, age, expireDate } = data;
      setUserNameFromDb(userName);
      setAccFromDb(accNum);
      setAgeFromDb(age);
      setDobFromDb(dob);
      setCardFromDb(card);
      setCvvFromDb(cvv);
      setExpireDateFromDb(expireDate);
      cancelEdit();
    });
  }, []);
  return (
    <>
      <form
        onSubmit={(e) => updateProfile(e)}
        className="w-full sm:w-11/12 lg:w-3/5 h-screen text-gray-800 text-16 m-auto bg-blue-650 sm:ml-14 lg:ml-92 p-5 box-border items-center flex flex-col font-poppins justify-center sm:space-y-2 "
      >
        <div className="sm:flex flex-wrap sm:space-x-2 w-3/4 sm:w-full md:w-4/5">
          <input
            className="block w-full sm:w-1/2 text-16 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="text"
            value={userName}
            onChange={handleUserName}
            placeholder="Enter user name"
            required
          />
          <input
            className="block w-full sm:w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="tel"
            value={age}
            maxLength={3}
            onChange={handleAge}
            placeholder="Enter age"
            required
          />
        </div>
        <div className="sm:flex flex-wrap sm:space-x-2 w-3/4 sm:w-full md:w-4/5">
          <input
            className="block w-full sm:w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="date"
            disabled={dobFromDb ? true : false}
            value={dobFromDb ? dobFromDb : dob}
            onChange={handleDob}
            placeholder="Date of birth"
            required
          />
          <input
            maxLength={16}
            type="tel"
            disabled={accFromDb ? true : false}
            value={accFromDb ? accFromDb : accNumber}
            onChange={handleAccNumber}
            className="block px-4 py-2 mb-3 w-full sm:w-3/6 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            placeholder="Enter account number"
            required
          />
        </div>
        <div className=" flex flex-wrap sm:space-x-2 w-3/4 sm:w-full md:w-4/5">
          <input
            type="tel"
            readOnly
            value={sessionStorage.getItem("mobileNumber")}
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
          <input
            maxLength={16}
            type="tel"
            value={cardFromDb ? cardFromDb : card}
            disabled={cardFromDb ? true : false}
            onChange={handleCardNumber}
            required
            placeholder="Enter card details"
            className="block px-4 py-2 mb-3 w-full sm:w-1/2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
        </div>
        <div className=" sm:flex flex-wrap  sm:space-x-2 w-3/4 sm:w-full md:w-4/5">
          <input
            maxLength={5}
            type="tel"
            value={cvvFromDb ? cvvFromDb : cvv}
            disabled={cvvFromDb ? true : false}
            placeholder="CVV"
            onChange={handleCvv}
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
          <input
            type="text"
            value={expireDateFromDb ? expireDateFromDb : expireDate}
            disabled={expireDateFromDb ? true : false}
            onChange={handleExpireDate}
            placeholder="MM/YY"
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
        </div>
        <div className=" w-3/4 sm:w-full md:w-4/5 text-white space-x-2 flex">
          <input
            type="submit"
            value="Confirm"
            required
            className="block py-2 mb-3 w-1/2 sm:w-1/3 relative box-border hover:cursor-pointer bg-gray-800 border-2 border-white rounded-md focus:outline-none "
          />

          <button
            onClick={cancelEdit}
            className=" block px-4 py-2 mb-3 w-1/2 box-border bg-gray-800 border-2 hover:border-white rounded-md focus:outline-none focus:border-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default memo(ProfileForm);
