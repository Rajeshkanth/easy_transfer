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
import profileAlternate from "./images/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752-fotor-20240208155618.png";
import FailedTransactions from "./FailedTransactions";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import ProfileForm from "./ProfileForm";
function Profile() {
  const {
    handleSocket,
    setIsLoggedOut,
    recentTransactionsLength,
    setRecentTransactionsLength,
    setRecentTransactions,
    userNameFromDb,
    setUserNameFromDb,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
    setCardFromDb,
    setCvvFromDb,
    setExpireDateFromDb,
    connectionMode,
    socket,
    setWindowWidth,
    windowWidth,
    setIsProfileClicked,
    isProfileClicked,
    setLoggedUser,
    setSavedAcc,
    balance,
    setCanceledPaymentsCount,
    canceledPayments,
    failedTransaction,
    setFailedTransaction,
    clearAll,
    recentActivity,
    setRecentActivity,
    isEditProfile,
    setIsEditProfile,
  } = useContext(store);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [img, setImg] = useState(null);

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
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries", { state: { prevPath: location.pathname } });
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Rewards":
        console.log("Navigating to Rewards page");
        setIsProfileClicked(false);
        break;
      case "Contact":
        console.log("Navigating to Contact page");
        setIsProfileClicked(false);
        break;
      case "Transactions":
        navigate("/Transactions");
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Menu":
        // setSavedAcc([]);
        setIsProfileClicked(true);
        break;
      case "Log Out":
        clearAll();
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
          { icon: <MdKeyboardArrowLeft />, id: "Back" },
          "Beneficiaries",
          "Transactions",
          "Rewards",
          "Contact",
          "Log Out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          { icon: <MdKeyboardArrowLeft />, id: "Back" },
          ,
          "Beneficiaries",
          "Transactions",
          "Rewards",
          "Log Out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: [{ icon: <RiMenuUnfoldFill />, id: "Menu" }],
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
        "Transactions",
        "Rewards",
        "Contact",
        "Log Out",
      ],
      onClickHandler: handleMenuClick,
    };
  };

  const sideBarProps = getSideBarProps();

  const logout = () => {
    setLoggedUser("");
    setSavedAcc([]);
    navigate("/");
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

  const onIdle = () => {
    console.log("user is idle");
    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
      const tabId = sessionStorage.getItem("tabId");
      sessionStorage.clear();
      if (tabId) {
        sessionStorage.setItem("tabId", tabId);
      }
      setIsProfileClicked(false);
      logout();
    }, 3000);
    alert("Session expired! You will be redirected to login page");
  };
  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle,
  });

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("http://localhost:8080/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
            setAgeFromDb(response.data.age);
            setDobFromDb(response.data.dob);
            setCardFromDb(response.data.card);
            setCvvFromDb(response.data.cvv);
            setExpireDateFromDb(response.data.expireDate);
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
        setCardFromDb(data.card);
        setCvvFromDb(data.cvv);
        setExpireDateFromDb(data.expireDate);
        setAccFromDb(data.accNum);
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
        setAgeFromDb("");
      });
    }
  }, [socket, connectionMode, setUserNameFromDb]);

  useEffect(() => {
    axios
      .post("http://localhost:8080/getSavedAccountsForProfile", {
        num: document.cookie,
      })
      .then((res) => {
        console.log(res.data);
        res.data ? setBeneficiaries(res.data) : setBeneficiaries([]);
      })
      .catch((err) => console.log(err));

    axios
      .post("http://localhost:8080/getSavedTransactionsForProfile", {
        num: document.cookie,
      })
      .then((res) => {
        setRecentActivity(res.data.transactions);
        setRecentTransactionsLength(res.data.count);
      })
      .catch((err) => console.log(err));

    socket.emit("getTransactionDetailsCount", {
      num: document.cookie,
    });

    socket.emit("getSavedAccountsForProfile", {
      num: document.cookie,
    });

    console.log(recentActivity);

    return () => {
      socket.off();
      setRecentActivity([]);
      setRecentTransactionsLength(0);
      setBeneficiaries([]);
      setAccFromDb("");
      setAgeFromDb("");
      setDobFromDb("");
    };
  }, []);

  useEffect(() => {
    socket.on("transactionsCountFromDB", async (data) => {
      const { count } = data;
      const transaction = {
        Date: data.Date,
        Name: data.Name,
        Status: data.Status,
        Amount: data.Amount,
      };

      const isAlreadyStored = recentActivity.some((detail) => {
        return (
          detail.Date === transaction.Date &&
          detail.Name === transaction.Name &&
          detail.Status === transaction.Status &&
          detail.Amount === transaction.Amount
        );
      });
      if (!isAlreadyStored) {
        setRecentActivity((prev) => [...prev, transaction]);
      }

      await setRecentTransactionsLength(count);
    });

    socket.on("savedAccountsFromDb", async (data) => {
      const { count } = data;
      const account = {
        Name: data.beneficiaryName,
        Account: data.accNum,
      };

      const isAlreadyStored = beneficiaries.some((detail) => {
        return (
          detail.Name === account.Name && detail.Account === account.Account
        );
      });

      if (!isAlreadyStored) {
        setBeneficiaries((prev) => [...prev, account]);
      }
    });
  }, []);

  useEffect(() => {
    const canceledPaymentsCount = recentActivity.filter(
      (transaction) => transaction.Status === "canceled"
    ).length;

    setCanceledPaymentsCount(canceledPaymentsCount);
  }, [recentActivity]);

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
          <div className="bg-slate-100  w-screen text-gray-700 h-auto flex flex-col  md:h-screen box-border md:grid md:grid-cols-4  md:gap-0 lg:gap-2 md:pb-2 md:pl-[3vw] lg:pl-[2vw] xl:pl-[3vw] md:pt-6 cursor-default">
            <>
              <div className="h-[50vh] md:h-[35vh] lg:h-[40vh] md:w-[20vw] border-b-2 md:border-b-0  items-center justify-center bg-white  md:md:shadow-md shadow-gray-300 rounded-md">
                <div className=" h-[150px] w-[150px] md:h-[120px] md:w-[120px] lg:w-[120px] lg:h-[w-120px] xl:h-[200px] xl:w-[200px] bg-white  absolute lg:fixed top-[12vh]  md:top-[16vh] lg:top-[17vh] xl:top-[16vh] z-5 overflow-hidden shadow-lg left-[5vw] sm:left-[6vw] md:left-[6vw] lg:left-[6vw] xl:left-[6vw] rounded-full border-2 border-gray-600">
                  {
                    <>
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={img ? img : profileAlternate}
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
                  <div className="w-1/2 absolute h-[10vh]  top-[36vh] grid grid-rows-2  left-[10vw]">
                    <h1 className="flex items-center   font-bold text-2xl">
                      {userNameFromDb} <MdModeEdit onClick={editProfile} />
                    </h1>
                    <h1>{document.cookie}</h1>
                  </div>
                ) : null}
                {windowWidth > 640 ? (
                  <div className=" lg:gap-8 h-[10%] w-[100%] justify-center    mt-[35vh] md:mt-[25vh] lg:mt-[28vh] xl:mt-[30vh] sm:ml-[-2%] md:ml-0 pl-[0vw] md:pl-[0vw] item-center m-auto text-gray-700">
                    <div className="w-full m-auto sm:ml-[-6%] md:ml-0 md:mauto lg:m-auto h-auto flex  items-center  ">
                      {" "}
                      <h1 className=" md:m-auto flex text-2xl sm:pl-[0vw] md:pl-0 sm:ml-[0vw]  lg:pl-0 xl:pl-[0vw]   items-center justify-center font-extrabold  w-[82%] sm:w-1/2 md:w-[60%]  lg:w-auto text-center sm:text-center">
                        {userNameFromDb}

                        <MdModeEdit
                          onClick={editProfile}
                          className="cursor-pointer text-2xl md:m-auto "
                        />
                      </h1>
                    </div>
                    <div className="w-full m-auto sm:ml-[-4%] md:ml-0 h-auto flex justify-between">
                      <h1 className=" text-lg font-lighter   w-[82%] sm:w-[47%] sm:ml-[-1vw] md:ml-0 md:w-full text-center sm:text-center">
                        {document.cookie}
                      </h1>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="h-[20vh]  grid md:block  md:w-[20vw] border-b-2 md:border-b-0 pb-2  md:pb-[8rem] xl:pb-0 bg-white hover:bg-gray-100 space-y-2 box-border pt-[3vh] pl-[10vw] md:pl-[2vw] pr-[2vw] md:items-center md:justify-center md:shadow-md shadow-gray-300 rounded-md grid-rows-3">
                <h1 className="text-4xl font-bold">
                  {recentTransactionsLength ? recentTransactionsLength : 0}
                </h1>
                <h1 className="md:border-b-2  md:text-sm lg:text-md pb-[2vh]">
                  Total Transactions
                </h1>
                <h1
                  className="text-md flex items-center justify-between cursor-pointer "
                  onClick={() => navigate("/Transactions")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-[20vh]  grid grid-rows-3 md:block md:w-[20vw] border-b-2 md:border-b-0 pb-2  md:pb-[8rem] xl:pb-0 md:pb-0 bg-white hover:bg-gray-100 box-border md:shadow-md shadow-gray-300 rounded-md space-y-2 pt-[3vh] pl-[10vw] md:pl-[2vw] pr-[2vw] md:items-center md:justify-center ">
                <h1 className="text-4xl font-bold">
                  {beneficiaries ? beneficiaries.length : 0}
                </h1>
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
              <div className="h-[20vh] grid grid-rows-3 md:block md:w-[20vw] border-b-2 md:border-b-0 pb-2 md:pb-[8rem]  xl:pb-0 box-border bg-white hover:bg-gray-100  md:shadow-md shadow-gray-300 rounded-md space-y-2 pt-[3vh] pl-[10vw] md:pl-[2vw] pr-[2vw] items-left md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {canceledPayments ? canceledPayments : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-sm lg:text-md pb-[2vh]">
                  Failed Transactions
                </h1>
                <h1
                  className="text-md flex items-center justify-between cursor-pointer "
                  onClick={() => setFailedTransaction(true)}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-[31vh] md:h-[40vh] lg:h-[40vh]  border-b-2 pb-0 md:pb-0 md:w-[20vw] bg-white hover:bg-gray-100 space-y-4 md:space-y-[5rem] flex flex-col pt-[1rem] md:pt-[4rem] items-center md:shadow-md shadow-gray-300 rounded-md">
                <div className="flex flex-col items-center space-y-2 justify-center">
                  <h1 className="m-0 text-4xl items-center flex justify-center border-2 rounded-full p-2 bg-slate-100">
                    <IoIosWallet />
                  </h1>
                  <h1 className="flex  font-extrabold text-2xl items-center">
                    <FaRupeeSign className="text-xl font-extrabold" /> {balance}
                  </h1>
                  <h1 className=" text-sm">Available Balance</h1>
                </div>
                <h1 className=" bg-slate-700 cursor-pointer hover:bg-gray-600 w-full md:w-[20%] lg:w-[20%] h-[6vh] md:h-[6.2vh] lg:h-[6vh] absolute top-[134vh] md:top-[78.5vh] lg:top-[80vh] xl:top-[81vh]  text-white text-center flex items-center justify-center md:rounded-tr-none md:rounded-tl-none md:rounded-md">
                  Customer Support
                </h1>
              </div>
              <div className="h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[60vh] border-b-2 md:border-b-0 md:w-[28vw] lg:w-[30vw] xl:w-[31vw] md:pl-0 md:mt-[-4.5rem] lg:mt-[-7.5rem] xl:mt-[-9.5rem] bg-white hover:bg-gray-100 space-y-2  md:space-y-1 pt-2 md:pt-4 md:shadow-md shadow-gray-300 rounded-md">
                <div className="grid grid-cols-2 gap-[35vw] sm:gap-[45vw] md:gap-0 xl:gap-20  pl-4 md:pl-[2vw] ">
                  <h1 className="text-lg md:text-sm lg:text-xl ">Recipients</h1>
                  <h1
                    className="text-sm md:text-xs lg:text-md xl:text-sm ml-[4vw] md:ml-[2vw] lg:ml-[4vw] flex items-center text-gray-900 hover:cursor-pointer"
                    onClick={() => navigate("/Beneficiaries")}
                  >
                    View more <IoIosArrowForward />
                  </h1>
                </div>
                <div
                  className={
                    beneficiaries && beneficiaries.length < 5
                      ? "space-y-10   h-[50%] pt-[1vh]  md:h-[90%] lg:h-[90%] xl:h-full pl-[5vw] md:pl-[2vw] md:pt-[2vh] md:pb-[2vh]"
                      : "grid   h-[50%] pt-[1vh]  md:h-[90%] lg:h-[90%] xl:h-full pl-[5vw] md:pl-[2vw] md:pt-[2vh] md:pb-[2vh]"
                  }
                >
                  {beneficiaries.length > 0 ? (
                    beneficiaries.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="space-y-0  xl:h-[3vh]    leading-0"
                      >
                        <h1
                          key={index}
                          className="text-md  md:text-sm lg:text-md   capitalize "
                        >
                          {item.Name}
                        </h1>
                        <h1 className="text-sm md:text-sm">{item.Account}</h1>
                      </div>
                    ))
                  ) : (
                    <p className="grid items-center w-full justify-center h-full">
                      You don't have any saved accounts, yet.
                    </p>
                  )}
                </div>
              </div>
              <div className="h-auto md:h-[55vh] lg:h-[60vh]  md:w-[38vw] lg:w-[37vw] xl:w-[33vw] border-b-2 md:border-b-0 overflow-y-auto md:mt-[-4.5rem]  lg:mt-[-7.5rem] xl:mt-[-9.5rem] md:ml-[7vw] lg:ml-[8vw] xl:ml-[11vw] space-y-1 bg-white hover:bg-gray-100 md:shadow-md shadow-gray-300  md:rounded-md">
                <div className="grid grid-cols-3 md:gap-0 sticky top-0 z-5 bg-slate-700 text-white h-[6vh] pl-4 border-b-2  items-center">
                  <h1 className="text-sm  md:text-xs lg:text-md xl:text-xl  md:pr-0 border-r-2">
                    Recent Activity
                  </h1>
                  <h1 className="text-xs  lg:text-xs xl:text-sm pl-2">
                    {recentTransactionsLength ? recentTransactionsLength : 0}{" "}
                    Transactions
                  </h1>
                  <h1
                    className="text-xs md:text-xs xl:text-sm ml-[2vw] lg:ml-[4vw] flex items-center text-gray-200 hover:cursor-pointer"
                    onClick={() => navigate("/Transactions")}
                  >
                    View more <IoIosArrowForward />
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-6 p-1 space-y-0 items-center pl-[1.2vw] border-b-2 ">
                  <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-2 md:gap-0 lg:gap-0 xl:gap-0 pl-[5vw] md:pl-0">
                    <h1>Date</h1>
                    <h1>Description</h1>
                  </div>
                  <div className="grid grid-cols-2 text-sm md:text-md items-center gap-5 lg:gap-10 xl:gap-4">
                    {" "}
                    <h1 className="">Amount</h1>
                    <h1>Status</h1>
                  </div>
                </div>
                {recentActivity.length < 1 ? (
                  <p className="flex items-center justify-center pt-[5rem] pb-[5rem]">
                    There is no recent transactions
                  </p>
                ) : (
                  recentActivity
                    .slice(-13)
                    .reverse()
                    .map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-5 md:gap-10  lg:gap-7 xl:gap-16 p-1 space-y-0 items-center pl-[5vw] md:pl-[1.2vw] pr-[2vw] border-b-2"
                      >
                        <div className="grid grid-cols-2 gap-0 md:gap-6 lg:gap-2 xl:gap-6 items-center text-xs md:text-sm lg:text-md ">
                          <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                          <h1 className="md:text-xs lg:text-md overflow-x-auto md:w-[85px] lg:w-[110px]">{`Sent to ${item.Name}`}</h1>
                        </div>
                        <div className="grid grid-cols-2 md:gap-5 lg:gap-5  text-xs md:text-sm lg:text-md  ">
                          <h1 className="md:text-xs lg:text-md">
                            {item.Amount}
                          </h1>
                          <h1
                            className={
                              item.Status === "completed"
                                ? "md:text-xs lg:text-md text-green-600 capitalize"
                                : item.Status === "canceled"
                                ? "md:text-xs lg:text-md text-red-800 capitalize"
                                : "md:text-xs lg:text-md text-yellow-400 capitalize"
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
          </div>
        )}

        {/* profile edit section */}

        {isEditProfile ? <ProfileForm /> : null}
      </div>

      {/* sidebar */}

      {windowWidth > 768 ? null : isProfileClicked ? (
        <>
          <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
        </>
      ) : null}

      {/* failed transactions card */}

      {failedTransaction ? (
        <div className="fixed top-0 grid justify-center h-screen w-screen z-[100]">
          {" "}
          <FailedTransactions />
        </div>
      ) : null}
    </>
  );
}

export default memo(Profile);
