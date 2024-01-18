import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { useNavigate } from "react-router";
import axios from "axios";

function Profile() {
  const {
    userName,
    userNameFromDb,
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
    setDob(value);
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

  const updateProfile = async (e) => {
    e.preventDefault();
    if (connectionMode !== "socket") {
      if (userName) {
        // console.log(userName);
        // const userData = JSON.parse(sessionStorage.getItem(document.cookie));
        // console.log(userData);

        // userData.UserName = userName;
        // userData.Age = age;
        // userData.DOB = dob;
        // userData.AccountNumber = accNumber;
        // userData.Card = card;
        // userData.CVV = cvv;
        // userData.ExpireDate = expireDate;
        // console.log(userData.UserName, userData.Age);
        // sessionStorage.setItem(document.cookie, JSON.stringify(userData));
        const userData = document.cookie;

        const response = await axios.post(
          "https://polling-server.onrender.com/updateProfile",
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
          const { userName, age, dob, accNumber } = response.data;

          setUserNameFromDb(userName);
          setAccFromDb(accNumber);
          setAgeFromDb(age);
          setDobFromDb(dob);
          setIsEditProfile(false);
          setUserName("");
          setAge("");
        } else if (response.status === 500) {
          console.log("userName not updated");
        }
      }
    } else {
      if (userName) {
        const regNum = document.cookie;
        socket.emit("updateProfile", {
          num: regNum,
          name: userName,
        });

        socket.on("profileUpdated", (data) => {
          setUserNameFromDb(data.userName);

          setUserName("");
        });
        setIsEditProfile(false);
      }
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
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
          } else {
            setUserNameFromDb("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      socket.emit("checkUserName", {
        regNumber: document.cookie,
      });
      socket.on("userNameAvailable", (data) => {
        setUserNameFromDb(data.user);
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
      });
    }

    // return () => {
    //   setUserNameFromDb("");
    // };
  }, [socket, connectionMode, setUserNameFromDb]);

  return (
    <div className=" w-screen fixed block h-[10vh] sm:flex font-serif">
      <div className="w-screen sm:w-1/4 h-[10vh]  sm:h-screen flex sm:flex-col  sm:space-y-2  border-box text-2xl font-serif">
        <h1 className=" w-[50%]  sm:w-full bg-black items-center  text-white p-2 border-box ">
          Profile
        </h1>
        <h1
          onClick={gotoTransferPage}
          className="hover:border-b-2 p-2 w-[50%] text-right items-center sm:text-left sm:items-none sm:w-full sm:text-xl md:w-auto"
        >
          Payment Page
        </h1>
      </div>
      {isEditProfile ? null : (
        <div className="w-screen sm:w-3/4 h-screen bg-red-100 p-5  border-box  flex flex-col  ">
          <div className="h-auto w-3/4 font-['Open-Sans'] mb-[2rem] pl-2 border-box">
            <div className="flex w-full sm:w-1/2 items-center space-x-2 ">
              <h1 className="w-1/2">User Name</h1>
              <h1 className=" text-xl w-1/2 text-left">
                {/* {JSON.parse(sessionStorage.getItem(document.cookie)).UserName} */}
                {userNameFromDb}
              </h1>
            </div>
            {/* <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Age</h1>
              <h1 className=" text-xl text-left w-1/2">
                {JSON.parse(sessionStorage.getItem(document.cookie)).Age}
                {ageFromDb}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Account Number</h1>
              <h1 className=" text-xl text-left w-1/2">
                {
                  JSON.parse(sessionStorage.getItem(document.cookie))
                    .AccountNumber
                }
                {accFromDb}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Mobile Number</h1>
              <h1 className=" text-xl text-left w-1/2">
                {JSON.parse(sessionStorage.getItem(document.cookie)).Mobile}
                {mobileFromDb}
              </h1>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <h1 className="w-1/2">Date of Birth</h1>
              <h1 className=" text-xl text-left w-1/2">
                {" "}
                {JSON.parse(sessionStorage.getItem(document.cookie)).DOB}
                {dobFromDb}
              </h1>
            </div> */}
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
          className="w-full h-screen sm:w-[90%] md:w-3/4 bg-red-100 p-5 border-box items-center flex flex-col  font-['Open-Sans'] justify-center sm:space-y-2 "
        >
          <button
            onClick={cancelEdit}
            className="fixed top-[87.4vh] left-[50vw] sm:top-[1vh] sm:left-[90vw] w-[46%] sm:w-auto border bg-white p-2 pl-4 pr-4 border-box font-extralight hover:font-bold rounded-md sm:rounded-full"
          >
            Cancel
          </button>
          <div className="sm:flex flex-wrap  sm:space-x-2 w-full sm:w-full md:w-[80%]">
            <input
              className="block w-full sm:w-1/2  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              value={userName}
              onChange={handleUserName}
              placeholder="Enter User Name"
              required
            />
            <input
              className="block  w-full sm:w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="tel"
              value={age}
              maxLength={3}
              onChange={handleAge}
              placeholder="Enter Age"
              required
            />
          </div>
          <div className="sm:flex flex-wrap  sm:space-x-2  w-full sm:w-full md:w-[80%]">
            <input
              className="block w-full sm:w-1/3   px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
              className="block px-4 py-2 mb-3  w-full sm:w-3/6  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter Account Number"
              required
            />
          </div>
          <div className=" flex flex-wrap  sm:space-x-2  w-full sm:w-full md:w-[80%]">
            <input
              type="tel"
              readOnly
              value={document.cookie}
              required
              className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              value={card}
              onChange={handleCardNumber}
              required
              placeholder="Enter Card Details"
              className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className=" sm:flex flex-wrap  sm:space-x-2 w-full sm:w-full md:w-[80%]">
            <input
              type="tel"
              value={cvv}
              placeholder="CVV"
              onChange={handleCvv}
              required
              className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={expireDate}
              onChange={handleExpireDate}
              placeholder="MM/YY"
              required
              className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className=" w-full sm:w-full md:w-[80%]">
            <input
              type="button"
              value="Confirm"
              required
              onClick={updateProfile}
              className="block px-4 py-2 mb-3 w-1/2 sm:left-[12.5vw] md:left-[19.5vw] relative text-white  bg-green-400 border-2 hover:border-white rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default memo(Profile);
