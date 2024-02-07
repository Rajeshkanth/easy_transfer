import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { FaRupeeSign } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosWallet } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
function Profile() {
  const {
    recentTransactionsLength,
    setRecentTransactionsLength,
    savedAcc,
    recentTransactions,
    setRecentTransactions,
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
    setWindowWidth,
    windowWidth,
    setIsProfileClicked,
    isProfileClicked,
    setLoggedUser,
    accFromDb,
    dobFromDb,
    mobileFromDb,
    setSavedAcc,
    balance,
    setBalance,
    savedAccLength,
  } = useContext(store);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [img, setImg] = useState(null);

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

  const setProfilePic = (e) => {
    const value = e.target.files[0];

    setImg(URL.createObjectURL(value));
  };

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries", { state: { prevPath: location.pathname } });
        break;
      case "Rewards":
        console.log("Navigating to Rewards page");
        break;
      case "Contact":
        console.log("Navigating to Contact page");
        break;
      case "Transactions":
        console.log("Navigating to Transactions page");
        break;
      case "Menu":
        setSavedAcc([]);
        setIsProfileClicked(true);
        break;
      case "Log out":
        logout();
        break;
      default:
        console.log(`Unknown menu item: ${menuItem}`);
    }
  };

  const getMenuProps = () => {
    if (windowWidth > 1024) {
      return {
        nav: [
          "Back",
          "Beneficiaries",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: ["Back", "Beneficiaries", "Rewards", "Transactions", "Log Out"],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: ["Back", "Beneficiaries", "Menu"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav: [
        "Back",
        "Beneficiaries",
        "Rewards",
        "Contact",
        "Transactions",
        "Log out",
      ],
      onClickHandler: handleMenuClick,
    };
  };

  const sideBarProps = getSideBarProps();
  const updateProfile = async (e) => {
    e.preventDefault();
    if (connectionMode !== "socket") {
      if (userName && age && accNumber && card && cvv && expireDate) {
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
        });
        setIsEditProfile(false);
      } else {
        alert("Enter your details");
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
    navigate("/Beneficiaries");
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

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.emit("getTransactionDetails", {
        num: document.cookie,
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      if (connectionMode !== "socket") {
      } else {
        socket.on("transactionDetailsFromDb", (data) => {
          setRecentTransactions((prev) => [...prev, data]);
        });

        socket.on("transactionDetailsFromDb", (data) => {
          const transaction = {
            Date: data.Date,
            Name: data.Name,
            Status: data.Status,
            Amount: data.Amount,
          };

          setRecentTransactions((prev) => [...prev, transaction]);
        });
        const length = recentTransactions.length;
        setRecentTransactionsLength(length);
      }
    };
    fetchData();

    return () => {
      if (connectionMode !== "socket") {
      } else {
        socket.off();
        setRecentTransactions([]);
      }
    };
  }, []);

  return (
    <>
      <div className=" w-screen  lg:fixed flex flex-col text-white font-poppins pt-2 h-screen sm:flex box-border bg-gray-800">
        {windowWidth < 768 ? (
          <div className="fixed  bg-gray-800 h-[10vh] w-screen flex items-center top-0 z-10">
            <Menu {...menuProps} onClickHandler={handleMenuClick} />
          </div>
        ) : (
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        )}
        {isEditProfile ? null : (
          <div className="bg-slate-100  w-screen text-gray-700 h-auto flex flex-col  md:h-screen box-border md:grid md:grid-cols-4  md:gap-0 lg:gap-4 md:pb-2 md:pl-[3vw] lg:pl-[4vw] xl:pl-[5vw] md:pt-6 ">
            <>
              <div className="h-[50vh] md:h-[35vh] lg:h-[40vh] md:w-[20vw] border-b-2 md:border-b-0  items-center justify-center bg-white md:md:shadow-md shadow-gray-300 rounded-md">
                <div className=" h-[150px] w-[150px] md:h-[120px] md:w-[120px] lg:w-[120px] lg:h-[w-120px] xl:h-[200px] xl:w-[200px] bg-white  absolute lg:fixed top-[12vh]  md:top-[16vh] lg:top-[17vh] xl:top-[15vh] z-5 overflow-hidden shadow-lg left-[10vw] sm:left-[12vw] md:left-[5vw] lg:left-[8vw] xl:left-[8vw] rounded-full border-2 border-gray-600">
                  {
                    <>
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={img}
                        alt=""
                      />
                      <div className="absolute inset-0  opacity-30"></div>
                      <p className="absolute inset-0 opacity-0 flex items-center justify-center text-white">
                        Edit
                      </p>
                      <input
                        id="profilePicInput"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={setProfilePic}
                      />
                    </>
                  }
                </div>
                {windowWidth < 640 ? (
                  <div className="w-1/2 absolute h-[10vh]  top-[40vh] grid grid-rows-2  left-[15vw]">
                    <h1 className="flex items-center   font-bold text-2xl">
                      {userNameFromDb} <MdModeEdit onClick={editProfile} />
                    </h1>
                    <h1>{document.cookie}</h1>
                  </div>
                ) : null}
                {windowWidth > 640 ? (
                  <div className="grid grid-rows-2 gap-8 md:gap-7 lg:gap-8 h-[10%] w-full mt-[35vh] md:mt-[25vh] lg:mt-[28vh] xl:mt-[30vh] pl-[0vw] md:pl-[4vw] lg:ml-[1vw] xl:ml-[2vw] item-center m-auto text-gray-700">
                    <h1 className=" text-2xl pl-[12vw] md:pl-1  lg:pl-2 xl:pl-2 grid grid-cols-2 gap-[10px] md:gap-[80px] lg:gap-10 items-center font-extrabold  w-[82%] sm:w-1/2 md:w-[60%]  lg:w-3/4 text-center sm:text-center">
                      {userNameFromDb} <MdModeEdit onClick={editProfile} />
                    </h1>
                    <h1 className=" text-lg font-lighter   w-[82%] sm:w-[47%] md:w-1/2 text-center sm:text-center">
                      {document.cookie}
                    </h1>
                  </div>
                ) : null}
              </div>
              <div className="h-[20vh]  grid md:block  md:w-[20vw] border-b-2 md:border-b-0 pb-2  md:pb-[8rem] xl:pb-0 bg-white space-y-2 box-border pt-[3vh] pl-[15vw] md:pl-[2vw] pr-[2vw] md:items-center md:justify-center md:shadow-md shadow-gray-300 rounded-md grid-rows-3">
                <h1 className="text-4xl font-bold">124</h1>
                <h1 className="md:border-b-2  md:text-sm lg:text-md pb-[2vh]">
                  Total Transactions
                </h1>
                <h1 className="text-md flex items-center justify-between hover:cursor-pointer ">
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-[20vh]  grid grid-rows-3 md:block md:w-[20vw] border-b-2 md:border-b-0 pb-2  md:pb-[8rem] xl:pb-0 md:pb-0 bg-white box-border md:shadow-md shadow-gray-300 rounded-md space-y-2 pt-[3vh] pl-[15vw] md:pl-[2vw] pr-[2vw] md:items-center md:justify-center ">
                <h1 className="text-4xl font-bold">{savedAccLength}</h1>
                <h1 className="md:border-b-2  md:text-sm lg:text-md pb-[2vh]">
                  Total Recipients
                </h1>
                <h1
                  className="text-md flex items-center justify-between hover:cursor-pointer "
                  onClick={() => navigate("/Beneficiaries")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-[20vh] grid grid-rows-3 md:block md:w-[20vw] border-b-2 md:border-b-0 pb-2 md:pb-[8rem]  xl:pb-0 box-border bg-white  md:shadow-md shadow-gray-300 rounded-md space-y-2 pt-[3vh] pl-[15vw] md:pl-[2vw] pr-[2vw] items-left md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">4</h1>
                <h1 className="md:border-b-2 md:text-sm lg:text-md pb-[2vh]">
                  Failed Transactions
                </h1>
                <h1 className="text-md flex items-center justify-between  ">
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-[31vh] md:h-[45vh] lg:h-[40vh]  border-b-2 pb-0 md:pb-0 md:w-[20vw] bg-white space-y-4 md:space-y-[5rem] flex flex-col pt-[1rem] md:pt-[4rem] items-center md:shadow-md shadow-gray-300 rounded-md">
                <div className="flex flex-col items-center space-y-2 justify-center">
                  <h1 className="m-0 text-4xl items-center flex justify-center border-2 rounded-full p-2 bg-slate-100">
                    <IoIosWallet />
                  </h1>
                  <h1 className="flex  font-extrabold text-2xl items-center">
                    <FaRupeeSign className="text-xl font-extrabold" /> {balance}
                  </h1>
                  <h1 className=" text-sm">Available Balance</h1>
                </div>
                <h1 className=" bg-slate-700 w-full h-[6vh] md:h-[6vh] lg:h-[6vh] text-white text-center flex items-center justify-center rounded-tr-none rounded-tl-none md:rounded-md">
                  Customer Support
                </h1>
              </div>
              <div className="h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[60vh] border-b-2 md:border-b-0 md:w-[28vw] lg:w-[30vw] xl:w-[31vw] md:pl-0 md:mt-[-4.5rem] lg:mt-[-7.5rem] xl:mt-[-9.5rem] bg-white space-y-2  md:space-y-1 pt-2 md:pt-4 md:shadow-md shadow-gray-300 rounded-md">
                <div className="grid grid-cols-2 gap-[10vw] md:gap-0 xl:gap-20  pl-4 md:pl-[2vw] ">
                  <h1 className="text-lg md:text-sm lg:text-xl ">Recipients</h1>
                  <h1
                    className="text-sm md:text-xs lg:text-md ml-[4vw] md:ml-[2vw] lg:ml-[4vw] flex items-center text-gray-900 hover:cursor-pointer"
                    onClick={() => navigate("/Beneficiaries")}
                  >
                    View more <IoIosArrowForward />
                  </h1>
                </div>
                <div className="grid   h-[50%] pt-[1vh]  md:h-[90%] lg:h-[90%] xl:h-full pl-[5vw] md:pl-[2vw] md:pt-[2vh] md:pb-[2vh]">
                  {savedAcc.slice(0, 6).map((item, index) => (
                    <div className="space-y-0  xl:h-[3vh]    leading-0">
                      <h1
                        key={index}
                        className="text-md  md:text-sm lg:text-md   capitalize "
                      >
                        {item.beneficiaryName}
                      </h1>
                      <h1 className="text-sm md:text-sm">{item.accNum}</h1>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[80vh] md:h-[55vh] lg:h-[60vh]  md:w-[38vw] lg:w-[37vw] xl:w-[33vw] border-b-2 md:border-b-0 overflow-y-auto md:mt-[-4.5rem]  lg:mt-[-7.5rem] xl:mt-[-9.5rem] md:ml-[7vw] lg:ml-[8vw] xl:ml-[11vw] space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
                <div className="grid grid-cols-3 md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-[6vh] pl-4 border-b-2  items-center">
                  <h1 className="text-sm  md:text-xs lg:text-md xl:text-xl  md:pr-0 border-r-2">
                    Recent Activity
                  </h1>
                  <h1 className="text-xs  lg:text-xs xl:text-sm pl-2">
                    {recentTransactions.length} Transactions
                  </h1>
                  <h1 className="text-xs md:text-xs xl:text-sm ml-[2vw] lg:ml-[4vw] flex items-center text-gray-200 hover:cursor-pointer">
                    View more <IoIosArrowForward />
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-6 p-1 space-y-0 items-center pl-[1.2vw] border-b-2 ">
                  <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-4 md:gap-0 lg:gap-0 xl:gap-0 pl-[5vw] md:pl-0">
                    <h1>Date</h1>
                    <h1>Description</h1>
                  </div>
                  <div className="grid grid-cols-2 text-sm md:text-md items-center gap-5 lg:gap-10 xl:gap-4">
                    {" "}
                    <h1 className="">Amount</h1>
                    <h1>Status</h1>
                  </div>
                </div>
                {recentTransactions.length < 1 ? (
                  <p className="flex items-center justify-center pt-[5rem]">
                    There is no recent transactions
                  </p>
                ) : (
                  recentTransactions.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-5  lg:gap-7 xl:gap-12 p-1 space-y-0 items-center pl-[5vw] md:pl-[1.2vw] pr-[2vw] border-b-2"
                    >
                      <div className="grid grid-cols-2 gap-6 lg:gap-2 xl:gap-6 items-center text-xs md:text-sm lg:text-md ">
                        <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                        <h1 className="md:text-xs lg:text-md">{`Sent to ${item.Name}`}</h1>
                      </div>
                      <div className="grid grid-cols-2 md:gap-5 lg:gap-10  text-xs md:text-sm lg:text-md  ">
                        <h1 className="md:text-xs lg:text-md">{item.Amount}</h1>
                        <h1
                          className={
                            item.Status === "completed"
                              ? "md:text-xs lg:text-md text-green-600"
                              : item.Status === "Canceled"
                              ? "md:text-xs lg:text-md text-gray-800"
                              : "md:text-xs lg:text-md text-gray-800"
                          }
                        >
                          {item.Status}
                        </h1>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>

            {/* {isEditProfile ? null : (
            <div className="w-screen h-auto">
              <div className="w-screen bg-gray-700 border-b-2 h-[20vh]"></div>
              <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] bg-white  fixed top-[15vh]  md:top-[17vh] z-5 overflow-hidden shadow-lg left-[31vw] sm:left-[12vw] md:left-[9vw] rounded-full border-2 border-white">
                {
                  <>
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={img}
                      alt="Profile"
                    />
                    <div className="absolute inset-0  opacity-30"></div>
                    <p className="absolute inset-0 opacity-0 flex items-center justify-center text-white">
                      Edit
                    </p>
                    <input
                      id="profilePicInput"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={setProfilePic}
                    />
                  </>
                }
              </div>
              <div
                className={
                  windowWidth < 640
                    ? "w-screen   box-border h-screen   bg-white  sm:border-2 sm:border-r-0 border-white ml-[0]  pt-[4rem] p-[2rem] flex   "
                    : "w-screen   h-screen md:h-[69vh]  box-border bg-white  border-white m-auto font-poppins pt-[5rem]  sm:pt-[10vh] p-[2rem]    "
                }
              >
                <div className="h-auto w-full   font-poppins  text-gray-800 pl-0 sm:p-5 rounded-md items-center justify-center m-auto mt-[4rem] sm:mt-4 box-border">
                  <div className="flex w-full ml-[7vw] md:w-1/2  items-center space-x-2  ">
                    <h1 className=" text-2xl font-extrabold  w-[82%] sm:w-1/2 text-center sm:text-left">
                      {userNameFromDb}
                    </h1>
                  </div>
                  <div className="flex w-full ml-[7vw]  md:w-1/2  items-center space-x-2  ">
                    <h1 className=" text-md font-light w-[82%] sm:w-1/2 text-center sm:text-left">
                      Tamil Nadu, India
                    </h1>
                  </div>

                  <div className="md:w-1/2 pl-[7vw]">
                    <button
                      onClick={editProfile}
                      className="w-full   outline-none sm:w-1/2 md:w-1/2   p-4 pt-2  pb-2 mt-[1rem] text-white rounded-lg box-border bg-gray-800  hover:bg-gray-600 "
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="h-1/2 w-auto   font-poppins  text-gray-800 pl-0 sm:p-5 rounded-md items-center justify-center m-auto ml-[7vw] mt-[0rem] shadow-md shadow-black sm:mt-0 box-border ">
                  <div className="md:w-[23%] h-[35%] rounded-lg ml-[0vw] bg-gray-700 grid justify-center text-white  items-center">
                    Linked Accounts
                  </div>
                </div>
              </div>
            </div>
          )} */}
          </div>
        )}
        {isEditProfile ? (
          <form
            action="submit"
            onSubmit={updateProfile}
            className="w-full lg:w-[60%] h-screen text-gray-800   m-auto bg-blue-650 sm:ml-[10vw] lg:ml-[25vw] p-5 box-border items-center flex flex-col  font-poppins justify-center sm:space-y-2 "
          >
            <div className="sm:flex flex-wrap  sm:space-x-2 w-3/4  sm:w-full md:w-[80%]">
              <input
                className="block w-full sm:w-1/2  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
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
                value={dob}
                onChange={handleDob}
                placeholder="Date of Birth"
                required
              />

              <input
                type="tel"
                value={accNumber}
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
        ) : null}
      </div>
      {windowWidth > 768 ? null : isProfileClicked ? (
        <>
          <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
        </>
      ) : null}
    </>
  );
}

export default memo(Profile);
