import React, { memo, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../App";
import axios from "axios";
import Menu from "./utils/Menu";
import SideBar from "./utils/SideBar";
import ProfileForm from "../components/forms/ProfileForm";
import { FaRupeeSign } from "react-icons/fa";
import { IoIosArrowForward, IoIosWallet } from "react-icons/io";
import { MdModeEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import profileAlternate from "../assets/images/user-profile.png";
import SavedAccounts from "./accounts/SavedAccounts";
import RecentTransactions from "./transactions/RecentTransactions";

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

  const extractFirstName = (fullName) => {
    if (!fullName) {
      return "";
    }
    const seperatedNames = fullName.split(" ");
    return seperatedNames[0];
  };

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/beneficiaries");
        }
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/beneficiaries", { state: { prevPath: location.pathname } });
        setSavedAcc([]);
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
    if (windowWidth > 640) {
      return {
        nav: [
          { icon: <MdKeyboardArrowLeft />, id: "Back" },
          "Beneficiaries",
          "Transactions",
          "Log Out",
        ],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav: ["Back", "Beneficiaries", "Transactions", "Log Out"],
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
        .post("http://localhost:8080/api/user/checkUserName", {
          mobileNumber: loggedNumber,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.userName);
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
      .post("http://localhost:8080/api/user/getBeneficiaryDetails", {
        mobileNumber: loggedNumber,
      })
      .then((res) => {
        const beneficiaryDetails = res.data.map((detail) => ({
          name: detail.beneficiaryName,
          account: detail.accountNumber,
        }));
        beneficiaryDetails
          ? setBeneficiaries(beneficiaryDetails)
          : setBeneficiaries([]);
      })
      .catch((err) => err);

    axios
      .post("http://localhost:8080/api/transaction/transactionDetails", {
        mobileNumber: loggedNumber,
      })
      .then((res) => {
        setRecentActivity(res.data.transactions);
        setRecentTransactionsLength(res.data.totalTransactions);
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
      <div className="w-screen md:fixed flex flex-col text-white font-poppins h-screen sm:flex box-border bg-gray-800">
        {windowWidth < 768 ? (
          <div className="fixed bg-gray-800 h-16 w-screen flex items-center top-0 z-10">
            <Menu {...menuProps} onClickHandler={handleMenuClick} />
          </div>
        ) : (
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        )}
        {isEditProfile ? null : (
          <div className="">
            <div className="bg-gray-100 w-screen text-gray-700 h-auto flex flex-col md:h-screen md:grid md:grid-cols-4 md:gap-2 lg:gap-0 md:pb-2 md:pl-8 lg:pl-8 xl:pl-12 md:pt-6 cursor-default box-border">
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
                  <div className="w-full absolute top-44 pl-8 md:pl-4">
                    <h1 className="flex items-center font-bold text-2xl text-ellipsis whitespace-nowrap">
                      {extractFirstName(userNameFromDb)}{" "}
                      <MdModeEdit onClick={editProfile} />
                    </h1>
                  </div>
                ) : null}
                {windowWidth > 640 ? (
                  <div className="md:w-full absolute top-44 left-16 md:left-0 md:top-48 lg:top-52 font-bold flex flex-col items-center">
                    <div className="flex text-center items-center">
                      <h1 className="text-2xl md:text-xl lg:text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                        {extractFirstName(userNameFromDb)}
                      </h1>
                    </div>

                    <h1 className="md:text-xl lg:text-2xl flex text-center items-center">
                      <MdModeEdit
                        onClick={editProfile}
                        className="cursor-pointer"
                      />
                    </h1>
                  </div>
                ) : null}
              </div>
              <div className="h-40 grid md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 bg-white space-y-4 box-border pt-4 pl-8 sm:pl-16 md:px-4 md:items-center md:justify-center md:shadow-md shadow-gray-300 rounded-md grid-rows-3">
                <div className="flex flex-col md:items-center space-y-2 md:justify-center ">
                  <h1 className="w-14 m-0 text-4xl items-center flex justify-center border-2 rounded-full p-2 bg-slate-100">
                    <IoIosWallet />
                  </h1>
                  <h1 className="flex font-extrabold text-2xl items-center">
                    <FaRupeeSign className="text-xl font-extrabold" /> 1000
                  </h1>
                  <h1 className="text-sm">Available balance</h1>
                </div>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-2 xl:pb-0 bg-white box-border md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-8 sm:pl-16 md:pl-4 pr-4 md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {beneficiaries ? beneficiaries.length : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Total recipients
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between hover:cursor-pointer "
                  onClick={() => goTo("beneficiaries")}
                >
                  View more <IoIosArrowForward />
                </h1>
              </div>
              <div className="h-40 grid grid-rows-3 md:block md:w-10/12 lg:w-4/5 border-b-2 md:border-b-0 pb-2 md:pb-8 xl:pb-0 box-border bg-white md:shadow-md shadow-gray-300 rounded-md space-y-4 pt-4 pl-8 sm:pl-16 md:pl-4 pr-4 items-left md:items-center md:justify-center">
                <h1 className="text-4xl font-bold">
                  {canceledPayments ? canceledPayments : 0}
                </h1>
                <h1 className="md:border-b-2 md:text-xs lg:text-md pb-3">
                  Failed transactions
                </h1>
                <h1
                  className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer mt-4"
                  onClick={() => goTo("transactions")}
                >
                  View more <IoIosArrowForward />
                </h1>
              </div>
              <div className="w-screen md:grid grid-cols-3 gap-0">
                <div className="relative h-60 md:h-60 lg:h-64 xl:h-3/4 md:w-3/5 lg:w-3/5 md:-mt-10 lg:-mt-12 xl:-mt-4 border-b-2 pb-0 md:pb-0 bg-white space-y-4 md:space-y-0 flex flex-col pt-4 md:pt-16 items-left md:items-center md:shadow-md shadow-gray-300 rounded-md">
                  <h1 className="text-4xl font-bold pb-4 pl-8 sm:pl-16 md:pl-0">
                    {recentTransactionsLength ? recentTransactionsLength : 0}
                  </h1>
                  <h1 className=" md:text-xs lg:text-base pb-4 pl-8 sm:pl-16 md:pl-0">
                    Total transactions
                  </h1>
                  <h1
                    className="text-md md:text-sm lg:text-md flex items-center justify-between cursor-pointer pl-8 sm:pl-16 md:pl-0"
                    onClick={() => goTo("transactions")}
                  >
                    View more <IoIosArrowForward />
                  </h1>
                  <h1 className="bg-slate-700 cursor-pointer hover:bg-gray-600 w-full h-12 absolute bottom-0 md:-bottom-2 text-white text-center flex items-center justify-center md:rounded-tr-none md:rounded-tl-none md:rounded-md">
                    Customer support
                  </h1>
                </div>{" "}
                <SavedAccounts
                  data={{ beneficiaries, goTo, IoIosArrowForward }}
                />
                {/* <RecentTransactions
                  data={{
                    recentActivity,
                    goTo,
                    IoIosArrowForward,
                    windowWidth,
                  }}
                /> */}
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
