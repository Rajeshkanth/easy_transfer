import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Loader from "./Loader";
import { useIdleTimer } from "react-idle-timer";
import SaveAccountForm from "./SaveAccountForm";

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
  } = useContext(store);

  const [savedAccNum, setSavedAccNum] = useState("");
  const [savedBeneficiaryName, setSavedBeneficiaryName] = useState("");
  const [savedIfsc, setSavedIfsc] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  const [allInputsAlert, setAllInputsAlert] = useState(false);
  const [plusIcon, setPlusIcon] = useState(false);
  const clickable = savedAccNum.length > 15;

  const clearAllInputs = () => {
    setSavedBeneficiaryName("");
    setSavedAccNum("");
    setSavedIfsc("");
  };

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Profile":
        setSavedAcc([]);
        navigate("/profile", { state: { prevPath: location.pathname } });
        setIsProfileClicked(false);
        break;
      case "Home":
        navigate("/transferPage", { state: { prevPath: location.pathname } });
        setSavedAcc([]);
        setIsProfileClicked(false);
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
        setIsProfileClicked(false);
        setSavedAcc([]);
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
      case "Log Out":
        clearSession();
        clearAll();
        setLogOut(true);
        navigate("/");
        break;
      default:
        return;
    }
  };

  const getMenuProps = () => {
    if (windowWidth > 768) {
      return {
        nav: [
          { icon: <MdKeyboardArrowLeft />, id: "Back" },
          "Profile",
          "Transactions",
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
      nav: ["Back", "Profile", "Transactions", "Rewards", "Contact", "Log Out"],
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

  const handleSavedAccNum = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setSavedAccNum(sanitizedValue);
    }
  };

  const handleSavedBenificiaryName = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      setSavedBeneficiaryName(value);
    }
  };
  const handleSavedIfsc = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setSavedIfsc(value);
    }
  };

  const sendMoney = (index) => {
    const selectedBeneficiary = savedAcc[index];
    setToAccountHolderName(selectedBeneficiary.beneficiaryName);
    setToAccountNumber(selectedBeneficiary.accNum);
    setToIFSCNumber(selectedBeneficiary.ifsc);
    setSendByBeneficiaries(true);
    navigate("/transferPage");
  };

  const saveBeneficiary = async () => {
    if (
      savedBeneficiaryName &&
      savedAccNum &&
      savedIfsc &&
      String(savedAccNum).length > 15 &&
      String(savedIfsc).length > 9
    ) {
      try {
        if (connectionMode !== "socket") {
          await axios
            .post("http://localhost:8080/addNewBeneficiary", {
              savedBeneficiaryName: savedBeneficiaryName,
              savedAccNum: savedAccNum,
              savedIfsc: savedIfsc,
              mobileNumber: sessionStorage.getItem("mobileNumber"),
            })
            .then((res) => {
              switch (res.status) {
                case 200:
                  const savedDetail = {
                    beneficiaryName: res.data.beneficiaryName,
                    accNum: res.data.accNum,
                    ifsc: res.data.ifsc,
                  };
                  setSavedAcc((prev) => [...prev, savedDetail]);
                  break;
                case 409:
                  alert("Account number already saved");
                  break;
                default:
                  break;
              }
            });
        } else {
          socket.emit("saveNewBeneficiary", {
            savedBeneficiaryName: savedBeneficiaryName,
            savedAccNum: savedAccNum,
            savedIfsc: savedIfsc,
            mobileNumber: sessionStorage.getItem("mobileNumber"),
          });
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setPlusIcon(false);
        setAllInputsAlert(false);
        setLoader(false);
      }
      clearAllInputs();
    } else {
      setAllInputsAlert(true);
    }
  };

  const addNewBeneficiary = () => {
    setPlusIcon(true);
  };

  const closeBeneficiaryAdding = () => {
    setPlusIcon(false);
    clearAllInputs();
    setAllInputsAlert(false);
  };

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    if (
      clickable &&
      savedBeneficiaryName &&
      savedAccNum &&
      savedIfsc &&
      String(savedAccNum).length > 15 &&
      String(savedIfsc).length > 9
    ) {
      saveBeneficiary();
    } else {
      setAllInputsAlert(true);
    }
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
      .post("http://localhost:8080/getBeneficiaryDetails", {
        mobileNumber: sessionStorage.getItem("mobileNumber"),
      })
      .then((res) => {
        setSavedAcc(res.data);
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

  return (
    <>
      {isProfileClicked ? (
        <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
      ) : null}
      <div className="h-auto md:h-screen w-screen pb-8 md:fixed  bg-gray-800 text-white">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        <div className="h-4/5 md:h-screen m-auto bg-white block md:flex  md:pl-0 box-border">
          <div className="m-auto h-screen md:h-9/10 w-full text-gray-800 bg-white pt-32 sm:pt-16 md:pt-0 mt-0 pb-4 md:pb-16 box-border overflow-x-auto space-y-2 lg:space-y-0">
            <div
              className={
                windowWidth < 450
                  ? "grid grid-cols-3 gap-0 fixed sm:sticky top-16 sm:top-0 h-auto z-10 pt-4 md:pt-3 pb-5 text-white bg-gray-800 w-full pl-8 sm:pl-16"
                  : "grid grid-cols-4 gap-0 fixed sm:sticky top-16 sm:top-0 h-auto z-10 pt-4 md:pt-3 pb-5 text-white bg-gray-800 w-full pl-8 sm:pl-16 xl:pl-24"
              }
            >
              <h1 className="font-bold w-1/4 text-sm md:text-sm xl:text-xl items-center flex -ml-4 md:ml-0">
                Name
              </h1>
              <h1 className="font-bold w-1/4 text-sm md:text-sm xl:text-xl items-center flex -ml-8">
                Account
              </h1>
              {windowWidth < 450 ? null : (
                <h1 className="font-bold w-1/4 text-sm md:text-sm xl:text-lg items-center flex">
                  IFSC
                </h1>
              )}
              <h1
                className="font-bold w-full md:w-4/5 py-2 lg:w-3/5 -ml-4 md:mr-3 border-2 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-800 text-center text-xs md:text-sm xl:text-lg bg-white text-gray-700"
                onClick={addNewBeneficiary}
              >
                + Add Beneficiary
              </h1>
            </div>
            {savedAcc.length !== 0 ? (
              savedAcc
                .filter((item) => String(item.accNum).length > 15)
                .map((item, index) => (
                  <div
                    key={index}
                    className={
                      windowWidth < 450
                        ? "grid grid-cols-3 h-auto z-10 pt-5 pb-3 text-gray-700 w-full pl-8 pr-4"
                        : "grid grid-cols-4 h-auto z-10 pt-3 pb-3 text-gray-700 w-full pl-8 sm:pl-16 xl:pl-24 pr-4 md:pr-20 lg:pr-24 xl:pr-32"
                    }
                  >
                    <h1 className="flex items-center capitalize text-xs md:text-sm xl:text-16 -ml-4 md:ml-0">
                      {item.beneficiaryName}
                    </h1>
                    <h1 className="flex items-center text-xs md:text-sm xl:text-16 -ml-8">
                      {item.accNum}
                    </h1>
                    {windowWidth < 450 ? null : (
                      <h1 className="flex items-center text-xs uppercase md:text-sm xl:text-16 md:ml-4 lg:ml-8 xl:ml-12">
                        {item.ifsc}
                      </h1>
                    )}
                    <button
                      onClick={() => sendMoney(index)}
                      className="text-xs px-4 py-3 md:text-16 lg:px-2 w-3/4 md:w-3/4 lg:w-1/2 ml-4 md:ml-16 lg:ml-20 xl:ml-24 border border-gray-300 focus:outline-none rounded-lg bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                ))
            ) : (
              <p className="grid items-center w-full justify-center h-full">
                You don't have any saved accounts, yet.
              </p>
            )}
          </div>

          {plusIcon ? (
            <SaveAccountForm
              data={{
                closeBeneficiaryAdding,
                handleSaveButtonClick,
                savedBeneficiaryName,
                allInputsAlert,
                handleSavedBenificiaryName,
                savedIfsc,
                savedAccNum,
                handleSavedAccNum,
                handleSavedIfsc,
              }}
            />
          ) : null}
        </div>
      </div>

      {loader ? (
        <>
          <div className="fixed h-screen w-screen top-0">
            <Loader bg={"bg-transparent backdrop-blur-md"} />
          </div>
        </>
      ) : null}
    </>
  );
}

export default memo(Beneficiaries);
