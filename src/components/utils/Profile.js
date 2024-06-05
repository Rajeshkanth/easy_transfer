import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../../App";
import ProfileForm from "../forms/ProfileForm";
import axios from "axios";
import { IoIosWallet } from "react-icons/io";

function Profile() {
  const {
    userName,
    setExpireDateFromDb,
    userNameFromDb,
    setAccFromDb,
    setDobFromDb,
    setCardFromDb,
    setCvvFromDb,
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
    setUserNameFromDb,
    setAgeFromDb,
  } = useContext(store);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const editProfile = () => {
    setIsEditProfile(true);
  };

  const extractFirstName = (fullName) => {
    if (!fullName) {
      return "";
    }
    const seperatedNames = fullName.split(" ");
    return seperatedNames[0];
  };

  useEffect(() => {
    const loggedNumber = sessionStorage.getItem("mobileNumber");
    if (connectionMode !== "socket") {
      axios
        .post(
          "http://localhost:8080/api/user/checkUserName",
          {
            mobileNumber: loggedNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.userName);
            setAgeFromDb(response.data.age);
            setDobFromDb(response.data.dob);
            setCardFromDb(response.data.card);
            setCvvFromDb(response.data.cvv);
            setExpireDateFromDb(response.data.expireDate);
            setAccFromDb(response.data.accNum);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="w-full md:w-72 md:max-w-md xl:w-96 h-48 lg:h-48 bg-white border border-gray-200 rounded-lg shadow-md pt-0 flex justify-evenly font-poppins md:mb-8 xl:mb-9 m-auto box-border">
      <div className="w-1/2 flex flex-col items-center pb-10 border-r border-slate-200 pt-12 justify-center">
        <h2 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {userNameFromDb ? extractFirstName(userNameFromDb) : null}
        </h2>
        <span className="text-sm md:text-sm w-fit text-gray-800">
          {accFromDb
            ? accFromDb.slice(-4).padStart(accFromDb.length, "x")
            : null}
        </span>
        <div className="flex mt-4 md:mt-6">
          <button
            onClick={editProfile}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-400"
          >
            Edit profile
          </button>
        </div>
      </div>
      <div className="w-1/2 text-gray-800 flex flex-col gap-3 items-center justify-center">
        <IoIosWallet className="text-3xl" />
        <span className="text-3xl md:text-3xl font-bold">₹1000</span>
        <h2 className="text-sm sm:text-base text-gray-700">
          Available Balance
        </h2>
      </div>
      {isEditProfile ? (
        <div className="h-screen w-screen fixed top-0 left-0 bg-transparent backdrop-blur-sm z-100 px-8 pt-16 md:pt-0 flex justify-center items-center">
          <ProfileForm
            states={{
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
              mobileNumber,
              setMobileNumber,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default memo(Profile);
