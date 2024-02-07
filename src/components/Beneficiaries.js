import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import Menu from "./Menu";
import SideBar from "./SideBar";
import img from "./images/plus.png";
import tag from "./images/tag.png";

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
      // if (savedBeneficiaryName && savedAccNum && savedIfsc) {
      //   const newBeneficiary = {
      //     beneficiaryName: savedBeneficiaryName,
      //     accNum: savedAccNum,
      //     ifsc: savedIfsc,
      //     editable: false, // Assuming this is the default value
      //   };
      //   // setSavedAcc((prevList) => [...prevList, newBeneficiary]);
      // }

      setSavedBeneficiaryName("");
      setSavedAccNum("");
      setSavedIfsc("");
    }
  };

  const addNewBeneficiary = () => {
    setPlusIcon(true);
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

  // useEffect(() => {
  //   if (connectionMode !== socket) {
  //   } else if (!logOut) {
  //     socket.on("getSavedBeneficiary", (data) => {
  //       const savedDetail = {
  //         beneficiaryName: data.beneficiaryName,
  //         accNum: data.accNum,
  //         ifsc: data.ifsc,
  //         editable: data.editable,
  //       };
  //       setSavedAcc((prev) => [...prev, savedDetail]);
  //     });
  //   }
  // }, []);

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
        <div className="h-[10vh]  items-center    flex box-border z-[10] bg-gray-800 sticky top-0">
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        </div>

        <div className="h-auto md:h-screen  w-screen  block md:flex  md:pl-[0rem] box-border">
          <div className="m-auto h-screen sm:h-[86vh] w-[100%]   text-gray-800   bg-white mt-[2rem] pb-[1rem] box-border overflow-x-auto space-y-2 lg:space-y-4">
            <div className="flex  fixed sm:sticky top-[9vh] sm:top-0  h-auto  z-10  pt-3 pb-3 text-white bg-gray-800 w-[100%] pl-[8vw] sm:pl-[11.5vw]">
              <h1 className="font-bold w-1/4 md:text-sm  xl:text-xl">Name</h1>
              <h1 className="font-bold w-1/4 ml-[3vw] sm:ml-[-2rem] md:ml-[-3rem]  md:text-sm xl:text-xl">
                Account
              </h1>
              <h1 className="font-bold w-1/2 ml-[9vw] sm:ml-[2.8rem] md:text-sm xl:text-lg">
                IFSC
              </h1>
            </div>
            {savedAcc.map((item, index) => (
              <div
                key={index}
                className="h-auto   flex justify-evenly space-x-0 md:space-x-10   items-center p-0 box-border sm:p-4    m-auto  rounded-md"
              >
                <div className=" capitalize flex  w-[80%] pl-[10.5vw]">
                  <h1 className="text-xs md:text-sm ml-[-2vw] sm:ml-[.2rem] w-1/2 xl:text-lg">
                    {item.beneficiaryName}
                  </h1>
                  <h1 className="text-xs md:text-sm ml-[-2rem] sm:ml-[-4rem]  w-1/2 xl:text-lg">
                    {item.accNum}
                  </h1>
                  <h1 className="text-xs md:text-sm w-1/2 pl-[2rem] xl:text-lg">
                    {" "}
                    {item.ifsc}
                  </h1>
                </div>
                <div className="w-[20%] pr-[.4rem] sm:pr-[2rem] lg:pr-[4rem] box-border">
                  <button
                    onClick={() => sendMoney(index)}
                    className=" px-4 py-2 lg:px-2 w-full border border-gray-300  focus:outline-none rounded-lg  bg-gray-800 text-white hover:bg-gray-600 hover:cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            ))}
          </div>
          <img
            src={img}
            className=" fixed object-cover h-20 z-[100] ml-[78vw] sm:ml-[85vw] top-[80vh] "
            alt="add beneficiary"
            onClick={addNewBeneficiary}
          />

          {notify ? (
            <div
              onClick={() => setNotify(false)}
              className="fixed top-0 bg-transparent z-[150] backdrop-blur-xl h-screen w-screen"
            >
              <div className="fixed bg-gray-700  h-[20vh] w-1/2 sm:w-[25vw] text-xl z-[100]  p-1 top-[65.2vh] sm:top-[64.7vh] ml-[35.5vw] sm:ml-[62.6vw] items-center text-center flex justify-center  backdrop-blur-sm rounded-[15px]   rounded-br-none">
                <h3>Click to add new beneficiary details</h3>
              </div>
              <img
                src={img}
                className=" fixed object-cover h-20  ml-[78vw] sm:ml-[85vw] top-[80vh] "
                alt=""
              />
            </div>
          ) : null}

          {plusIcon ? (
            <div className=" fixed top-0 box-border z-[200] backdrop-blur-xl h-screen w-screen">
              <div className="w-3/4 m-auto   h-full pt-[10vh] md:pt-[20vh]  pb-[2vh] box-border">
                <div className="relative top-[13vh] text-gray-700 text-3xl left-[63vw] md:left-[56vw] h-[10vh] w-[10vw]">
                  <IoMdCloseCircle onClick={() => setPlusIcon(false)} />
                </div>
                <form
                  action=""
                  className="w-auto md:w-[60%] h-auto pb-[7vh] m-auto pt-[6vh] border-2 bg-white shadow-lg shadow-ash-800  mt-[0rem] text-gray-600 rounded-lg border-white  box-border"
                >
                  <div className="w-[80%] m-auto space-y-5 pt-[2vh] ">
                    <input
                      type="text"
                      className="block  w-full px-4 py-2    border-gray-500 focus:border-gray-800 outline-none rounded-lg bg-white  border-2 "
                      placeholder="Enter Beneficiary Name"
                      value={savedBeneficiaryName}
                      onChange={handleSavedBenificiaryName}
                      required
                    />
                    <input
                      type="tel"
                      className="block w-full px-4 py-2   border-gray-500 focus:border-gray-800 outline-none rounded-lg  border-2 "
                      placeholder="Enter Account Number"
                      value={savedAccNum}
                      onChange={handleSavedAccNum}
                      required
                      minLength={16}
                    />
                    <input
                      type="tel"
                      className="block w-full px-4 py-2    border-gray-500 focus:border-gray-800 outline-none rounded-lg bg-white border-2 "
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
                      className="w-full py-2 hover:bg-gray-600 bg-gray-800 mt-[2rem] hover:cursor-pointer text-white rounded-lg"
                    />
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Beneficiaries;
