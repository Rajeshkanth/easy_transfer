import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { useNavigate } from "react-router";
import axios from "axios";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { RiMenuFoldFill } from "react-icons/ri";
function Profile() {
  const {
    userName,
    userNameFromDb,
    setUserNameFromDb,
    ageFromDb,
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
    setWindowWidth,
    windowWidth,
    setIsProfileClicked,
    isProfileClicked,
    setLoggedUser,
    accFromDb,
    dobFromDb,
    mobileFromDb,
  } = useContext(store);
  const navigate = useNavigate();
  const [isEditProfile, setIsEditProfile] = useState(false);

  const logout = () => {
    setLoggedUser("");
    navigate("/");
  };

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

  const updateProfile = async (e) => {
    e.preventDefault();
    if (connectionMode !== "socket") {
      if (userName) {
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
      }
    } else {
      if (userName) {
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
        });
        setIsEditProfile(false);
      }
    }
  };

  const editProfile = () => {
    setIsEditProfile(true);
  };
  const profile = () => {
    setIsProfileClicked(true);
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };

  const gotoTransferPage = () => {
    navigate("/transferPage");
  };

  const savedAccounts = () => {
    navigate("/savedAccounts");
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
  // const navigateToProfile = () => {
  //   navigate("/profile");
  // };

  // const closeProfile = () => {
  //   setIsProfileClicked(false);
  // };

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
            setAgeFromDb(response.data.age);
            setAgeFromDb(response.data.age);
            setDobFromDb(response.data.dob);
            setAccFromDb(response.data.accNum);
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
        setAgeFromDb(data.age);
        setDobFromDb(data.dob);
        setAccFromDb(data.accNum);
        // setCard(data.card);
        // setCvv()
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
        setAgeFromDb("");
      });
    }

    // return () => {
    //   setUserNameFromDb("");
    // };
  }, [socket, connectionMode, setUserNameFromDb]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <div className=" w-screen fixed block h-[100vh] sm:flex bg-gradient-to-r  from-cyan-300  to-blue-300">
      <div
        className={
          windowWidth < 600
            ? "p-2 pl-8 pr-8 text-white font-bold   border-box absolute   w-1/8 flex items-center space-x-2"
            : "p-2 pl-8 pr-8 text-white font-bold   border-box absolute mt-[1rem]   w-1/8 flex items-center space-x-2"
        }
      >
        <AiOutlineMenuUnfold
          onClick={profile}
          className="text-3xl text-black"
        />
        <button className=" text-xl text-black">Menu</button>
      </div>

      {isProfileClicked ? (
        <>
          <div className="w-1/2 z-10 sm:w-[28%] md:w-[25%] bg-transparent backdrop-blur-xl  h-screen border-r-2 border-white fixed text-black">
            <div className=" pt-2 pb-8 border-box  h-[85vh] ">
              <div className="flex justify-between items-center pb-2 border-box font-sans border-b-2 border-white  cursor-pointer ">
                <h1 className="ml-[2.2rem] text-2xl font-bold ">Menu</h1>
                <p className=" mr-[1rem]  " onClick={closeProfile}>
                  <RiMenuFoldFill />
                </p>
              </div>
              <div className="space-y-2 flex  flex-col items-left font-sans pl-9 pt-5 border-box text-2xl cursor-pointer ">
                <h1
                  className="hover:font-bold hover:border-b-2 border-white"
                  onClick={gotoTransferPage}
                >
                  Back
                </h1>
                <h1 className="hover:font-bold hover:border-b-2 border-white">
                  Rewards
                </h1>
                <h1 className="hover:font-bold hover:border-b-2 border-white">
                  Contact us
                </h1>
                <h1 className="hover:font-bold hover:border-b-2 border-white">
                  Transactions
                </h1>
                <h1
                  className="hover:font-bold hover:border-b-2 border-white"
                  onClick={savedAccounts}
                >
                  Saved Beneficiaries
                </h1>
              </div>
            </div>

            <div className=" h-[8vh] sm:h-[15vh] flex items-center">
              <button
                className={
                  "block w-1/2  px-4 py-2 m-auto ml-[10vw] mb-5 border-2 border-white rounded-md focus:outline-none focus:border-blue-500 bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer"
                  // windowWidth < 780
                  //   ? "bg-green-500  rounded-full p-2 pl-8 pr-8 border-box text-white z-[10] left-[19vw] sm:left-[25vw] mt-[1vh]   font-light fixed  sm:w-1/8 hover:bg-blue-500 hover:border"
                  //   : "bg-green-500  rounded-full p-2 pl-8 pr-8 text-white z-[10]  left-[18vw] mt-[0vh] font-light fixed  w-1/8 hover:bg-blue-500 hover:border"
                }
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </div>
        </>
      ) : null}
      {/* ) : null} */}
      {isEditProfile ? null : (
        <div>
          <div
            className={
              windowWidth < 640
                ? "h-[150px] w-[150px] fixed bg-gradient-to-r  from-blue-300 to-cyan-300 rounded-full border-2  border-white ml-[25%] m-auto mt-[10vh]"
                : "h-[150px] w-[150px] fixed bg-gradient-to-r  from-blue-300 to-cyan-300 rounded-full border-2  border-white ml-[75vw] mt-[10vh]"
            }
          ></div>
          <div className="w-screen  h-[20vh]"></div>
          <div
            className={
              windowWidth < 640
                ? "w-screen  h-screen bg-gradient-to-r from-cyan-300 to-blue-300  border-box  border-t-2  sm:border-2 sm:border-r-0 border-white ml-[0] pt-[4rem] p-[2rem] flex flex-col  "
                : "w-[75.5vw]  h-screen bg-gradient-to-r from-cyan-300 to-blue-300  border-box  border-2  border-r-0 border-white font-serif ml-[24.5vw] pt-[4rem] p-[2rem]  flex flex-col  "
            }
          >
            <div className="h-auto w-auto font-['Open-Sans'] mb-[2rem]  mt-[4rem] sm:mt-0 border-box">
              <div className="flex w-full sm:w-1/2 items-center space-x-2 ">
                <h1 className="w-1/2 text-xl">Name</h1>
                <h1 className=" text-xl w-1/2 text-left">
                  {/* {JSON.parse(sessionStorage.getItem(document.cookie)).UserName} */}
                  {userNameFromDb}
                </h1>
              </div>
              <div className="flex items-center w-full sm:w-1/2 space-x-2">
                <h1 className="w-1/2 text-xl">Age</h1>
                <h1 className=" text-xl text-left w-1/2">
                  {/* {JSON.parse(sessionStorage.getItem(document.cookie)).Age} */}
                  {ageFromDb}
                </h1>
              </div>
              <div className="flex items-center w-full sm:w-1/2 space-x-2">
                <h1 className="w-1/2 text-xl">Account Number</h1>
                <h1 className=" text-xl text-left w-1/2">{accFromDb}</h1>
              </div>
              {/* <div className="flex items-center w-1/2 space-x-2">
                <h1 className=" text-xl text-left w-1/2">{mobileFromDb}</h1>
              </div> */}
              <div className="flex items-center w-full sm:w-1/2 space-x-2">
                <h1 className="w-1/2 text-xl">Date Birth</h1>
                <h1 className=" text-xl text-left w-1/2">{dobFromDb}</h1>
              </div>
              {/* <div className="flex items-center w-1/2 space-x-2">
                <h1 className="w-1/2 text-xl">Card</h1>
                <h1 className=" text-xl text-left w-1/2">{cardFromDb}</h1>
              </div>
              <div className="flex items-center w-1/2 space-x-2">
                <h1 className="w-1/2 text-xl">Card</h1>
                <h1 className=" text-xl text-left w-1/2">{cardFromDb}</h1>
              </div> */}
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

            <div className="w-full sm:w-3/4 ">
              <button
                onClick={editProfile}
                className="w-full sm:w-1/2  outline-none  p-4 pt-2 pb-2  rounded border-box bg-white hover:border-black "
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditProfile ? (
        <form
          action="submit"
          onSubmit={updateProfile}
          className="w-full sm:w-full h-screen sm:w-[90%] md:w-3/4  sm:ml-[25vw] bg-blue-650 p-5 border-box items-center flex flex-col  font-['Open-Sans'] justify-center sm:space-y-2 "
        >
          {windowWidth < 640 ? null : (
            <button
              onClick={cancelEdit}
              className="fixed  sm:top-[1vh] sm:left-[86vw] w-[46%] sm:w-auto border bg-white p-2 pl-4 pr-4 border-box font-extralight hover:font-bold rounded-md sm:rounded-md"
            >
              Cancel
            </button>
          )}
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
          <div className=" w-full sm:w-full flex md:w-[80%]">
            <input
              type="button"
              value="Confirm"
              required
              onClick={updateProfile}
              className="block px-4 py-2 mb-3 w-1/2  sm:left-[12.5vw] md:left-[19.8vw] lg:w-[50%] relative text-white  bg-green-400 border-2 border-white rounded-md focus:outline-none "
            />
            {windowWidth < 640 ? (
              <button
                onClick={cancelEdit}
                className="relative block px-4 py-2 mb-3 w-1/2   sm:left-[12.5vw] md:left-[19.5vw] relative text-black  bg-white border-2 hover:border-white rounded-md focus:outline-none focus:border-blue-500"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default memo(Profile);
