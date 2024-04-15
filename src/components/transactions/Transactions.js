import React, { memo, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../../App";
import Menu from "../utils/Menu";
import SideBar from "../utils/SideBar";
import { useIdleTimer } from "react-idle-timer";
import axios from "axios";
import ConfirmedTransactions from "./ConfirmedTransactions";
import FooterComponent from "../utils/FooterComponent";
import { paymentFailedSvg } from "../utils/CautionSvg";
import AlertModal from "../utils/AlertModal";

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
    signOutAlert,
    setSignOutAlert,
    logOutCanceled,
    clearAll,
  } = useContext(store);

  const logOutConfirmed = () => {
    setSignOutAlert(false);
    clearSession();
    clearAll();
    setLogOut(true);
    navigate("/");
  };
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  const buttons = [
    {
      label: "Yes",
      method: logOutConfirmed,
      bg: "bg-gray-800 focus:ring-gray-600 text-lg font-semibold",
    },
    {
      label: "No",
      method: logOutCanceled,
      bg: "bg-red-600 focus:ring-gray-600 text-lg font-semibold",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalItems = recentTransactions ? recentTransactions.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  const currentTransactions = recentTransactions
    ? recentTransactions.reverse().slice(startIndex, endIndex + 1)
    : [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Home":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/beneficiaries");
        }
        setIsProfileClicked(false);
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries");
        setIsProfileClicked(false);
        break;
      case "Log Out":
        setSignOutAlert(true);
        break;
      default:
        return;
    }
  };

  const getMenuProps = () => {
    if (windowWidth > 640) {
      return {
        nav: ["Beneficiaries", "Log Out"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav: ["Back", "Log Out"],
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
      .post("http://localhost:8080/api/transaction/transactionDetails", {
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
        console.log(data.transactions);
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
      {windowWidth > 640 ? null : isProfileClicked ? (
        <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
      ) : null}

      <div className="h-full md:h-full w-screen pb-36 fixed font-poppins bg-white text-white">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        <ConfirmedTransactions
          data={{
            currentTransactions,
            handlePageChange,
            currentPage,
            totalPages,
            windowWidth,
          }}
        />
        <FooterComponent />
      </div>
      {signOutAlert ? (
        <AlertModal
          buttons={buttons}
          icon={paymentFailedSvg}
          msg={"Do you want to sign out?"}
        />
      ) : null}
    </>
  );
}

export default memo(Transactions);
