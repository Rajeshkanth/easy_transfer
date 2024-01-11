import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { MdAccountCircle, MdAccountBalance } from "react-icons/md";
import { useNavigate } from "react-router";

function Profile() {
  const {
    mobileNumber,
    loggedUser,
    userName,

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
    key,
    setKey,
    setLoggedUser,
  } = useContext(store);
  const navigate = useNavigate();
  const [isEditProfile, setIsEditProfile] = useState(false);

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
    setDob(e.target.value);
  };
  const handleAccNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
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
  //   const updateProfile = (e) => {
  //     e.preventDefault();
  //     if (userName) {
  //       setuserName(userName);

  //       if (loggedUser) {
  //         const user = JSON.parse(sessionStorage.getItem(loggedUser));
  //         //   console.log(user);
  //         user.UserName = userName;
  //         sessionStorage.setItem(loggedUser, JSON.stringify(user));
  //       }
  //       //   setLoggedUser(JSON.parse(sessionStorage.getItem(loggedUser)).UserName);

  //       console.log(userName);
  //       setIsEditProfile(false);
  //     }
  //     setuserName("");
  //   };

  const updateProfile = (e) => {
    e.preventDefault();
    if (userName) {
      // console.log(userName);
      const userData = JSON.parse(sessionStorage.getItem(document.cookie));
      console.log(userData);

      userData.UserName = userName;
      userData.Age = age;
      userData.DOB = dob;
      userData.AccountNumber = accNumber;
      userData.Card = card;
      userData.CVV = cvv;
      userData.ExpireDate = expireDate;
      console.log(userData.UserName, userData.Age);
      sessionStorage.setItem(document.cookie, JSON.stringify(userData));

      //   setLoggedUser(
      //     JSON.parse(sessionStorage.getItem(parseInt(document.cookie)).UserName)
      //   );
      setUserName("");
      // setAccNumber("");
      setAge("");
      // setDob("");
      // setCard("");
      // setCvv("");
      // setExpireDate("");
      setIsEditProfile(false);
    }
  };

  const editProfile = () => {
    setIsEditProfile(true);
  };

  const gotoTransferPage = () => {
    navigate("/transferPage");
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

  useEffect(() => {
    const storedUserName = JSON.parse(
      sessionStorage.getItem(document.cookie)
    ).userName;
    setUserName(storedUserName);
  }, [setUserName, sessionStorage, document.cookie]);

  return (
    <div className="w-screen fixed flex font-serif">
      <div className="w-1/4 h-screen flex flex-col  space-y-2  border-box text-2xl font-serif">
        <h1 className="w-full bg-black text-white p-2 border-box">Profile</h1>
        <h1 onClick={gotoTransferPage} className="hover:border-b-2 p-2">
          Payment Page
        </h1>
      </div>
      {isEditProfile ? null : (
        <div className="w-3/4 h-screen bg-red-100 p-5  border-box  flex flex-col  ">
          <div className="h-auto w-3/4 font-['Open-Sans'] mb-[2rem] pl-2 border-box">
            <div className="flex w-1/2 items-center space-x-2 ">
              <h1 className="w-1/2">User Name</h1>
              <h1 className=" text-xl w-1/2 text-left">
                {JSON.parse(sessionStorage.getItem(document.cookie)).UserName}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Age</h1>
              <h1 className=" text-xl text-left w-1/2">
                {JSON.parse(sessionStorage.getItem(document.cookie)).Age}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Account Number</h1>
              <h1 className=" text-xl text-left w-1/2">
                {
                  JSON.parse(sessionStorage.getItem(document.cookie))
                    .AccountNumber
                }
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Mobile Number</h1>
              <h1 className=" text-xl text-left w-1/2">
                {JSON.parse(sessionStorage.getItem(document.cookie)).Mobile}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Date of Birth</h1>
              <h1 className=" text-xl text-left w-1/2">
                {" "}
                {JSON.parse(sessionStorage.getItem(document.cookie)).DOB}
              </h1>
            </div>
          </div>

          <div className="w-3/4">
            <button
              onClick={editProfile}
              className="w-full border-2 outline-none  p-4 pt-2 pb-2 rounded-xl border-box bg-white hover:border-black "
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
      {isEditProfile ? (
        <form
          action="submit"
          onSubmit={updateProfile}
          className="w-3/4 bg-red-100 p-5 border-box items-center flex flex-col  font-['Open-Sans'] justify-center space-y-2 "
        >
          <button
            onClick={cancelEdit}
            className="fixed top-[1vh] left-[90vw] border bg-white p-2 pl-4 pr-4 border-box font-extralight hover:font-bold rounded-full"
          >
            Cancel
          </button>
          <div className="flex flex-wrap  space-x-2 w-3/6">
            <input
              className="block  w-1/2  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              value={userName}
              onChange={handleUserName}
              placeholder="Enter User Name"
              required
            />
            <input
              className="block  w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="tel"
              value={age}
              maxLength={3}
              onChange={handleAge}
              placeholder="Enter Age"
              required
            />
          </div>
          <div className="flex flex-wrap  space-x-2 w-3/6">
            <input
              className="block w-1/3   px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="date"
              value={dob}
              onChange={handleDob}
              placeholder="Date of Birth"
              required
            />
            {/* <MdAccountCircle className="relative z-10 left-[17vw] top-[1vh]  text-2xl" /> */}
            <input
              type="tel"
              value={accNumber}
              onChange={handleAccNumber}
              className="block px-4 py-2 mb-3 w-3/6  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter Account Number"
              required
            />
          </div>
          <div className=" flex flex-wrap  space-x-2 w-3/6">
            <input
              type="tel"
              readOnly
              value={document.cookie}
              required
              className="block px-4 py-2 mb-3 w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              value={card}
              onChange={handleCardNumber}
              required
              placeholder="Enter Card Details"
              className="block px-4 py-2 mb-3 w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className=" flex flex-wrap  space-x-2 w-3/6">
            <input
              type="tel"
              value={cvv}
              placeholder="CVV"
              onChange={handleCvv}
              required
              className="block px-4 py-2 mb-3 w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={expireDate}
              onChange={handleExpireDate}
              placeholder="MM/YY"
              required
              className="block px-4 py-2 mb-3 w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-3/6">
            <input
              type="button"
              value="Confirm"
              required
              onClick={updateProfile}
              className="block px-4 py-2 mb-3 w-1/2 left-[12.5vw] relative text-white  bg-green-400 border-2 hover:border-white rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default memo(Profile);
