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
        break;
      case "Home":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
        break;
      case "Rewards":
        console.log("Navigating to Rewards page");
        break;
      case "Contact":
        console.log("Navigating to Contact page");
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries");
        break;
      case "Log out":
        setSavedAcc([]);
        setLogOut(true);

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
        "Log out",
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

  useEffect(() => {
    const fetchData = async () => {
      if (connectionMode !== "socket") {
      } else {
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
      }
    };
    fetchData();
    return () => {
      if (connectionMode !== "socket") {
      } else {
        socket.off();
      }
    };
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
      <div className="h-auto md:h-screen w-screen pt-0 md:pt-2 pb-[2rem] md:fixed font-poppins bg-gray-800 text-white">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        <div className="w-full h-full md:w-[100%] md:h-[90vh] overflow-auto bg-white  font-poppins text-gray-700 m-auto mt-[0vh]">
          <ul className="grid grid-cols-4 gap-0 w-full font-bold text-lg fixed top-[10%] md:sticky  md:top-0  p-3 pl-[11vw]  bg-gray-800 text-white">
            <li>Date</li>
            <li>Name</li>
            <li>Amount</li>
            <li>Status</li>
          </ul>
          <div className="space-y-0 h-auto  ">
            {recentTransactions.map((item, index) => (
              <ul
                key={index}
                className="text-gray-700 h-auto grid grid-cols-4 text-xs sm:text-sm md:text-lg lg:text-xl p-3 pl-[11vw] cursor-default bg-white "
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
        </div>
      </div>
    </>
  );
}

export default memo(Transactions);
