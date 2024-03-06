import React, { memo, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../App";
import axios from "axios";
import Menu from "./Menu";
import SideBar from "./SideBar";
import ProfileForm from "./ProfileForm";
import { FaRupeeSign } from "react-icons/fa";
import { IoIosArrowForward, IoIosWallet } from "react-icons/io";
import { MdModeEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import profileAlternate from "../images/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752-fotor-20240208155618.png";

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
    setCanceledPaymentsCount,
    canceledPayments,
    clearAll,
    recentActivity,
    setRecentActivity,
    isEditProfile,
    setIsEditProfile,
    userName,
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
    accFromDb,
    dobFromDb,
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
        setIsProfileClicked(true);
        break;
      case "Log Out":
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
    clearAll();
    setLoggedUser("");
    setSavedAcc([]);
    navigate("/");
  };

  const goTo = (path) => {
    switch (path) {
      case "Transactions":
        navigate("/Transactions");
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries");
        break;
    }
  };

  const editProfile = () => {
    setIsEditProfile(true);
  };

  const onIdle = () => {
    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
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
  }, [socket, connectionMode, setUserNameFromDb, isEditProfile]);

  useEffect(() => {
    axios
      .post("http://localhost:8080/getBeneficiaryDetails", {
        num: document.cookie,
      })
      .then((res) => {
        const beneficiaryDetails = res.data.map((detail) => ({
          name: detail.beneficiaryName,
          account: detail.accNum,
        }));
        beneficiaryDetails
          ? setBeneficiaries(beneficiaryDetails)
          : setBeneficiaries([]);
      })
      .catch((err) => err);
    axios
      .post("http://localhost:8080/transactionDetails", {
        mobileNumber: document.cookie,
      })
      .then((res) => {
        setRecentActivity(res.data.transactions);
        setRecentTransactionsLength(res.data.count);
      })
      .catch((err) => console.log(err));
    socket.emit("getTransactionDetails", {
      mobileNumber: document.cookie,
    });
    socket.emit("getSavedAccounts", {
      mobileNumber: document.cookie,
    });
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
    socket.on("transactionDetailsFromDb", async (data) => {
      const { count } = data;
      const transaction = {
        Date: data.Date,
        Name: data.Name,
        Status: data.Status,
        Amount: data.Amount,
      };
      setRecentActivity((prev) => [...prev, transaction]);
      await setRecentTransactionsLength(count);
    });
    socket.on("allSavedAccounts", async (data) => {
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
      <div className="w-screen md:fixed flex flex-col text-white font-poppins pt-2 h-screen sm:flex box-border bg-gray-800">
        {windowWidth < 768 ? (
          <div className="fixed bg-gray-800 h-16 w-screen flex items-center top-0 z-10">
            <Menu {...menuProps} onClickHandler={handleMenuClick} />
          </div>
        ) : (
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        )}
        {isEditProfile ? null : (
          <div className="">
            <div className="bg-slate-100 w-screen text-gray-700 h-auto flex flex-col md:h-screen box-border md:grid md:grid-cols-4 md:gap-2 lg:gap-0 md:pb-2 md:pl-8 lg:pl-8 xl:pl-12 md:pt-6 cursor-default">
              <div className="relative h-60 mt-14 md:mt-0 md:w-4/5 lg:w-10/12 md:h-68 lg:h-68 xl:h-72 border-b-2 md:border-b-0 items-center justify-center bg-white md:md:shadow-md shadow-gray-300 rounded-md">
                <div className="h-36 w-36 md:h-28 md:w-28 lg:w-40 lg:h-40 xl:h-40 xl:w-40 bg-white absolute lg:fixed top-4 md:top-12 lg:top-32 z-5 overflow-hidden shadow-lg left-4 sm:left-12 md:left-6 lg:left-16 xl:left-28 rounded-full border-2 border-gray-600">
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
                  <div className="w-1/2 absolute top-44 left-4">
                    <h1 className="flex items-center font-bold text-2xl">
                      {userNameFromDb} <MdModeEdit onClick={editProfile} />
                    </h1>
                    <h1>{document.cookie}</h1>
                  </div>
                ) : null}
                {windowWidth > 640 ? (
                  <div className="absolute top-44 md:top-48 lg:top-52 h-1/10 w-full justify-center sm:ml-0 pl-0 item-center m-auto text-gray-700">
                    <div className="w-full m-auto md:ml-0 md:m-auto lg:m-auto h-auto flex items-center">
                      <h1 className=" md:m-auto flex text-2xl sm:pl-0 sm:-ml-14 md-ml-0 items-center justify-center font-extrabold  w-8/2 sm:w-1/2 md:w-3/5  lg:w-auto text-center sm:text-center">
                        {userNameFromDb}
                        <MdModeEdit
                          onClick={editProfile}
                          className="cursor-pointer text-2xl md:m-auto "
                        />
                      </h1>
                    </div>
                    <div className="w-full m-auto sm:-ml-4 md:ml-0 h-auto flex justify-between">
                      <h1 className="text-lg font-lighter w-auto sm:w-1/2 sm:-ml-8 md:ml-0 md:w-full text-center sm:text-center">
                        {document.cookie}
                      </h1>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="h-40 grid md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 bg-white hover:bg-gray-100 space-y-4 box-border pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 md:items-center md:justify-center md:shadow-md shadow-gray-300 rounded-md grid-rows-3">
                <h1 className="text-4xl font-bold">
                  {recentTransactionsLength ? recentTransactionsLength : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Total Transactions
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer "
                  onClick={() => goTo("Transactions")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-2 xl:pb-0 bg-white hover:bg-gray-100 box-border md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {beneficiaries ? beneficiaries.length : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Total Recipients
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between hover:cursor-pointer "
                  onClick={() => goTo("Beneficiaries")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 box-border bg-white hover:bg-gray-100  md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 items-left md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {canceledPayments ? canceledPayments : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Failed Transactions
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer mt-4"
                  onClick={() => goTo("Transactions")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="w-screen md:grid grid-cols-3 gap-0">
                <div className="relative h-60 md:h-60 lg:h-68 xl:h-3/4 md:w-3/5 lg:w-3/5 lg:mt-4 xl:-mt-4 border-b-2 pb-0 md:pb-0 bg-white hover:bg-gray-100 space-y-4 md:space-y-20 flex flex-col pt-4 md:pt-16 items-center md:shadow-md shadow-gray-300 rounded-md">
                  <div className="flex flex-col items-center space-y-2 justify-center ">
                    <h1 className="m-0 text-4xl items-center flex justify-center border-2 rounded-full p-2 bg-slate-100">
                      <IoIosWallet />
                    </h1>
                    <h1 className="flex font-extrabold text-2xl items-center">
                      <FaRupeeSign className="text-xl font-extrabold" /> 1000
                    </h1>
                    <h1 className="text-sm">Available Balance</h1>
                  </div>
                  <h1 className="bg-slate-700 cursor-pointer hover:bg-gray-600 w-full h-12 absolute bottom-0 md:-bottom-2  text-white text-center flex items-center justify-center md:rounded-tr-none md:rounded-tl-none md:rounded-md">
                    Customer Support
                  </h1>
                </div>{" "}
                <div className="h-1/2 md:h-5/6 lg:h-full md:-ml-20 lg:-ml-24 xl:-ml-32 md:-mt-20 lg:-mt-24 xl:-mt-28 md:w-64 lg:w-10/12 border-b-2 md:border-b-0 bg-white hover:bg-gray-100 space-y-2 md:space-y-1  md:shadow-md shadow-gray-300 rounded-md pt-4 pb-8">
                  <div className="grid grid-cols-2 gap-32 sm:gap-80 md:gap-0 xl:gap-20 pl-4 lg:pl-8">
                    <h1 className="text-lg md:text-sm lg:text-xl ">
                      Recipients
                    </h1>
                    <h1
                      className="text-sm md:text-xs lg:text-md xl:text-sm md:ml-4 lg:ml-8 flex items-center text-gray-900 hover:cursor-pointer"
                      onClick={() => goTo("Beneficiaries")}
                    >
                      View more <IoIosArrowForward />
                    </h1>
                  </div>
                  <div
                    className={
                      beneficiaries && beneficiaries.length < 5
                        ? "space-y-10 h-1/2 pt-4 xl:h-full pl-4 md:pl-4 lg:pl-8 md:pt-4 md:pb-4"
                        : "grid  h-1/2 pt-0 xl:h-full pl-4 md:pl-4 lg:pl-8 md:pt-4 md:pb-4"
                    }
                  >
                    {beneficiaries.length > 0 ? (
                      beneficiaries.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className="space-y-0 xl:h-12 leading-0"
                        >
                          <h1
                            key={index}
                            className="text-md md:text-sm lg:text-md capitalize "
                          >
                            {item.name}
                          </h1>
                          <h1 className="text-sm md:text-sm">{item.account}</h1>
                        </div>
                      ))
                    ) : (
                      <p className="grid items-center w-full justify-center h-full">
                        You don't have any saved accounts, yet.
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-1/2 md:h-5/6 lg:h-full md:w-full md:-ml-16 lg:-ml-20 xl:-ml-28 md:-mt-20 lg:-mt-24 xl:-mt-28 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white hover:bg-gray-100 md:shadow-md shadow-gray-300 md:rounded-md">
                  <div className="flex justify-between md:gap-0 sticky top-0 z-5 bg-slate-700 text-white h-12 pl-4 border-b-2  items-center">
                    <h1 className="text-sm md:text-xs lg:text-xl xl:text-xl md:pr-0 ">
                      Recent Activity
                    </h1>
                    <h1
                      className="text-xs md:text-xs xl:text-sm mr-12 flex items-center text-gray-200 hover:cursor-pointer"
                      onClick={() => goTo("Transactions")}
                    >
                      View more <IoIosArrowForward />
                    </h1>
                  </div>
                  <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-6 p-1 space-y-0 items-center pl-2 border-b-2">
                    <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-2 md:gap-0 pl-2 md:pl-0 lg:pl-2">
                      <h1>Date</h1>
                      <h1>Description</h1>
                    </div>
                    <div className="grid grid-cols-2 text-sm md:text-md items-center gap-5 lg:gap-10 xl:gap-4">
                      <h1 className="">Amount</h1>
                      <h1>Status</h1>
                    </div>
                  </div>
                  {recentActivity.length < 1 ? (
                    <p className="flex items-center justify-center pt-20 pb-20">
                      There is no recent transactions
                    </p>
                  ) : (
                    recentActivity
                      .slice(-13)
                      .reverse()
                      .map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-5 md:gap-3 lg:gap-7 xl:gap-16 p-1 space-y-0 items-center pl-4 md:pl-2 lg:pl-4 pr-4 border-b-2 text-xs md:text-xs lg:text-md"
                        >
                          <div className="grid grid-cols-2 gap-0 lg:gap-2 xl:gap-6 items-cente">
                            <h1 className="">{item.Date}</h1>
                            {windowWidth > 767 && windowWidth < 1000 ? (
                              <h1 className=" overflow-x-auto md:pl-2 md:w-28 lg:w-24">{`To ${item.Name}`}</h1>
                            ) : (
                              <h1 className=" overflow-x-auto w-28 lg:w-24">{`Sent to ${item.Name}`}</h1>
                            )}
                          </div>
                          <div className="grid grid-cols-2 pl-4 md:pl-4 lg:pl-2 xl:pl-0 gap-0">
                            <h1 className="">{item.Amount}</h1>
                            <h1
                              className={
                                item.Status === "completed"
                                  ? " text-green-600 capitalize"
                                  : item.Status === "canceled"
                                  ? " text-red-800 capitalize"
                                  : " text-yellow-400 capitalize"
                              }
                            >
                              {item.Status}
                            </h1>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditProfile ? (
          <ProfileForm
            states={{
              setUserNameFromDb,
              setAgeFromDb,
              setAccFromDb,
              setDobFromDb,
              setCardFromDb,
              setCvvFromDb,
              setExpireDateFromDb,
              setIsEditProfile,
              connectionMode,
              socket,
              userName,
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
              accFromDb,
              dobFromDb,
            }}
          />
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
