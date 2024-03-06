import React, { memo, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../App";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useIdleTimer } from "react-idle-timer";
import axios from "axios";

function Transactions() {
  const {
    socket,
    setRecentTransactionsLength,
    setIsProfileClicked,
    isProfileClicked,
    setSavedAcc,
    setLogOut,
    logOut,
    windowWidth,
    recentTransactions,
    setRecentTransactions,
    setIsLoggedOut,
    handleSocket,
    setLoggedUser,
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Profile":
        navigate("/Profile", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Home":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
        setIsProfileClicked(false);
        break;
      case "Rewards":
        setIsProfileClicked(false);
        break;
      case "Contact":
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries");
        setIsProfileClicked(false);
        break;
      case "Log Out":
        setSavedAcc([]);
        setRecentTransactions([]);
        setLogOut(true);
        setIsLoggedOut(true);
        setIsProfileClicked(false);
        navigate("/");
        break;
      default:
        return;
    }
  };

  const getMenuProps = () => {
    if (windowWidth > 1024) {
      return {
        nav: [
          { icon: <MdKeyboardArrowLeft />, id: "Back" },
          "Beneficiaries",
          "Profile",
          "Rewards",
          "Contact",
          "Log Out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          { icon: <FaArrowLeftLong />, id: "Back" },
          "Beneficiaries",
          "Profile",
          "Rewards",
          "Contact",
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
        "Profile",
        "Rewards",
        "Contact",
        "Log Out",
      ],
      onClickHandler: handleMenuClick,
    };
  };
  const sideBarProps = getSideBarProps();

  const onIdle = () => {
    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
      setIsProfileClicked(false);
      setLoggedUser("");
      navigate("/");
    }, 3000);
    alert("Session expired! You will be redirected to login page");
  };

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle,
  });

  useEffect(() => {
    axios
      .post("http://localhost:8080/transactionDetails", {
        mobileNumber: document.cookie,
      })
      .then((res) => {
        setRecentTransactions(res.data.transactions);
      })
      .catch((err) => console.log(err));

    socket.emit("getTransactionDetails", {
      mobileNumber: document.cookie,
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      socket.on("transactionDetailsFromDb", (data) => {
        const transaction = {
          Date: data.Date,
          Name: data.Name,
          Status: data.Status,
          Amount: data.Amount,
        };
        const isAlreadyStored = recentTransactions.some((detail) => {
          return (
            detail.Date === transaction.Date &&
            detail.Name === transaction.Name &&
            detail.Status === transaction.Status &&
            detail.Amount === transaction.Amount
          );
        });
        if (!isAlreadyStored)
          setRecentTransactions((prev) => [...prev, transaction]);
      });
      const length = recentTransactions.length;
      setRecentTransactionsLength(length);
    };
    fetchData();
  }, [socket]);

  useEffect(() => {
    return () => {
      setLogOut(false);
    };
  }, [logOut]);

  return (
    <>
      {windowWidth > 768 ? null : isProfileClicked ? (
        <>
          <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
        </>
      ) : null}
      <div className="h-auto md:h-screen w-screen pt-0 md:pt-2 pb-8 md:fixed font-poppins bg-gray-800 text-white">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        <div className=" grid  pt-20 md:pt-0 md:grid-cols-2 gap-0 lg:gap-10 md:pl-16 lg:pl-20 xl:pl-24 md:mt-4 box-border">
          <div className="h-100 md:h-52 lg:h-52 xl:h-68 md:w-4/5 lg:w-4/5 xl:w-11/12 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
            <div className="grid  md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-12 pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm  md:text-xs lg:text-md xl:text-16  md:pr-0 ">
                Pending Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 md:gap-5 lg:gap-5 text-gray-700  xl:gap-6 p-1 space-y-0 items-center md:pl-4 lg:pl-8 border-b-2 ">
              <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-4 md:gap-3 lg:gap-0 xl:gap-0 pl-4 sm:pl-8 md:pl-0 xl:pl-4  pr-4">
                <h1>Date</h1>
                <h1>Description</h1>
              </div>
              <div className="grid grid-cols-2 text-sm md:text-md items-center gap-7 lg:gap-10 xl:gap-4">
                {" "}
                <h1 className="">Amount</h1>
                <h1>Status</h1>
              </div>
            </div>
            {recentTransactions === null ? (
              <div className="grid  items-center h-1/2 text-gray-700 justify-center text-16">
                <p className=" pt-0">There is no recent transactions</p>
              </div>
            ) : recentTransactions.filter((item) => item.Status === "Pending")
                .length < 1 ? (
              <>
                <div className="grid  items-center  h-1/2 text-gray-700 justify-center text-16">
                  <p className=" pt-0">There is no pending transactions</p>
                </div>{" "}
              </>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "Pending")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5  lg:gap-7 xl:gap-12 p-1 space-y-0 text-gray-700 items-center pl-4 sm:pl-8 md:pl-3 lg:pl-8 xl:pl-12 pr-4 border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-2 xl:gap-5 items-center text-xs md:text-sm lg:text-md ">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md">{item.Name}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-0 pl-5 md:pl-4 lg:pl-4 xl:pl-0 text-xs md:text-sm lg:text-md">
                      <h1 className="md:text-xs lg:text-md">{item.Amount}</h1>
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
          <div className="h-100 md:h-106 xl:h-112 min-w-80 md:w-4/5 xl:w-11/12 border-b-2 md:border-b-0 overflow-y-auto space-y-1 bg-white md:shadow-md shadow-gray-300 md:rounded-md">
            <div className="grid md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-12 pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm md:text-xs lg:text-md xl:text-16  md:pr-0">
                Completed Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 md:gap-5 text-gray-700  xl:gap-6 p-1 space-y-0 items-center md:pl-4 lg:pl-8 border-b-2 ">
              <div className="grid grid-cols-2 sticky top-20 text-sm md:text-sm lg:text-md gap-4 md:gap-3 lg:gap-0 pl-4 sm:pl-8 md:pl-0 xl:pl-4  pr-4">
                <h1>Date</h1>
                <h1>Description</h1>
              </div>
              <div className="grid grid-cols-2 text-sm md:text-md items-center gap-7 lg:gap-10 xl:gap-4">
                {" "}
                <h1 className="">Amount</h1>
                <h1>Status</h1>
              </div>
            </div>
            {!recentTransactions ? (
              <div className="grid items-center h-4/5 text-gray-700 justify-center">
                <p className=" pt-0">There is no recent transactions</p>
              </div>
            ) : recentTransactions.filter((item) => item.Status === "completed")
                .length < 1 ? (
              <div className="grid items-center h-4/5 text-gray-700 justify-center">
                <p className=" pt-0">There is no completed transactions</p>
              </div>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "completed")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5 lg:gap-7 xl:gap-6 p-1 space-y-0 text-gray-700 items-center pl-4 sm:pl-8 md:pl-3 lg:pl-8 xl:pl-12 pr-4  border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-2 xl:gap-5 items-center text-xs md:text-sm lg:text-md">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md flex items-center">
                        {item.Name}
                      </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-0 pl-5 md:pl-4 lg:pl-4 xl:pl-0 text-xs md:text-sm lg:text-md">
                      <h1 className="md:text-xs lg:text-md">{item.Amount}</h1>
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
          <div className="h-100 md:max-h-80 md:w-4/5 lg:w-4/5 xl:w-11/12 border-b-2 md:border-b-0 overflow-y-auto md:-mt-80 lg:-mt-92 space-y-1 bg-white md:shadow-md shadow-gray-300 md:rounded-md">
            <div className="grid md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-12 pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm md:text-xs lg:text-md xl:text-16 md:pr-0">
                Canceled Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 md:gap-5 text-gray-700 xl:gap-0 p-1 space-y-0 items-center md:pl-4 lg:pl-8 border-b-2 overflow-y-auto">
              <div className="grid grid-cols-2 sticky top-20 text-sm md:text-md gap-4 md:gap-3 pl-4 sm:pl-8 md:pl-0 xl:pl-4 pr-4">
                <h1>Date</h1>
                <h1>Description</h1>
              </div>
              <div className="grid grid-cols-2 text-sm md:text-md items-center gap-7 lg:gap-10 xl:gap-4">
                <h1 className="">Amount</h1>
                <h1>Status</h1>
              </div>
            </div>
            {!recentTransactions ? (
              <div className="grid items-center h-1/2 text-gray-700 justify-center">
                <p className="">There is no recent transactions</p>
              </div>
            ) : recentTransactions.filter((item) => item.Status === "canceled")
                .length < 1 ? (
              <div className="grid items-center h-1/2 text-gray-700 justify-center">
                <p className="">There is no canceled transactions</p>
              </div>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "canceled")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5 lg:gap-7 xl:gap-6 p-1 space-y-0 text-gray-700 items-center pl-4 sm:pl-8 md:pl-3 lg:pl-8 xl:pl-12 pr-4 border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-3 md:gap-6 xl:gap-5 items-center text-xs md:text-sm lg:text-md">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md">{item.Name}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-5 lg:gap-5 xl:gap-0 pl-5 md:pl-4 lg:pl-4 xl:pl-0 text-xs md:text-sm lg:text-md">
                      <h1 className="md:text-xs lg:text-md">{item.Amount}</h1>
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
        </div>
      </div>
    </>
  );
}

export default memo(Transactions);
