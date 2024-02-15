import React, { memo, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../App";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdArrowBackIos } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

function Transactions() {
  const {
    initatedAmountSend,
    setInitatedAmountSend,
    connectionMode,
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
  } = useContext(store);

  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  // const [logout, setlogout] = useState(true);

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
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
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
      case "Beneficiaries":
        navigate("/Beneficiaries");
        setIsProfileClicked(false);
        break;
      case "Log out":
        setSavedAcc([]);
        setRecentTransactions([]);
        const tabId = sessionStorage.getItem("tabId");
        sessionStorage.clear();
        if (tabId) {
          sessionStorage.setItem("tabId", tabId);
        }
        setLogOut(true);
        setIsProfileClicked(false);
        navigate("/");

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
          "Profile",
          "Rewards",
          "Contact",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          { icon: <FaArrowLeftLong />, id: "Back" },
          ,
          "Beneficiaries",
          "Profile",
          "Rewards",
          "Contact",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: [{ icon: <FaArrowLeftLong />, id: "Back" }, "Profile", "Menu"],
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

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.emit("getTransactionDetails", {
        num: document.cookie,
      });
    }

    return () => {
      if (connectionMode !== "socket") {
      } else {
        socket.off();
      }
    };
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (connectionMode !== "socket") {
  //     } else {
  //       socket.on("transactionDetailsFromDb", (data) => {
  //         const transaction = {
  //           Date: data.Date,
  //           Name: data.Name,
  //           Status: data.Status,
  //           Amount: data.Amount,
  //         };

  //         const isAlreadyStored = recentTransactions.some((detail) => {
  //           return (
  //             detail.Date === transaction.Date &&
  //             detail.Name === transaction.Name &&
  //             detail.Status === transaction.Status &&
  //             detail.Amount === transaction.Amount
  //           );
  //         });
  //         if (!isAlreadyStored)
  //           setRecentTransactions((prev) => [...prev, transaction]);
  //       });
  //       const length = recentTransactions.length;
  //       setRecentTransactionsLength(length);
  //     }
  //   };
  //   fetchData();
  //   return () => {
  //     if (connectionMode !== "socket") {
  //     } else {
  //       socket.off();
  //     }
  //   };
  // }, [socket]);

  useEffect(() => {
    const transactions = sessionStorage.getItem("savedTransactions");
    console.log(transactions);
    setRecentTransactions(JSON.parse(transactions));
  }, []);
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
      <div className="h-auto md:h-screen w-screen pt-0 md:pt-2 pb-[2rem] md:fixed font-poppins bg-gray-800 text-white">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        {/* <div className="w-full h-full md:w-[33%] md:h-[90vh] overflow-auto bg-white  font-poppins text-gray-700  mt-[0vh]">
          <ul className="grid grid-cols-4 gap-0 w-full font-bold text-lg fixed top-[10%] md:sticky  md:top-0  p-3 pl-[3vw]  bg-gray-800 text-white">
            <li>Date</li>
            <li>Name</li>
            <li>Amount</li>
            <li>Status</li>
          </ul>
          <div className="space-y-0 h-auto  ">
            {recentTransactions.map((item, index) => (
              <ul
                key={index}
                className="text-gray-700 h-auto grid grid-cols-4 text-xs sm:text-sm md:text-lg lg:text-xl p-3 pl-[3vw] cursor-default bg-white "
              >
                {" "}
                <li>{item.Date}</li>
                <li className="">{item.Name}</li>
                <li>{item.Amount}</li>
                <li
                  className={
                    item.Status === "completed"
                      ? "md:text-lg lg:text-xl text-green-600 capitalize "
                      : item.Status === "canceled"
                      ? "md:text-lg lg:text-xl text-red-800 capitalize "
                      : "md:text-lg lg:text-xl text-yellow-400 capitalize "
                  }
                >
                  {item.Status}
                </li>
              </ul>
            ))}
          </div>
        </div> */}
        <div className=" grid  pt-[10vh] md:pt-0 md:grid-cols-2 gap-0 lg:gap-10 md:pl-[7vw] lg:pl-[6vw] md:mt-[4vh] box-border">
          <div className="h-[30vh] md:h-[30vh] lg:h-[30vh]  md:w-[35vw] lg:w-[35vw] xl:w-[40vw] border-b-2 md:border-b-0 overflow-y-auto    space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
            <div className="grid  md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-[6vh] pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm  md:text-xs lg:text-md xl:text-xl  md:pr-0 ">
                Pending Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 lg:gap-5 text-gray-700  xl:gap-6 p-1 space-y-0 items-center md:pl-[1.5vw] lg:pl-[3.5vw] border-b-2 ">
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
            {recentTransactions === null ? (
              <p className="flex items-center text-gray-700 justify-center pt-[5rem]">
                There is no recent transactions
              </p>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "Pending")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5  lg:gap-7 xl:gap-12 p-1 space-y-0 text-gray-700 items-center pl-[5vw] md:pl-[1.5vw] lg:pl-[3.5vw] pr-[2vw] border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-6 lg:gap-2 xl:gap-10 items-center text-xs md:text-sm lg:text-md ">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md">{item.Name}</h1>
                    </div>
                    <div className="grid grid-cols-2 md:gap-5 lg:gap-8 pl-2 text-xs md:text-sm lg:text-md  ">
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
          <div className="h-[50vh] md:h-[80vh] lg:h-[80vh]  md:w-[40vw] lg:w-[40vw] xl:w-[40vw] border-b-2 md:border-b-0 overflow-y-auto    space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
            <div className="grid  md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-[6vh] pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm  md:text-xs lg:text-md xl:text-xl  md:pr-0">
                Completed Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 lg:gap-5 text-gray-700  xl:gap-6 p-1 space-y-0 items-center md:pl-[1.5vw] lg:pl-[3.5vw] border-b-2 ">
              <div className="grid grid-cols-2 sticky top-20 text-sm md:text-sm lg:text-md gap-4 md:gap-0 lg:gap-0 xl:gap-0 pl-[5vw] md:pl-0">
                <h1>Date</h1>
                <h1>Description</h1>
              </div>
              <div className="grid grid-cols-2 text-sm md:text-md items-center gap-5 lg:gap-10 xl:gap-4">
                {" "}
                <h1 className="">Amount</h1>
                <h1>Status</h1>
              </div>
            </div>
            {!recentTransactions ? (
              <p className="flex items-center text-gray-700 justify-center pt-[5rem]">
                There is no recent transactions
              </p>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "completed")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5  lg:gap-7 xl:gap-6 p-1 space-y-0 text-gray-700 items-center pl-[5vw] md:pl-[1.5vw] lg:pl-[3.5vw] pr-[2vw] border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-6 lg:gap-2 xl:gap-10 items-center text-xs md:text-sm lg:text-md ">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md flex items-center">
                        {item.Name}
                      </h1>
                    </div>
                    <div className="grid grid-cols-2 md:gap-5 lg:gap-5 pl-2 md:pl-5  text-xs md:text-sm lg:text-md  ">
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
          <div className="h-[50vh] md:h-[43vh] lg:h-[40vh]  md:w-[35vw] lg:w-[35vw] xl:w-[40vw] border-b-2 md:border-b-0 overflow-y-auto md:mt-[-43vh] lg:mt-[-47vh] xl:mt-[-25.5vw] space-y-1 bg-white  md:shadow-md shadow-gray-300  md:rounded-md">
            <div className="grid  md:gap-0 sticky top-0 z-10 bg-slate-700 text-white h-[6vh] pl-2 lg:pl-9 xl:pl-12 border-b-2 pt-2 items-center">
              <h1 className="text-sm  md:text-xs lg:text-md xl:text-xl  md:pr-0 ">
                Canceled Transactions
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-10 lg:gap-5 text-gray-700  xl:gap-0 p-1 space-y-0 items-center md:pl-[1.5vw] lg:pl-[3.5vw] border-b-2 overflow-y-auto">
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
            {!recentTransactions ? (
              <p className="flex items-center text-gray-700 justify-center pt-[5rem]">
                There is no recent transactions
              </p>
            ) : (
              recentTransactions
                .filter((item) => item.Status === "canceled")
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-5  lg:gap-7 xl:gap-6 p-1 space-y-0 text-gray-700 items-center pl-[5vw] md:pl-[1.5vw] lg:pl-[3.5vw] pr-[2vw] border-b-2"
                  >
                    <div className="grid grid-cols-2 gap-6 lg:gap-2 xl:gap-10 items-center text-xs md:text-sm lg:text-md ">
                      <h1 className="md:text-xs lg:text-md">{item.Date}</h1>
                      <h1 className="md:text-xs lg:text-md">{item.Name}</h1>
                    </div>
                    <div className="grid grid-cols-2 md:gap-5 lg:gap-5 pl-3  text-xs md:text-sm lg:text-md  ">
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
