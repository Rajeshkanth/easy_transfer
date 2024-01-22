import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
// import { IoIosCheckboxOutline } from "react-icons/io";
import { CiBookmarkCheck } from "react-icons/ci";
import { RiMenuFoldFill } from "react-icons/ri";
import { useNavigate } from "react-router";

function Beneficiaries() {
  const {
    socket,
    connectionMode,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    userNameFromDb,
  } = useContext(store);

  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [sessionTiemedOut, setSessionTiemedOut] = useState(false);
  const [savedAccNum, setSavedAccNum] = useState("");
  const [savedBeneficiaryName, setSavedBeneficiaryName] = useState("");
  const [savedIfsc, setSavedIfsc] = useState("");
  const [savedAcc, setSavedAcc] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const profile = () => {
    setIsProfileClicked(true);
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };
  const navigateToProfile = () => {
    navigate("/profile");
  };

  const logout = () => {
    setLoggedUser("");
    navigate("/");
  };

  const gotoTransferPage = () => {
    navigate("/transferPage");
  };

  const handleSavedAccNum = (e) => {
    setSavedAccNum(e.target.value);
  };
  const handleSavedBenificiaryName = (e) => {
    setSavedBeneficiaryName(e.target.value);
  };

  const handleSavedIfsc = (e) => {
    setSavedIfsc(e.target.value);
  };

  const edit = (index) => {
    setSavedAcc((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          setIsEdit(true);
          return { ...item, editable: true };
        } else {
          setIsEdit(false);
          return item;
        }
      })
    );
  };

  const save = (index) => {
    // setIsEdit(true);
    setSavedAcc((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          setIsEdit(false);
          return { ...item, editable: false };
        } else {
          setIsEdit(true);
          return item;
        }
      })
    );
  };

  const saveBeneficiary = () => {
    const savedDetail = {
      SavedBeneficiaryName: savedBeneficiaryName,
      SavedAccNum: savedAccNum,
      SavedIfsc: savedIfsc,
      editable: false,
    };
    if (savedBeneficiaryName && savedAccNum && savedIfsc) {
      if (connectionMode !== "socket") {
      } else {
        socket.emit("saveNewBeneficiary", {
          SavedBeneficiaryName: savedBeneficiaryName,
          SavedAccNum: savedAccNum,
          SavedIfsc: savedIfsc,
          editable: false,
          num: document.cookie,
        });
      }

      setSavedAcc((prev) => [...prev, savedDetail]);
      setSavedBeneficiaryName("");
      setSavedAccNum("");
      setSavedIfsc("");
    }
  };
  useEffect(() => {
    if (connectionMode === "socket") {
      socket.emit("saveAccounts", {
        num: document.cookie,
      });
    }
  }, [socket, connectionMode]);

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.on("getSavedBeneficiary", (data) => {
        const savedDetail = {
          SavedBeneficiaryName: data.SavedBeneficiaryName,
          SavedAccNum: data.SavedAccNum,
          SavedIfsc: data.SavedIfsc,
          editable: data.editable,
        };
        setSavedAcc((prev) => [...prev, savedDetail]);
      });
    }
  }, [savedAcc, socket]);
  return (
    <>
      <div className="h-screen w-screen  bg-gradient-to-r   from-blue-100 to-red-200">
        {sessionTiemedOut ? null : (
          <div
            className={
              windowWidth < 600
                ? "p-2 pl-8 pr-8 text-white font-bold   border-box fixed   w-1/8 flex items-center space-x-2"
                : "p-2 pl-8 pr-8 text-white font-bold   border-box fixed mt-[1rem]   w-1/8 flex items-center space-x-2"
            }
          >
            <AiOutlineMenuUnfold
              onClick={profile}
              className="text-3xl text-black"
            />
            <button className=" text-xl text-black">
              {userNameFromDb !== "" ? userNameFromDb : document.cookie}
            </button>
          </div>
        )}
        {isProfileClicked ? (
          <>
            <div
              className="w-1/2 sm:w-1/2 md:w-[33%] lg:w-1/4 bg-transparent backdrop-blur-xl border-r-1 border-white h-screen font-serif fixed text-black"
              // className={
              // windowWidth < 780
              // ? "w-1/2 h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
              // : " sm:w-[33vw]  h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
              // }
            >
              <div className=" pt-2 pb-8 border-box h-[85vh]  ">
                <div className="flex justify-between items-center border-b-2 border-white    cursor-pointer ">
                  <h1 className="ml-[2rem] text-2xl font-bold ">Dashboard</h1>
                  <p className=" mr-[1rem]  " onClick={closeProfile}>
                    <RiMenuFoldFill />
                  </p>
                </div>
                <div className="space-y-2 flex  flex-col items-left pl-9 pt-5 border-box border-white text-2xl    cursor-pointer ">
                  <h1
                    className="hover:font-bold hover:border-b-2 border-white"
                    onClick={gotoTransferPage}
                  >
                    Back
                  </h1>
                  <h1
                    className="hover:font-bold hover:border-b-2 border-white"
                    onClick={navigateToProfile}
                  >
                    Profile
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
                </div>
              </div>

              <div className=" h-[8vh] sm:h-[10vh] flex items-center">
                <button
                  className={
                    "block w-1/2  px-4 py-2 m-auto ml-[10vw] mb-5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-500 hover:cursor-pointer"
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
        <div className="lg:space-x-2 w-[70vw] h-[auto] gap-1  border-l-2 border-white pt-[1.4rem] px-2 pl-[2vw] box-border font-sans flex flex-wrap ml-[25vw]">
          <input
            type="text"
            placeholder="Enter Beneficiary Name"
            value={savedBeneficiaryName}
            onChange={handleSavedBenificiaryName}
            className="block px-4 py-2 border mb-3 border-gray-300 bg-slate-100 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter Account Number"
            value={savedAccNum}
            onChange={handleSavedAccNum}
            className="block  px-4 py-2 border mb-3 border-gray-300 bg-slate-100 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter IFSC Code"
            value={savedIfsc}
            onChange={handleSavedIfsc}
            className="block px-4 py-2 border mb-3 border-gray-300 bg-slate-100 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="button"
            value="Save"
            onClick={saveBeneficiary}
            className="block w-[20%] px-4 py-2 box-border border border-gray-300 text-white mb-3    bg-green-600 rounded-md focus:outline-none cursor-pointer "
          />
          {/* <input type="text" placeholder="Enter Beneficiary Name" /> */}
        </div>
        <div className="border-2 h-[100vh] w-[75%] border-white ml-[25vw]">
          <div>
            <li className="flex  pl-[2rem]  border-b-2 pb-[1rem] items-center border-white pt-[1rem]  space-x-2 box-border ">
              <h1 className="w-[24.3%] font-bold">Name</h1>
              <h1 className="w-[24.3%] font-bold">Account Number</h1>
              <h1 className="w-[24.3%] font-bold">IFSC Code</h1>
            </li>
            <ul className=" ">
              {savedAcc.map((item, index) => (
                <li
                  key={index}
                  className="flex space-x-2 border-b-2  pl-[2rem] h-[8vh] border-white  box-border items-center "
                >
                  <h1
                    className="w-[30%] capitalize contentEditable:bg-magenta-300 caret:text-white focus:outline-none"
                    contentEditable={item.editable}
                  >
                    {item.SavedBeneficiaryName}
                  </h1>
                  <h1
                    className="w-[30%]   contentEditable:bg-magenta-300  focus:outline-none"
                    contentEditable={item.editable}
                  >
                    {item.SavedAccNum}
                  </h1>
                  <h1
                    className="w-[30%]  uppercase contentEditable:bg-magenta-300  focus:outline-none"
                    contentEditable={item.editable}
                  >
                    {item.SavedIfsc}
                  </h1>

                  <div className="w-[30%] items-center flex space-x-3">
                    <button className=" px-4 py-2 w-1/2  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer">
                      Send
                    </button>
                    {isEdit ? (
                      <CiBookmarkCheck
                        className="text-2xl cursor-pointer hover:text-green-600 "
                        onClick={() => save(index)}
                      />
                    ) : (
                      <MdEdit
                        className=" text-2xl hover:text-white cursor-pointer"
                        onClick={() => edit(index)}
                      />
                    )}
                    {/* {isEdit ? (
                      <IoIosCheckboxOutline onClick={save} />
                    ) : (
                      <MdEdit
                        className=" text-2xl "
                        onClick={() => edit(index)}
                      />
                    )} */}
                    <MdDeleteOutline className=" text-2xl text-red-600" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Beneficiaries;
