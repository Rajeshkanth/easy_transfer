import React, { memo, useContext } from "react";
import { store } from "../App";
import axios from "axios";

function ProfileForm() {
  const {
    setIsEditProfile,
    userName,
    setUserNameFromDb,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
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
  } = useContext(store);
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
    const enteredValue = e.target.value;
    const sanitizedValue = enteredValue.replace(/[^0-9/]/g, "");
    if (enteredValue.length <= 5) setExpireDate(sanitizedValue);
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
    // setAccNumber("");
    setAge("");
    // setDob("");
    // setCard("");
    // setExpireDate("");
    // setCvv("");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (connectionMode !== "socket") {
      if (
        userName &&
        age &&
        (dob || dobFromDb) &&
        (accNumber || accFromDb) &&
        card &&
        cvv &&
        expireDate
      ) {
        const userData = document.cookie;
        const response = await axios.post(
          "http://localhost:8080/updateProfile",
          {
            data: userData,
            name: userName,
            Age: age,
            DOB: dob,
            AccNum: accNumber,
            Card: card,
            CVV: cvv,
            ExpireDate: expireDate,
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          const { userName, age, dob, accNum } = response.data;

          setUserNameFromDb(userName);
          setAccFromDb(accNum);
          setAgeFromDb(age);
          setDobFromDb(dob);
          setIsEditProfile(false);
          setUserName("");
          setAge("");
        } else if (response.status === 500) {
          console.log("userName not updated");
        }
      } else {
        alert("Enter all details");
      }
    } else {
      if (userName && age && accNumber && card && cvv && expireDate) {
        const regNum = document.cookie;
        socket.emit("updateProfile", {
          num: regNum,
          name: userName,
          age: age,
          DOB: dob,
          AccNum: accNumber,
          Card: card,
          CVV: cvv,
          ExpireDate: expireDate,
        });

        socket.on("profileUpdated", (data) => {
          setUserNameFromDb(data.userName);
          setAgeFromDb(data.age);
          setDobFromDb(data.dob);
          setAccFromDb(data.accNum);
          setUserName("");
          setAge("");
          sessionStorage.setItem(
            "userName",
            data.userName ? data.userName : ""
          );
        });
        setIsEditProfile(false);
      } else {
        alert("Enter your details");
      }
    }
  };
  return (
    <>
      <form
        action="submit"
        onSubmit={updateProfile}
        className="w-full sm:w-[90%] lg:w-[60%] h-screen text-gray-800 text-[16px]  m-auto bg-blue-650 sm:ml-[10vw]  lg:ml-[25vw] p-5 box-border items-center flex flex-col  font-poppins justify-center sm:space-y-2 "
      >
        <div className="sm:flex flex-wrap  sm:space-x-2 w-3/4  sm:w-full md:w-[80%]">
          <input
            className="block w-full sm:w-1/2 text-[16px] px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="text"
            value={userName}
            onChange={handleUserName}
            placeholder="Enter User Name"
            required
          />
          <input
            className="block  w-full sm:w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="tel"
            value={age}
            maxLength={3}
            onChange={handleAge}
            placeholder="Enter Age"
            required
          />
        </div>
        <div className="sm:flex flex-wrap  sm:space-x-2  w-3/4 sm:w-full md:w-[80%]">
          <input
            className="block w-full sm:w-1/3   px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            type="date"
            disabled={dobFromDb ? true : false}
            value={dobFromDb ? dobFromDb : dob}
            onChange={handleDob}
            placeholder="Date of Birth"
            required
          />

          <input
            type="tel"
            disabled={setAccFromDb ? true : false}
            value={setAccFromDb ? accFromDb : accNumber}
            onChange={handleAccNumber}
            className="block px-4 py-2 mb-3  w-full sm:w-3/6  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
            placeholder="Enter Account Number"
            required
          />
        </div>
        <div className=" flex flex-wrap  sm:space-x-2  w-3/4 sm:w-full md:w-[80%]">
          <input
            type="tel"
            readOnly
            value={document.cookie}
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
          <input
            type="tel"
            value={card}
            onChange={handleCardNumber}
            required
            placeholder="Enter Card Details"
            className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
        </div>
        <div className=" sm:flex flex-wrap  sm:space-x-2 w-3/4 sm:w-full md:w-[80%]">
          <input
            type="tel"
            value={cvv}
            placeholder="CVV"
            onChange={handleCvv}
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
          <input
            type="text"
            value={expireDate}
            onChange={handleExpireDate}
            placeholder="MM/YY"
            required
            className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
          />
        </div>
        <div className=" w-3/4 sm:w-full  md:w-[80%] text-white space-x-2 flex">
          <input
            type="button"
            value="Confirm"
            required
            onClick={updateProfile}
            className="block  py-2 mb-3 w-1/2 sm:w-1/3 relative box-border  hover:cursor-pointer  bg-gray-800 border-2 border-white rounded-md focus:outline-none "
          />

          <button
            onClick={cancelEdit}
            className=" block px-4 py-2 mb-3 w-1/2 box-border      bg-gray-800 border-2 hover:border-white rounded-md focus:outline-none focus:border-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default memo(ProfileForm);
