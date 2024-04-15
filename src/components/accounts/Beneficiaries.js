import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../../App";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import Menu from "../utils/Menu";
import SideBar from "../utils/SideBar";
import Loader from "../utils/Loader";
import { useIdleTimer } from "react-idle-timer";
import HomePageSavedAccounts from "./HomePageSavedAccounts";
import PaymentPage from "../PaymentPage";
import Profile from "../utils/Profile";
import RecentTransactions from "../transactions/RecentTransactions";
import FooterComponent from "../utils/FooterComponent";
import AlertModal from "../utils/AlertModal";
import { toast } from "sonner";

function Beneficiaries() {
  const {
    clearSession,
    setIsLoggedOut,
    handleSocket,
    socket,
    connectionMode,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    setToAccountNumber,
    setToIFSCNumber,
    setToAccountHolderName,
    setSendByBeneficiaries,
    savedAcc,
    setSavedAcc,
    isProfileClicked,
    setIsProfileClicked,
    setLogOut,
    setNotify,
    setRecentTransactions,
    clearAll,
    setRecentActivity,
    recentActivity,
    signOutAlert,
    setSignOutAlert,
    logOutCanceled,
  } = useContext(store);

  const [savedAccNum, setSavedAccNum] = useState("");
  const [savedBeneficiaryName, setSavedBeneficiaryName] = useState("");
  const [savedIfsc, setSavedIfsc] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [allInputsAlert, setAllInputsAlert] = useState(false);
  const [plusIcon, setPlusIcon] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [newReceiver, setNewReceiver] = useState(false);

  const clearAllInputs = () => {
    setSavedBeneficiaryName("");
    setSavedAccNum("");
    setSavedIfsc("");
  };
  const logOutConfirmed = () => {
    setSignOutAlert(false);
    clearSession();
    clearAll();
    setLogOut(true);
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

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Home":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setSavedAcc([]);
        setIsProfileClicked(false);
      case "Transactions":
        navigate("/transactions");
        setSavedAcc([]);
        setIsProfileClicked(false);
        break;
      case "Log Out":
        setSignOutAlert(true);
        break;
      default:
        return;
    }
  };

  const paymentFailedSvgPattern = () => {
    return (
      <svg
        class="mx-auto mb-4 text-gray-500 w-12 h-12 "
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );
  };
  const paymentFailedSvg = paymentFailedSvgPattern();

  const getMenuProps = () => {
    if (windowWidth > 640) {
      return {
        nav: ["Transactions", "Log Out"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav: ["Transactions", "Log Out"],
      onClickHandler: handleMenuClick,
    };
  };

  const sideBarProps = getSideBarProps();

  const logout = () => {
    setLoggedUser("");
    navigate("/");
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

  const sendMoney = (index) => {
    const selectedBeneficiary = savedAcc[index];
    setToAccountHolderName(selectedBeneficiary.beneficiaryName);
    setToAccountNumber(selectedBeneficiary.accountNumber);
    setToIFSCNumber(selectedBeneficiary.ifsc);
    setSendByBeneficiaries(true);
    setNewReceiver(true);
  };

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

  // const saveBeneficiary = async () => {
  //   try {
  //     if (connectionMode !== "socket") {
  //       await axios
  //         .post("http://localhost:8080/api/user/addNewBeneficiary", {
  //           beneficiaryName: savedBeneficiaryName,
  //           accountNumber: savedAccNum,
  //           ifsc: savedIfsc,
  //           mobileNumber: sessionStorage.getItem("mobileNumber"),
  //         })
  //         .then((response) => {
  //           const savedDetail = {
  //             beneficiaryName: response.data.beneficiaryName,
  //             accountNumber: response.data.accountNumber,
  //             ifsc: response.data.ifsc,
  //           };
  //           switch (response.status) {
  //             case 200:
  //               setSavedAcc((prev) => [...prev, savedDetail]);
  //               break;
  //             case 400:
  //               console.log("exists");
  //               toast("Account already exists");
  //               break;
  //             default:
  //               toast("Something went wrong");
  //               break;
  //           }
  //         });
  //     } else {
  //       socket.emit("saveNewBeneficiary", {
  //         savedBeneficiaryName: savedBeneficiaryName,
  //         savedAccNum: savedAccNum,
  //         savedIfsc: savedIfsc,
  //         mobileNumber: sessionStorage.getItem("mobileNumber"),
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setPlusIcon(false);
  //     setAllInputsAlert(false);
  //     setLoader(false);
  //   }
  //   clearAllInputs();
  // };

  const transferPage = () => {
    setNewReceiver(!newReceiver);
  };

  useEffect(() => {
    socket.on("getSavedBeneficiary", async (data) => {
      const savedDetail = {
        beneficiaryName: data.beneficiaryName,
        accNum: data.accNum,
        ifsc: data.ifsc,
      };
      setSavedAcc((prev) => [...prev, savedDetail]);
      setLoader(false);
    });

    const fetchData = async () => {
      await socket.on("allSavedAccounts", async (data) => {
        const savedDetail = {
          beneficiaryName: data.beneficiaryName,
          accNum: data.accNum,
          ifsc: data.ifsc,
        };
        if (String(savedDetail.accNum).length > 15) {
          setSavedAcc((prevSavedAcc) => {
            const updatedSavedAcc = prevSavedAcc
              ? [...prevSavedAcc, savedDetail]
              : [savedDetail];
            return updatedSavedAcc;
          });
        }
      });
    };
    fetchData();
  }, [socket]);

  useEffect(() => {
    axios
      .post("http://localhost:8080/api/user/getBeneficiaryDetails", {
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      })
      .then((res) => {
        console.log(res.data);
        setSavedAcc(res.data);
        console.log(savedAcc);
      })
      .catch((err) => {
        return err;
      });

    socket.emit("getSavedAccounts", {
      mobileNumber: sessionStorage.getItem("mobileNumber"),
    });

    setTimeout(() => {
      setNotify(false);
    }, 3000);

    return () => {
      socket.off();
      setSavedAcc([]);
      setLogOut(false);
      setNotify(true);
    };
  }, []);

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
    const loggedNumber = sessionStorage.getItem("mobileNumber");

    axios
      .post("http://localhost:8080/api/transaction/transactionDetails", {
        mobileNumber: loggedNumber,
      })
      .then((res) => {
        setRecentActivity(res.data.transactions);
      })
      .catch((err) => console.log(err));

    return () => {
      socket.off();
      setRecentActivity([]);
    };
  }, []);

  return (
    <>
      {isProfileClicked ? (
        <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
      ) : null}

      <div className="h-auto md:h-screen w-screen md:fixed sm:pb-8 bg-white text-white font-poppins">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        <div className="h-auto md:h-full w-screen m-auto block md:flex justify-between md:gap-8 lg:gap-8 xl:gap-24 box-border px-6 pt-24 md:pt-0 md:mt-8">
          {windowWidth < 640 ? (
            <button
              className=" w-full text-white font-base mb-4 border bg-gray-800 py-2 rounded-xl"
              onClick={transferPage}
            >
              New Transfer
            </button>
          ) : null}
          <div className="md:max-w-xl lg:max-w-xs md:w-2/5 xl:w-1/2 h-full md:h-auto bg-transparent ">
            <Profile />
            <RecentTransactions data={{ recentActivity, goTo, windowWidth }} />
          </div>

          <div className="h-auto w-auto md:w-3/5 lg:w-3/4 px-0 md:px-1 pb-8 md:pb-36 mt-8 md:mt-0">
            <HomePageSavedAccounts
              data={{
                transferPage,
                savedAcc,
                filteredAccounts,
                searchBarActive,
                sendMoney,
                searchBarActive,
                setSearchBarActive,
                setFilteredAccounts,
                windowWidth,
              }}
            />
          </div>
        </div>
        {windowWidth > 768 ? <FooterComponent /> : null}
      </div>

      {windowWidth < 768 ? (
        <div className="relative pt-0">
          <FooterComponent />
        </div>
      ) : null}

      {loader ? (
        <div className="fixed h-screen w-screen top-0">
          <Loader bg={"bg-transparent backdrop-blur-md"} />
        </div>
      ) : null}

      {newReceiver ? (
        <PaymentPage
          data={{
            newReceiver,
            setNewReceiver,
            
          }}
        />
      ) : null}
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

export default memo(Beneficiaries);
