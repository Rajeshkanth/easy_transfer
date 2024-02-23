import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { CgClose } from "react-icons/cg";
import { json, useLocation, useNavigate } from "react-router";
import Menu from "./Menu";
import SideBar from "./SideBar";
import { RiMenuUnfoldFill } from "react-icons/ri";
// import { MdKeyboardArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Loader from "./Loader";
import { useIdleTimer } from "react-idle-timer";

function Beneficiaries() {
  const {
    setIsLoggedOut,
    handleSocket,
    socket,
    connectionMode,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    userNameFromDb,
    setUserNameFromDb,
    setToAccountNumber,
    setToIFSCNumber,
    setToAccountHolderName,
    sendByBeneficiaries,
    setSendByBeneficiaries,
    savedAcc,
    setSavedAcc,
    isProfileClicked,
    setIsProfileClicked,
    logOut,
    setLogOut,
    notify,
    setNotify,
    setPlusIcon,
    plusIcon,
    setRecentTransactions,
    clearAll,
  } = useContext(store);

  // const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState(false);
  const [savedAccNum, setSavedAccNum] = useState("");
  const [savedBeneficiaryName, setSavedBeneficiaryName] = useState("");
  const [savedIfsc, setSavedIfsc] = useState("");
  const [loader, setLoader] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newValueAdded, setNewValueAdded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  const [allInputsAlert, setAllInputsAlert] = useState(false);
  const [newBeneficiarySended, setNewBeneficiarySended] = useState(false);

  const clickable = savedAccNum.length > 15;

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Menu":
        setIsProfileClicked(true);
        break;
      case "Profile":
        setSavedAcc([]);
        navigate("/Profile", { state: { prevPath: location.pathname } });
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
      case "Log Out":
        clearAll();
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
          "Profile",
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
          ,
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
    console.log("user is idle");

    setTimeout(() => {
      handleSocket();
      setSavedAcc([]);
      setRecentTransactions([]);
      setIsLoggedOut(true);
      const tabId = sessionStorage.getItem("tabId");
      sessionStorage.clear();
      if (tabId) {
        sessionStorage.setItem("tabId", tabId);
      }
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
    console.log("clicked");
    console.log(index);
    const selectedBeneficiary = savedAcc[index];
    setToAccountHolderName(selectedBeneficiary.beneficiaryName);
    setToAccountNumber(selectedBeneficiary.accNum);
    setToIFSCNumber(selectedBeneficiary.ifsc);
    setSendByBeneficiaries(true);
    navigate("/transferPage");
  };

  const saveBeneficiary = () => {
    if (
      savedBeneficiaryName &&
      savedAccNum &&
      savedIfsc &&
      String(savedAccNum).length > 15 &&
      String(savedIfsc).length > 9
    ) {
      setNewValueAdded(true);
      if (connectionMode !== "socket") {
      } else {
        socket.emit("saveNewBeneficiary", {
          SavedBeneficiaryName: savedBeneficiaryName,
          SavedAccNum: savedAccNum,
          SavedIfsc: savedIfsc,
          editable: false,
          num: document.cookie,
        });
        setNewBeneficiarySended(true);
        setLoader(true);
      }

      clearAllInputs();
    } else {
      setAllInputsAlert(true);
    }
  };

  const clearAllInputs = () => {
    setSavedBeneficiaryName("");
    setSavedAccNum("");
    setSavedIfsc("");
  };
  const addNewBeneficiary = () => {
    setPlusIcon(true);
  };

  const closeBeneficiaryAdding = () => {
    setPlusIcon(false);
    clearAllInputs();
    setAllInputsAlert(false);
  };

  const handleSaveButtonClick = () => {
    if (
      clickable &&
      savedBeneficiaryName &&
      savedAccNum &&
      savedIfsc &&
      String(savedAccNum).length > 15 &&
      String(savedIfsc).length > 9
    ) {
      setPlusIcon(false);
      saveBeneficiary();
      setAllInputsAlert(false);
    } else {
      setAllInputsAlert(true);
    }
  };

  useEffect(() => {
    return () => {
      setSavedAcc([]);
      setLogOut(false);
    };
  }, []);

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
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
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
      });
    }
    // console.log(savedAcc);
  }, [userNameFromDb, connectionMode, socket]);

  const storeDetailsInsession1 = (savedDetail) => {
    setSavedAcc([savedDetail]);
  };

  const storeDetailsInsession2 = (savedDetail) => {
    setSavedAcc((prev) => [...prev, savedDetail]);
  };

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.on("getSavedBeneficiary", async (data) => {
        const savedDetail = {
          beneficiaryName: data.beneficiaryName,
          accNum: data.accNum,
          ifsc: data.ifsc,
          editable: data.editable,
        };
        console.log(savedAcc, "before");
        setSavedAcc((prev) => [...prev, savedDetail]);
        console.log(savedAcc, "after");

        setLoader(false);
        setNewBeneficiarySended(false);
      });
    }
  }, []);

  useEffect(() => {
    socket.emit("fetchList", {
      num: document.cookie,
      emit: "emitted from ben",
    });
    console.log("event emitted", document.cookie);

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await socket.on("allSavedAccounts", async (data) => {
        await console.log(data.emitted);
        const savedDetail = {
          beneficiaryName: data.beneficiaryName,
          accNum: data.accNum,
          ifsc: data.ifsc,
          editable: data.editable,
        };

        if (String(savedDetail.accNum).length > 15) {
          const isAlreadyStored = savedAcc
            ? savedAcc.some((detail) => {
                return (
                  detail.beneficiaryName === savedDetail.beneficiaryName &&
                  detail.accNum === savedDetail.accNum &&
                  detail.ifsc === savedDetail.ifsc &&
                  detail.editable === savedDetail.editable
                );
              })
            : false;

          if (!isAlreadyStored) {
            setSavedAcc((prevSavedAcc) => {
              const updatedSavedAcc = prevSavedAcc
                ? [...prevSavedAcc, savedDetail]
                : [savedDetail];
              sessionStorage.setItem(
                "savedAcc",
                JSON.stringify(updatedSavedAcc)
              );
              return updatedSavedAcc;
            });
          }
        }
        console.log("event received");
      });
    };

    fetchData();
    console.log("from effect");
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
    setTimeout(() => {
      setNotify(false);
    }, 3000);
    return () => {
      setNotify(true);
    };
  }, []);

  return (
    <>
      {isProfileClicked ? (
        <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
      ) : null}
      <div className="h-auto md:h-screen w-screen pb-[2rem] md:fixed  bg-gray-800 text-white">
        {/* <div className="h-[10vh]  items-center    flex box-border z-[10] bg-gray-800 sticky top-0"> */}
        <Menu {...menuProps} onClickHandler={handleMenuClick} />
        {/* </div> */}

        <div className="h-[80vh] md:h-screen   m-auto  bg-white block md:flex  md:pl-[0rem] box-border">
          <div className="m-auto h-screen sm:h-[90vh] w-[100%]   text-gray-800   bg-white pt-[18vh] sm:pt-[10vh] md:pt-0 mt-[0rem] pb-[1rem] box-border overflow-x-auto space-y-2 lg:space-y-0">
            <div
              className={
                windowWidth < 450
                  ? "grid grid-cols-3 gap-0 fixed sm:sticky top-[7vh] sm:top-0  h-auto  z-10 pt-[4vh] sm:pt-[4vh] md:pt-3 pb-5  text-white bg-gray-800 w-[100%] pl-[8vw] sm:pl-[10vw]"
                  : "grid grid-cols-4 gap-0 fixed sm:sticky top-[7vh] sm:top-0  h-auto  z-10 pt-[4vh] sm:pt-[4vh] md:pt-3 pb-5  text-white bg-gray-800 w-[100%] pl-[8vw] sm:pl-[10vw]"
              }
            >
              <h1 className="font-bold w-1/4 text-sm md:text-sm  xl:text-xl items-center flex">
                Name
              </h1>
              <h1 className="font-bold w-1/4 text-sm  md:text-sm xl:text-xl items-center flex ml-[-3.5vw] md:ml-[-2.5vw]">
                Account
              </h1>
              {windowWidth < 450 ? null : (
                <h1 className="font-bold w-1/4 text-sm  md:text-sm xl:text-lg items-center flex">
                  IFSC
                </h1>
              )}
              <h1
                className="font-bold w-full md:w-[80%] py-2  lg:w-[60%] ml-[-3vw] md:ml-[-1.4vw] border-2 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-800 text-center  text-[10px] md:text-sm xl:text-lg  bg-white text-gray-700"
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
                        ? "grid grid-cols-3    h-auto  z-10  pt-3 pb-3 text-gray-700  w-[100%] pl-[8vw] sm:pl-[10vw] pr-[4vw] md:pr-[9vw]"
                        : "grid grid-cols-4    h-auto  z-10  pt-3 pb-3 text-gray-700  w-[100%] pl-[8vw] sm:pl-[10vw] pr-[4vw] md:pr-[9vw]"
                    }
                  >
                    <h1 className="flex items-center capitalize text-xs md:text-sm   xl:text-[16px]">
                      {" "}
                      {item.beneficiaryName}
                    </h1>
                    <h1 className="flex items-center  text-xs md:text-sm xl:text-[16px] ml-[-9vw] sm:ml-[-6vw] md:ml-[-2vw]">
                      {item.accNum}
                    </h1>
                    {windowWidth < 450 ? null : (
                      <h1 className="flex items-center  text-xs uppercase  md:text-sm xl:text-[16px]  md:ml-[3vw]">
                        {" "}
                        {item.ifsc}
                      </h1>
                    )}
                    <button
                      onClick={() => sendMoney(index)}
                      className="text-xs px-4 py-3 md:text-[16px] lg:px-2 w-3/4 md:w-3/4 lg:w-1/2  ml-[4vw] md:ml-[7vw] border border-gray-300  focus:outline-none rounded-lg  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                ))
            ) : (
              <>
                {" "}
                <p className="grid items-center w-full justify-center h-full">
                  You don't have any saved accounts, yet.
                </p>
              </>
            )}
          </div>

          {plusIcon ? (
            <div className=" fixed top-0 box-border z-[200] backdrop-blur-xl h-screen w-screen">
              <div className=" w-3/4 m-auto   h-full pt-[10vh] md:pt-[20vh]  pb-[2vh] box-border">
                <div className="relative top-[13vh] cursor-pointer text-gray-700 text-xl text-bold left-[63vw] md:left-[59vw] lg:left-[56vw] h-[10vh] w-[10vw]">
                  <CgClose onClick={closeBeneficiaryAdding} />
                </div>
                <form
                  action=""
                  className="w-auto md:w-[80%] lg:w-[60%] min-h-[40%]  pb-[7vh] m-auto pt-[6vh] border-2 bg-white shadow-lg shadow-ash-800  mt-[0rem] text-gray-600 rounded-lg border-white  box-border"
                >
                  <div
                    className={
                      allInputsAlert
                        ? "w-[80%] m-auto space-y-1 sm:space-y-5 pt-[2vh] "
                        : "w-[80%] m-auto space-y-5 sm:space-y-5 pt-[2vh] "
                    }
                  >
                    <input
                      type="text"
                      className={
                        allInputsAlert && !savedBeneficiaryName
                          ? "block  w-full px-4 py-2 border-red-500  outline-none rounded-lg bg-white  border-2 "
                          : "block  w-full px-4 py-2 border-gray-300  outline-none rounded-lg bg-white  border-2 "
                      }
                      placeholder="Enter Beneficiary Name"
                      value={savedBeneficiaryName}
                      onChange={handleSavedBenificiaryName}
                      required
                    />
                    {allInputsAlert && !savedBeneficiaryName ? (
                      <p className=" sm:absolute  top-[-5vh] sm:top-[31.6vh] md:top-[41.8vh] lg:top-[41.8vh] xl:top-[41.2vh] text-xs text-red-600 pointer-events-none  box-border">
                        Enter name
                      </p>
                    ) : null}
                    <input
                      type="tel"
                      className={
                        allInputsAlert && !savedAccNum
                          ? "block w-full px-4 py-2   border-red-500  outline-none rounded-lg bg-white  border-2 "
                          : "block w-full px-4 py-2   border-gray-300  outline-none rounded-lg bg-white  border-2 "
                      }
                      placeholder="Enter Account Number"
                      value={savedAccNum}
                      onChange={handleSavedAccNum}
                      required
                      minLength={16}
                    />
                    {savedAccNum.length < 16 && savedAccNum ? (
                      <p className=" sm:absolute top-[-2vh] sm:top-[40.5vh] md:top-[50.5vh] lg:top-[50.8vh] xl:top-[49vh] text-xs text-red-600 pointer-events-none  box-border">
                        Account number should have 16 digits
                      </p>
                    ) : null}
                    {allInputsAlert && !savedAccNum ? (
                      <p className=" sm:absolute top-[-2vh] sm:top-[40.5vh] md:top-[50.5vh] lg:top-[50.8vh] xl:top-[49vh] text-xs text-red-600 pointer-events-none  box-border">
                        Enter account number
                      </p>
                    ) : null}
                    <input
                      type="text"
                      className={
                        allInputsAlert && !savedIfsc
                          ? "block w-full px-4 py-2 border-red-500  outline-none rounded-lg bg-white border-2 "
                          : "block w-full px-4 py-2 border-gray-300  outline-none rounded-lg bg-white border-2 "
                      }
                      placeholder="Enter IFSC Code"
                      value={savedIfsc}
                      onChange={handleSavedIfsc}
                      required
                    />
                    {allInputsAlert && !savedIfsc ? (
                      <p className=" sm:absolute top-[-2vh] sm:top-[49.6vh] md:top-[59.5vh] lg:top-[59.5vh] xl:top-[57vh]  text-xs text-red-600 pointer-events-none  box-border">
                        Enter IFSC code
                      </p>
                    ) : null}
                    {String(savedIfsc).length < 10 && savedIfsc ? (
                      <p className=" sm:absolute top-[-2vh] sm:top-[49.6vh] md:top-[59.5vh] lg:top-[59.5vh] xl:top-[57vh]  text-xs text-red-600 pointer-events-none  box-border">
                        IFSC code should have 10 digits
                      </p>
                    ) : null}
                    <input
                      type="button"
                      value="Save"
                      onClick={handleSaveButtonClick}
                      className="w-full py-2 hover:bg-gray-600 bg bg-gray-800 hover:cursor-pointer text-white rounded-lg"
                    />
                  </div>
                </form>
              </div>
            </div>
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
