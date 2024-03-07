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
import profileAlternate from "../assets/images/user-profile.png";
import SavedAccounts from "./SavedAccounts";
import RecentTransactions from "./RecentTransactions";

function Profile() {
  const {
    clearSession,
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
        navigate("/beneficiaries", { state: { prevPath: location.pathname } });
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Rewards":
        setIsProfileClicked(false);
        break;
      case "Contact":
        setIsProfileClicked(false);
        break;
      case "Transactions":
        navigate("/transactions");
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
        break;
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
    clearSession();
    clearAll();
    setLoggedUser("");
    setSavedAcc([]);
    navigate("/");
  };

  const goTo = (path) => {
    switch (path) {
      case "transactions":
        navigate("/transactions");
        break;
      case "beneficiaries":
        navigate("/beneficiaries");
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
    const loggedNumber = sessionStorage.getItem("mobileNumber");
    if (connectionMode !== "socket") {
      axios
        .post("http://localhost:8080/checkUserName", {
          regNumber: loggedNumber,
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
        regNumber: loggedNumber,
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
    const loggedNumber = sessionStorage.getItem("mobileNumber");
    axios
      .post("http://localhost:8080/getBeneficiaryDetails", {
        mobileNumber: loggedNumber,
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
        mobileNumber: loggedNumber,
      })
      .then((res) => {
        console.log(res.data.transactions);
        setRecentActivity(res.data.transactions);
        setRecentTransactionsLength(res.data.count);
      })
      .catch((err) => console.log(err));

    socket.emit("getTransactionDetails", {
      mobileNumber: loggedNumber,
    });

    socket.emit("getSavedAccounts", {
      mobileNumber: loggedNumber,
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
        date: data.date,
        name: data.name,
        status: data.status,
        amount: data.amount,
      };

      setRecentActivity((prev) => [...prev, transaction]);
      await setRecentTransactionsLength(count);
    });

    socket.on("allSavedAccounts", async (data) => {
      const account = {
        name: data.beneficiaryName,
        account: data.accNum,
      };
      const isAlreadyStored = beneficiaries.some((detail) => {
        return (
          detail.name === account.name && detail.account === account.account
        );
      });
      if (!isAlreadyStored) {
        setBeneficiaries((prev) => [...prev, account]);
      }
    });
  }, []);

  useEffect(() => {
    const canceledPaymentsCount = recentActivity.filter(
      (transaction) => transaction.status === "canceled"
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
                    <h1>{sessionStorage.getItem("mobileNumber")}</h1>
                  </div>
                ) : null}
                {windowWidth > 640 ? (
                  <div className="absolute top-44 md:top-48 lg:top-52 h-1/10 w-full justify-center sm:ml-0 pl-0 item-center m-auto text-gray-700">
                    <div className="w-full m-auto md:ml-0 md:m-auto lg:m-auto h-auto flex items-center">
                      <h1 className=" md:m-auto flex text-xl md:text-xl lg:text-2xl sm:pl-0 sm:-ml-14 md-ml-0 items-center justify-center font-extrabold w-8/2 sm:w-1/2 md:w-3/5 lg:w-auto text-center sm:text-center">
                        {userNameFromDb}
                        <MdModeEdit
                          onClick={editProfile}
                          className="cursor-pointer md:m-auto "
                        />
                      </h1>
                    </div>
                    <div className="w-full m-auto sm:-ml-4 md:ml-0 h-auto flex justify-between">
                      <h1 className="text-lg font-lighter w-auto sm:w-1/2 sm:-ml-8 md:ml-0 md:w-full text-center sm:text-center">
                        {sessionStorage.getItem("mobileNumber")}
                      </h1>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="h-40 grid md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 bg-white space-y-4 box-border pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 md:items-center md:justify-center md:shadow-md shadow-gray-300 rounded-md grid-rows-3">
                <h1 className="text-4xl font-bold">
                  {recentTransactionsLength ? recentTransactionsLength : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Total Transactions
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer "
                  onClick={() => goTo("transactions")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-2 xl:pb-0 bg-white box-border md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {beneficiaries ? beneficiaries.length : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Total Recipients
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between hover:cursor-pointer "
                  onClick={() => goTo("beneficiaries")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 box-border bg-white md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-4 sm:pl-16 md:pl-4 pr-4 items-left md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {canceledPayments ? canceledPayments : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Failed Transactions
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer mt-4"
                  onClick={() => goTo("transactions")}
                >
                  View Details <IoIosArrowForward />
                </h1>
              </div>
              <div className="w-screen md:grid grid-cols-3 gap-0">
                <div className="relative h-60 md:h-68 lg:h-64 xl:h-3/4 md:w-3/5 lg:w-3/5 md:-mt-8 lg:-mt-12 xl:-mt-6 border-b-2 pb-0 md:pb-0 bg-white space-y-4 md:space-y-20 flex flex-col pt-4 md:pt-16 items-center md:shadow-md shadow-gray-300 rounded-md">
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
                <SavedAccounts
                  data={{ beneficiaries, goTo, IoIosArrowForward }}
                />
                <RecentTransactions
                  data={{
                    recentActivity,
                    goTo,
                    IoIosArrowForward,
                    windowWidth,
                  }}
                />
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
