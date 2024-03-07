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
import PendingTransactions from "./PendingTransactions";
import CanceledTransactions from "./CanceledTransactions";
import ConfirmedTransactions from "./ConfirmedTransactions";

function Transactions() {
  const {
    clearSession,
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
        clearSession();
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
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      })
      .then((res) => {
        setRecentTransactions(res.data.transactions);
      })
      .catch((err) => console.log(err));

    socket.emit("getTransactionDetails", {
      mobileNumber: sessionStorage.getItem("mobileNumber"),
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      socket.on("transactionDetailsFromDb", (data) => {
        const transaction = {
          date: data.date,
          name: data.name,
          status: data.status,
          amount: data.amount,
        };
        const isAlreadyStored = recentTransactions.some((detail) => {
          return (
            detail.date === transaction.date &&
            detail.name === transaction.name &&
            detail.status === transaction.status &&
            detail.amount === transaction.amount
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
          <PendingTransactions data={{ recentTransactions }} />
          <CanceledTransactions data={{ recentTransactions }} />
          <ConfirmedTransactions data={{ recentTransactions }} />
        </div>
      </div>
    </>
  );
}

export default memo(Transactions);
