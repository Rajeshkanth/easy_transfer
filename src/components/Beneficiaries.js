import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
// import { IoIosCheckboxOutline } from "react-icons/io";
import { CiBookmarkCheck } from "react-icons/ci";
import { RiMenuFoldFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
import Menu from "./Menu";

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
  } = useContext(store);

  const [isProfileClicked, setIsProfileClicked] = useState(false);
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
        nav: ["Profile", "Beneficiaries", "Menu"],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: ["Profile", "Beneficiaries", "Menu"],
        onClickHandler: handleMenuClick,
      };
    }
  };

  const menuProps = getMenuProps();

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

  // const edit = (index) => {
  //   setSavedAcc((prev) =>
  //     prev.map((item, i) => {
  //       if (i === index) {
  //         setIsEdit(true);
  //         return { ...item, editable: true };
  //       } else {
  //         setIsEdit(false);
  //         return item;
  //       }
  //     })
  //   );
  // };

  // const save = (index) => {
  //   // setIsEdit(true);
  //   setSavedAcc((prev) =>
  //     prev.map((item, i) => {
  //       if (i === index) {
  //         setIsEdit(false);
  //         return { ...item, editable: false };
  //       } else {
  //         setIsEdit(true);
  //         return item;
  //       }
  //     })
  //   );
  // };

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

  // const deleteItem = async (index) => {
  //   const updatedSavedAcc = [...savedAcc];
  //   const deletedBeneficiary = updatedSavedAcc.splice(index, 1)[0];
  //   console.log(deletedBeneficiary);

  //   // Delete the item from the savedAccounts array based on accNum
  //   const updatedSavedAccounts = savedAcc.filter(
  //     (account) => account.accNum !== deletedBeneficiary.accNum
  //   );

  //   setSavedAcc(updatedSavedAccounts);

  //   if (connectionMode === "socket") {
  //     try {
  //       socket.emit("deleteItem", {
  //         accNum: deletedBeneficiary.accNum,
  //         num: document.cookie,
  //       });
  //     } catch (error) {
  //       console.error("Error emitting socket event:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (connectionMode === "socket") {
  //       socket.emit("fetchList", {
  //         num: document.cookie,
  //       });

  //       socket.on("allSavedAccounts", (data) => {
  //         const savedDetail = {
  //           beneficiaryName: data.beneficiaryName,
  //           accNum: data.accNum,
  //           ifsc: data.ifsc,
  //           editable: data.editable,
  //         };

  //         const isAlreadyStored = savedAcc.some((detail) => {
  //           return (
  //             detail.beneficiaryName === savedDetail.beneficiaryName &&
  //             detail.accNum === savedDetail.accNum &&
  //             detail.ifsc === savedDetail.ifsc &&
  //             detail.editable === savedDetail.editable
  //           );
  //         });

  //         if (isAlreadyStored === false) {
  //           setSavedAcc((prev) => [...prev, savedDetail]);
  //           console.log(savedAcc);
  //         }
  //       });
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     if (connectionMode !== "socket") {
  //     } else {
  //       socket.off();
  //     }
  //   };
  // }, [connectionMode, socket]);

  useEffect(() => {
    if (connectionMode !== socket) {
    } else {
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
      <div className={" h-screen w-screen fixed bg-gray-800 text-white"}>
        {windowWidth > 1024 ? null : isProfileClicked ? (
          <>
            <div
              className="w-1/2 z-10 sm:w-1/2 md:w-[33%] lg:w-1/4 bg-gray-800 backdrop-blur-xl h-screen font-sans fixed text-black"
              // className={
              // windowWidth < 780
              // ? "w-1/2 h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
              // : " sm:w-[33vw]  h-screen border-box  bg-blue-500  border rounded-2xl rounded-l-none fixed "
              // }
            >
              <div className=" pt-2 pb-8 border-box h-[85vh] font-sans">
                <div className="flex justify-between items-center border-b-2 border-gray-600  text-white box-border pb-[.8rem] cursor-pointer ">
                  <h1 className="ml-[2rem] text-xl font-bold ">Menu</h1>
                  <p className=" mr-[1rem]  " onClick={closeProfile}>
                    <RiMenuFoldFill />
                  </p>
                </div>
                <div className="space-y-2 flex text-white w-[80%] justify-center pl-6 flex-col items-left  pt-5 border-box text-lg    cursor-pointer ">
                  <h1
                    className="hover:font-bold hover:border-2   rounded px-4 box-border rounded- px-4 box-border py-1"
                    onClick={navigateToProfile}
                  >
                    Profile
                  </h1>
                  <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2  py-1">
                    Rewards
                  </h1>
                  <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2 py-1">
                    Contact us
                  </h1>
                  <h1 className="hover:font-bold  hover:border-2   rounded px-4 box-border hover:border-b-2 py-1">
                    Transactions
                  </h1>

                  <h1
                    className="hover:font-bold hover:border-2   rounded px-4 box-border  px-4 box-border py-1"
                    onClick={logout}
                  >
                    Log out
                  </h1>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div className="h-[10vh] items-center  border-white  flex box-border  bg-gray-800 sticky top-0">
          <Menu {...menuProps} onClickHandler={handleMenuClick} />
        </div>

        <div
          className={
            // savedAcc.length < 11
            " h-screen  w-screen border-b-0 border-white flex pl-[8rem] box-border"
            // : "border-2 h-auto  w-screen border-b-0 border-white "
          }
        >
          <div className=" h-[80vh] w-[40%] pt-[2rem] text-gray-800 rounded-md bg-white mt-[2rem] pb-[2rem] box-border overflow-x-auto space-y-4">
            {savedAcc.map((item, index) => (
              <div
                key={index}
                className="h-auto w-[80%] flex justify-evenly space-x-4 border-b-2 shadow-sm shadow-white items-center p-4 w-1/2 m-auto  rounded-md"
              >
                <div className="space-x-4 w-full  font-light flex">
                  <div>
                    <h1>Name</h1>
                    <h1>Account Number</h1>
                    <h1>IFSC</h1>
                  </div>
                  <div className="w-1/2 capitalize">
                    <h1 className="font-bold">{item.beneficiaryName}</h1>
                    <h1 className="">{item.accNum}</h1>
                    <h1> {item.ifsc}</h1>
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

            {/* {savedAcc.map((item, index) => {
          <div className="h-auto w-1/2 border-2 border-white rounded-md"></div>;
        })} */}
          </div>
          <div className="w-1/2  h-full pt-[15vh] ml-[6rem] box-border">
            <button className="bg-gray-800 ml-[17.5vw] border-2 fixed border-white rounded-xl px-4 py-2 box-border outline-0 border-0 text-white">
              Add Beneficiary
            </button>
            <form
              action=""
              className="w-[60%] h-auto pb-[10vh] pt-[8vh] border-2 bg-white shadow-lg shadow-ash-800  m-auto mt-[1rem] text-gray-600 rounded-lg border-white  box-border"
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

          {/* <div className="">
            <li className="flex  pl-[2rem]  border-b-2 pb-[1rem] items-center border-white pt-[1rem]  space-x-2 box-border ">
              <h1 className="w-[24.3%] font-bold">Name</h1>
              <h1 className="w-[24.3%] font-bold">Account Number</h1>
              <h1 className="w-[24.3%] font-bold">IFSC Code</h1>
            </li>
            <ul className="  ">
              {savedAcc.map((item, index) => (
                <li
                  
                  className="flex space-x-2 border-b-2 overflow-auto pl-[2rem] h-[8vh] border-white  box-border items-center "
                >
                  <h1
                    className="w-[30%] capitalize contentEditable:bg-magenta-300 caret:text-white focus:outline-none rounded-lg"
                    contentEditable={item.editable}
                  >
                    {item.beneficiaryName}
                  </h1>
                  <h1
                    className="w-[30%]   contentEditable:bg-magenta-300  focus:outline-none rounded-lg"
                    contentEditable={item.editable}
                  >
                    {item.accNum}
                  </h1>
                  <h1
                    className="w-[30%]  uppercase contentEditable:bg-magenta-300  focus:outline-none rounded-lg"
                    contentEditable={item.editable}
                  >
                    {item.ifsc}
                  </h1>

                  <div className="w-[30%] items-center flex space-x-3">
                    <button
                      className=" px-4 py-2 w-1/2  border border-gray-300 rounded-md focus:outline-none rounded-lg focus:border-blue-500 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                      onClick={() => sendMoney(index)}
                    >
                      Send
                    </button>
                    {/* {isEdit ? (
                      <CiBookmarkCheck
                        
                        className="text-2xl cursor-pointer hover:text-green-600 "
                        onClick={() => save(index)}
                      />
                    ) : (
                      <MdEdit
                        
                        className=" text-2xl hover:text-white cursor-pointer"
                        onClick={() => edit(index)}
                      />
                    )} */}
          {/* {isEdit ? (
                      <IoIosCheckboxOutline onClick={save} />
                    ) : (
                      <MdEdit
                        className=" text-2xl "
                        onClick={() => edit(index)}
                      />
                    )} */}
          {/* <MdDeleteOutline
                      
                      onClick={() => deleteItem(index)}
                      className="w-1/2 text-2xl text-gray-800"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Beneficiaries;
