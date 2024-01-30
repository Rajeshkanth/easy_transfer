import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
// import { IoIosCheckboxOutline } from "react-icons/io";
import { CiBookmarkCheck } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import Menu from "./Menu";
import SideBar from "./SideBar";

function Beneficiaries() {
  const {
    socket,
    connectionMode,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    userNameFromDb,
    setUserNameFromDb,
    amount,
    setAmount,
    toAccountNumber,
    setToAccountNumber,
    toIFSCNumber,
    setToIFSCNumber,
    toAccountHolderName,
    setToAccountHolderName,
    sendByBeneficiaries,
    setSendByBeneficiaries,
    savedAcc,
    setSavedAcc,
    isProfileClicked,
    setIsProfileClicked,
    logOut,
    setLogOut,
  } = useContext(store);

  // const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [sessionTiemedOut, setSessionTiemedOut] = useState(false);
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
      case "Transactions":
        console.log("Navigating to Transactions page");
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
          "Back",
          "Profile",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: [
          "Back",
          "Profile",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: ["Back", "Profile", "Menu"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

  const getSideBarProps = () => {
    return {
      nav: ["Back", "Profile", "Rewards", "Contact", "Transactions", "Log out"],
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
    setSavedAcc([]);
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
      if (savedBeneficiaryName && savedAccNum && savedIfsc) {
        const newBeneficiary = {
          beneficiaryName: savedBeneficiaryName,
          accNum: savedAccNum,
          ifsc: savedIfsc,
          editable: false, // Assuming this is the default value
        };
        setSavedAcc((prevList) => [...prevList, newBeneficiary]);
      }

      setSavedBeneficiaryName("");
      setSavedAccNum("");
      setSavedIfsc("");
    }
  };

  const handleSaveButtonClick = () => {
    if (clickable) {
      saveBeneficiary();
      setAllInputsAlert(false);
    } else {
      setAllInputsAlert(true);
    }
  };

  useEffect(() => {
    if (connectionMode !== socket) {
    } else if (!logOut) {
      socket.on("getSavedBeneficiary", (data) => {
        const savedDetail = {
          beneficiaryName: data.beneficiaryName,
          accNum: data.accNum,
          ifsc: data.ifsc,
          editable: data.editable,
        };
        setSavedAcc((prev) => [...prev, savedDetail]);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      setSavedAcc([]);
      setLogOut(false);
    };
  }, [logOut]);

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
    console.log(savedAcc);
  }, [userNameFromDb, connectionMode, socket]);

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
      <div
        className={
          " h-auto md:h-screen w-screen pb-[2rem] md:fixed  bg-gray-800 text-white"
        }
      >
        <div className="h-[10vh]  items-center  border-white  flex box-border z-[5] bg-gray-800 sticky top-0">
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        </div>

        <div className="h-auto md:h-screen  w-screen border-b-0 border-white block md:flex  md:pl-[2rem] md:pl-[8rem] box-border">
          {windowWidth > 768 ? null : (
            <div className="w-3/4 m-auto  h-full pt-[4vh] md:pt-[15vh]  pb-[2rem] box-border">
              <button className="bg-gray-800 w-1/2  ml-[19vw] mt-[1vh]  border-2 relative border-white rounded-xl  py-2 box-border outline-0 border-0 text-white">
                Add Beneficiary
              </button>
              <form
                action=""
                className="w-auto md:w-[60%] h-auto pb-[10vh]  pt-[8vh] border-2 bg-white shadow-lg shadow-ash-800  mt-[-1.4rem] text-gray-600 rounded-lg border-white  box-border"
              >
                <div className="w-[80%] m-auto  ">
                  <input
                    type="text"
                    className="block  w-full px-4 py-2 mt-[1.2rem]   border-gray-300 focus:border-gray-800 outline-none rounded-lg bg-white  border-2 "
                    placeholder="Enter Beneficiary Name"
                    value={savedBeneficiaryName}
                    onChange={handleSavedBenificiaryName}
                    required
                  />
                  <input
                    type="tel"
                    className="block w-full px-4 py-2 mt-[1.2rem]  border-gray-300 focus:border-gray-800 outline-none rounded-lg  border-2 "
                    placeholder="Enter Account Number"
                    value={savedAccNum}
                    onChange={handleSavedAccNum}
                    required
                    minLength={16}
                  />
                  <input
                    type="tel"
                    className="block w-full px-4 py-2 mt-[1.2rem]   border-gray-300 focus:border-gray-800 outline-none rounded-lg bg-white border-2 "
                    placeholder="Enter IFSC Code"
                    value={savedIfsc}
                    onChange={handleSavedIfsc}
                    required
                  />
                  {allInputsAlert ? (
                    <p className="text-sm text-gray-800 pointer-events-none p-2 box-border">
                      fill all the inputs
                    </p>
                  ) : null}
                  <input
                    type="button"
                    value="Save"
                    onClick={handleSaveButtonClick}
                    className="w-full py-2  bg-gray-800 mt-[2rem] hover:cursor-pointer text-white rounded-lg"
                  />
                </div>
              </form>
            </div>
          )}
          <div className="m-auto h-[80vh] w-[90vw] md:w-[80%] lg:w-[60%] xl:w-[50%] pt-[.4rem] sm:pt-[1rem] text-gray-800 rounded-md bg-white mt-[2rem] pb-[2rem] box-border overflow-x-auto space-y-2 lg:space-y-4">
            {savedAcc.map((item, index) => (
              <div
                key={index}
                className="h-auto w-[80%] lg:w-[90%] xl:w-[80%] flex justify-evenly space-x-0 md:space-x-10 border-b-2 shadow-sm shadow-white items-center p-0 box-border sm:p-4   w-1/2 m-auto  rounded-md"
              >
                <div className="space-x-10 md:space-x-2 lg:space-x-10 w-full  font-light flex ">
                  <div>
                    <h1 className="font-bold md:text-sm xl:text-lg">Name</h1>
                    <h1 className="font-bold md:text-sm xl:text-lg">Account</h1>
                    <h1 className="font-bold md:text-sm xl:text-lg">IFSC</h1>
                  </div>
                  <div className="w-1/2 capitalize ">
                    <h1 className="md:text-sm xl:text-lg">
                      {item.beneficiaryName}
                    </h1>
                    <h1 className="md:text-sm xl:text-lg">{item.accNum}</h1>
                    <h1 className="md:text-sm xl:text-lg"> {item.ifsc}</h1>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => sendMoney(index)}
                    className=" px-4 py-2  border border-gray-300 rounded-md focus:outline-none rounded-lg  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                  >
                    send
                  </button>
                </div>
              </div>
            ))}
          </div>
          {windowWidth > 768 ? (
            <div className="w-1/2  h-full pt-[15vh] ml-[2rem] lg:w-[60%] lg:ml-[6rem] mr-[2rem]   pb-[2rem] box-border">
              <button className="bg-gray-800 md:w-[60%] lg:w-auto md:ml-[6vw]  lg:ml-[11vw] xl:ml-[17vw]  border-2 md:relative lg:fixed border-white rounded-xl px-4 py-2 box-border outline-0 border-0 text-white">
                Add Beneficiary
              </button>
              <form
                action=""
                className="w-auto md:w-[100%] lg:w-[80%] xl:w-[60%] h-auto pb-[10vh]  pt-[6vh] border-2 bg-white shadow-lg shadow-ash-800  m-auto md:mt-[-1.4rem] lg:mt-[1rem] text-gray-600 rounded-lg border-white  box-border"
              >
                <div className="w-[80%] m-auto  ">
                  <input
                    type="text"
                    className="block  w-full px-4 py-2 mt-[1.2rem]   border-gray-300 focus:border-gray-800 outline-none rounded-lg bg-white  border-2 "
                    placeholder="Enter Beneficiary Name"
                    value={savedBeneficiaryName}
                    onChange={handleSavedBenificiaryName}
                    required
                  />
                  <input
                    type="tel"
                    className="block w-full px-4 py-2 mt-[1.2rem]  border-gray-300 focus:border-gray-800 outline-none rounded-lg  border-2 "
                    placeholder="Enter Account Number"
                    value={savedAccNum}
                    onChange={handleSavedAccNum}
                    required
                    minLength={16}
                  />
                  <input
                    type="tel"
                    className="block w-full px-4 py-2 mt-[1.2rem]   border-gray-300 focus:border-gray-800 outline-none rounded-lg bg-white border-2 "
                    placeholder="Enter IFSC Code"
                    value={savedIfsc}
                    onChange={handleSavedIfsc}
                    required
                  />
                  {allInputsAlert ? (
                    <p className="text-sm text-red-600 pointer-events-none p-2 box-border">
                      fill all the inputs
                    </p>
                  ) : null}
                  <input
                    type="button"
                    value="Save"
                    onClick={handleSaveButtonClick}
                    className="w-full py-2  bg-gray-800 mt-[2rem] hover:cursor-pointer text-white rounded-lg"
                  />
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Beneficiaries;
