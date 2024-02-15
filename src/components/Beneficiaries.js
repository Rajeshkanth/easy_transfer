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

function Beneficiaries() {
  const {
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
  } = useContext(store);

  // const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState(false);
  const [savedAccNum, setSavedAccNum] = useState("");
  const [savedBeneficiaryName, setSavedBeneficiaryName] = useState("");
  const [savedIfsc, setSavedIfsc] = useState("");

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
      case "Transactions":
        navigate("/Transactions");
        setIsProfileClicked(false);
        break;
      case "Log out":
        setSavedAcc([]);
        setRecentTransactions([]);
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
          "Profile",
          "Transactions",
          "Rewards",
          "Contact",
          "Log out",
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
          "Log out",
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

  const profile = () => {
    setIsProfileClicked(true);
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };
  const navigateToProfile = () => {
    navigate("/Profile");
  };

  const logout = () => {
    setLoggedUser("");
    // setSavedAcc([]);
    navigate("/");
  };

  const gotoTransferPage = () => {
    navigate("/transferPage");
  };

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
    if (savedBeneficiaryName && savedAccNum && savedIfsc) {
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
      }
      // if (savedBeneficiaryName && savedAccNum && savedIfsc) {
      //   const newBeneficiary = {
      //     beneficiaryName: savedBeneficiaryName,
      //     accNum: savedAccNum,
      //     ifsc: savedIfsc,
      //     editable: false, // Assuming this is the default value
      //   };
      //   setSavedAcc((prevList) => [...prevList, newBeneficiary]);
      // }

      clearAllInputs();
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
    if (clickable) {
      setPlusIcon(false);
      saveBeneficiary();
      setAllInputsAlert(false);
    } else {
      setAllInputsAlert(true);
    }
  };

  useEffect(() => {
    return () => {
      // setSavedAcc([]);
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

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.on("getSavedBeneficiary", (data) => {
        const savedDetail = {
          beneficiaryName: data.beneficiaryName,
          accNum: data.accNum,
          ifsc: data.ifsc,
          editable: data.editable,
        };
        // setSavedAcc((prev) => [...prev, savedDetail]);

        const isAlreadyStored =
          savedAcc === null
            ? false
            : savedAcc.some((detail) => {
                return (
                  detail.beneficiaryName === savedDetail.beneficiaryName &&
                  detail.accNum === savedDetail.accNum &&
                  detail.ifsc === savedDetail.ifsc &&
                  detail.editable === savedDetail.editable
                );
              });

        const storeDetailsInsession1 = () => {
          setSavedAcc([savedDetail]);
          sessionStorage.setItem("savedAcc", JSON.stringify([savedDetail]));
        };

        const storeDetailsInsession2 = () => {
          setSavedAcc((prev) => [...prev, savedDetail]);
          sessionStorage.setItem(
            "savedAcc",
            JSON.stringify([...savedAcc, savedDetail])
          );
        };
        // If savedDetail is not already present, update the savedAcc array
        if (!isAlreadyStored) {
          savedAcc === null
            ? storeDetailsInsession1()
            : storeDetailsInsession2();
        }

        setNewBeneficiarySended(false);
      });
    }
  }, [newBeneficiarySended]);

  // useEffect(() => {
  //   if (connectionMode !== "socket") {
  //   } else {
  //     socket.emit("fetchList", {
  //       num: document.cookie,
  //     });
  //   }
  // }, [socket]);

  useEffect(() => {
    const savedAcc = sessionStorage.getItem("savedAcc");
    setSavedAcc(JSON.parse(savedAcc));
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
              <h1 className="font-bold w-1/4 text-sm  md:text-sm xl:text-xl items-center flex ml-[-4vw] md:ml-[-3vw]">
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
                Add Beneficiary
              </h1>
            </div>
            {savedAcc !== null ? (
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
                    <h1 className="flex items-center capitalize text-xs md:text-sm  xl:text-[16px]">
                      {" "}
                      {item.beneficiaryName}
                    </h1>
                    <h1 className="flex items-center  text-xs md:text-sm xl:text-[16px] ml-[-6vw] md:ml-[-2vw]">
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
                      className="text-xs px-4 py-2 md:text-lg lg:px-2 w-3/4 md:w-3/4 lg:w-1/2  ml-[4vw] md:ml-[7vw] border border-gray-300  focus:outline-none rounded-lg  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
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
            <div className=" fixed top-0 box-border z-[200] backdrop-blur-xl h-screen w-screen">
              <div className="w-3/4 m-auto   h-full pt-[10vh] md:pt-[20vh]  pb-[2vh] box-border">
                <div className="relative top-[13vh] cursor-pointer text-gray-700 text-xl text-bold left-[63vw] md:left-[56vw] h-[10vh] w-[10vw]">
                  <CgClose onClick={closeBeneficiaryAdding} />
                </div>
                <form
                  action=""
                  className="w-auto md:w-[60%] h-auto pb-[7vh] m-auto pt-[6vh] border-2 bg-white shadow-lg shadow-ash-800  mt-[0rem] text-gray-600 rounded-lg border-white  box-border"
                >
                  <div
                    className={
                      // allInputsAlert
                      //   ? "w-[80%] m-auto space-y-2 pt-[2vh] "
                      "w-[80%] m-auto space-y-5 pt-[2vh] "
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
                      <p className="absolute top-[41vh] text-sm text-red-600 pointer-events-none  box-border">
                        Enter Name
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
                    {allInputsAlert && !savedAccNum ? (
                      <p className="absolute top-[49vh] text-sm text-red-600 pointer-events-none  box-border">
                        Enter Account Number
                      </p>
                    ) : null}
                    <input
                      type="tel"
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
                      <p className="absolute top-[57vh]  text-sm text-red-600 pointer-events-none  box-border">
                        Enter IFSC Code
                      </p>
                    ) : null}
                    <input
                      type="button"
                      value="Save"
                      onClick={handleSaveButtonClick}
                      className="w-full py-2 hover:bg-gray-600 bg-gray-800 hover:cursor-pointer text-white rounded-lg"
                    />
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* {notify ? (
        <div
          onClick={() => setNotify(false)}
          className="fixed top-0 bg-transparent z-[150] backdrop-blur-xl h-screen w-screen"
        >
          <div className="fixed bg-gray-700  h-[20vh] w-1/2 sm:w-[25vw] text-xl z-[100]  p-1 top-[65.2vh] sm:top-[64.7vh] ml-[35.5vw] sm:ml-[62.6vw] items-center text-center flex justify-center  backdrop-blur-sm rounded-[15px]   rounded-br-none">
            <h3>Click to add new beneficiary details</h3>
          </div>
          <img
            src={tag}
            className="cursor-pointer fixed object-cover h-20 rounded-full  ml-[78vw] sm:ml-[85vw] top-[80vh] "
            alt=""
          />
        </div>
      ) : null} */}
    </>
  );
}

export default memo(Beneficiaries);
