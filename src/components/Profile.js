import React, { memo, useContext, useEffect, useState } from "react";
import { store } from "../App";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Menu from "./Menu";
import SideBar from "./SideBar";
function Profile() {
  const {
    userName,
    userNameFromDb,
    setUserNameFromDb,
    ageFromDb,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
    setUserName,
    age,
    setAge,
    dob,
    setDob,
    accNumber,
    setAccNumber,
    card,
    setCard,
    cvv,
    setCvv,
    expireDate,
    setExpireDate,
    connectionMode,
    socket,
    setWindowWidth,
    windowWidth,
    setIsProfileClicked,
    isProfileClicked,
    setLoggedUser,
    accFromDb,
    dobFromDb,
    mobileFromDb,
    setSavedAcc,
  } = useContext(store);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath;
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [img, setImg] = useState(null);

  const logout = () => {
    setLoggedUser("");
    navigate("/");
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleAge = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAge(sanitizedValue);
    }
  };
  const handleDob = (e) => {
    const value = e.target.value;
    setDob(value);
  };
  const handleAccNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAccNumber(sanitizedValue);
    }
  };

  const handleCardNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCard(sanitizedValue);
    }
  };

  const handleExpireDate = (e) => {
    const enteredValue = e.target.value;
    const sanitizedValue = enteredValue.replace(/[^0-9/]/g, "");
    if (enteredValue.length <= 5) setExpireDate(sanitizedValue);
  };

  const handleCvv = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCvv(sanitizedValue);
    }
  };

  const setProfilePic = (e) => {
    const value = e.target.files[0];

    setImg(URL.createObjectURL(value));
  };

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Back":
        {
          prevPath ? navigate(prevPath) : navigate("/transferPage");
        }
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries", { state: { prevPath: location.pathname } });
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
      case "Menu":
        setSavedAcc([]);
        setIsProfileClicked(true);
        break;
      case "Log out":
        logout();
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
          "Beneficiaries",
          "Rewards",
          "Contact",
          "Transactions",
          "Log out",
        ],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 768) {
      return {
        nav: ["Back", "Beneficiaries", "Rewards", "Transactions", "Log Out"],
        onClickHandler: handleMenuClick,
      };
    } else if (windowWidth > 640) {
      return {
        nav: ["Back", "Beneficiaries", "Menu"],
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
        "Rewards",
        "Contact",
        "Transactions",
        "Log out",
      ],
      onClickHandler: handleMenuClick,
    };
  };

  const sideBarProps = getSideBarProps();
  const updateProfile = async (e) => {
    e.preventDefault();
    if (connectionMode !== "socket") {
      if (userName && age && accNumber && card && cvv && expireDate) {
        const userData = document.cookie;
        const response = await axios.post(
          "https://polling-server.onrender.com/updateProfile",
          {
            data: userData,
            name: userName,
            Age: age,
            DOB: dob,
            AccNum: accNumber,
            Card: card,
            CVV: cvv,
            ExpireDate: expireDate,
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          const { userName, age, dob, accNum } = response.data;

          setUserNameFromDb(userName);
          setAccFromDb(accNum);
          setAgeFromDb(age);
          setDobFromDb(dob);
          setIsEditProfile(false);
          setUserName("");
          setAge("");
        } else if (response.status === 500) {
          console.log("userName not updated");
        }
      }
    } else {
      if (userName && age && accNumber && card && cvv && expireDate) {
        const regNum = document.cookie;
        socket.emit("updateProfile", {
          num: regNum,
          name: userName,
          age: age,
          DOB: dob,
          AccNum: accNumber,
          Card: card,
          CVV: cvv,
          ExpireDate: expireDate,
        });

        socket.on("profileUpdated", (data) => {
          setUserNameFromDb(data.userName);
          setAgeFromDb(data.age);
          setDobFromDb(data.dob);
          setAccFromDb(data.accNum);
          setUserName("");
          setAge("");
        });
        setIsEditProfile(false);
      } else {
        alert("Enter your details");
      }
    }
  };

  const editProfile = () => {
    setIsEditProfile(true);
  };
  const profile = () => {
    setIsProfileClicked(true);
  };

  const closeProfile = () => {
    setIsProfileClicked(false);
  };

  const gotoTransferPage = () => {
    navigate("/transferPage");
  };

  const savedAccounts = () => {
    navigate("/Beneficiaries");
  };
  const cancelEdit = () => {
    setIsEditProfile(false);
    setUserName("");
    // setAccNumber("");
    setAge("");
    // setDob("");
    // setCard("");
    // setExpireDate("");
    // setCvv("");
  };
  // const navigateToProfile = () => {
  //   navigate("/profile");
  // };

  // const closeProfile = () => {
  //   setIsProfileClicked(false);
  // };

  useEffect(() => {
    if (connectionMode !== "socket") {
      axios
        .post("https://polling-server.onrender.com/checkUserName", {
          regNumber: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setUserNameFromDb(response.data.user);
            setAgeFromDb(response.data.age);
            setAgeFromDb(response.data.age);
            setDobFromDb(response.data.dob);
            setAccFromDb(response.data.accNum);
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
        setAgeFromDb(data.age);
        setDobFromDb(data.dob);
        setAccFromDb(data.accNum);
        // setCard(data.card);
        // setCvv()
      });
      socket.on("userNotFound", () => {
        setUserNameFromDb("");
        setAgeFromDb("");
      });
    }
  }, [socket, connectionMode, setUserNameFromDb]);

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
      <div className=" w-screen fixed flex flex-col text-white pt-2 h-[100vh] sm:flex bg-gray-800">
        <Menu {...menuProps} onClickHandler={handleMenuClick} />

        {/* ) : null} */}
        {isEditProfile ? null : (
          <div className="w-screen h-auto">
            <div className="w-screen bg-gray-700 border-b-2 h-[20vh]"></div>
            <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] bg-white  fixed top-[21vh] md:top-[17vh] z-5 overflow-hidden shadow-lg left-[33vw] sm:left-[9vw] rounded-full border-2 border-white">
              {
                <>
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={img}
                    alt="Profile"
                  />
                  <div className="absolute inset-0  opacity-30"></div>
                  <p className="absolute inset-0 opacity-0 flex items-center justify-center text-white">
                    Edit
                  </p>
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={setProfilePic}
                  />
                </>
              }
            </div>
            <div
              className={
                windowWidth < 640
                  ? "w-screen   box-border h-full   bg-white  sm:border-2 sm:border-r-0 border-white ml-[0] pt-[4rem] p-[2rem] flex   "
                  : "w-screen   h-full md:h-[69vh]  box-border bg-white  border-white m-auto font-poppins pt-[10rem]  sm:pt-[4rem] p-[2rem]  flex   "
              }
            >
              <div className="h-1/2 w-full   font-poppins  text-gray-800 pl-0 sm:p-5 rounded-md items-center justify-center m-auto mt-[4rem] sm:mt-4 box-border">
                <div className="flex w-full ml-[7vw] md:w-1/2  items-center space-x-2  ">
                  <h1 className=" text-2xl font-extrabold  w-1/2 text-left">
                    {/* {JSON.parse(sessionStorage.getItem(document.cookie)).UserName} */}
                    {userNameFromDb}
                  </h1>
                </div>
                <div className="flex w-full ml-[7vw] md:w-1/2  items-center space-x-2  ">
                  <h1 className=" text-md font-light   text-left">
                    Tamil Nadu, India
                  </h1>
                </div>

                {/* <div className="flex w-full md:w-1/2  items-center space-x-2  "></div> */}
                {/* <div className="flex items-center w-full md:w-1/2  space-x-2">
                  <h1 className="w-1/2 text-xl font-bold">Age</h1>
                  <h1 className=" text-xl text-left w-1/2 ">
                   
                    {ageFromDb}
                  </h1>
                </div> */}
                {/* <div className="flex items-center w-full md:w-1/2  space-x-2">
                  <h1 className="w-1/2 text-xl font-bold">Account Number</h1>
                  <h1 className=" text-xl text-left w-1/2 ">{accFromDb}</h1>
                </div>

                <div className="flex items-center w-full md:w-1/2  space-x-2">
                  <h1 className="w-1/2 text-xl font-bold">Date Birth</h1>
                  <h1 className=" text-xl text-left w-1/2 ">{dobFromDb}</h1>
                </div> */}

                <div className="md:w-1/2 pl-[7vw]">
                  <button
                    onClick={editProfile}
                    className="w-full   outline-none md:w-1/2  p-4 pt-2 pb-2 mt-[1rem] text-white rounded box-border bg-gray-800  hover:bg-gray-600 "
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* <div className="w-full w-auto ">
              <div className="h-[30vh] w-1/2 bg-gray-800 rounded-md "></div>
            </div> */}
            </div>
          </div>
        )}
        {isEditProfile ? (
          <form
            action="submit"
            onSubmit={updateProfile}
            className="w-full lg:w-[60%] h-screen text-gray-800   m-auto bg-blue-650 sm:ml-[10vw] lg:ml-[25vw] p-5 box-border items-center flex flex-col  font-poppins justify-center sm:space-y-2 "
          >
            {/* {windowWidth < 640 ? null : (
            <button
              onClick={cancelEdit}
              className="fixed  sm:top-[1vh] sm:left-[86vw] w-[46%] sm:w-auto border bg-white p-2 pl-4 pr-4 box-border font-extralight hover: rounded-md sm:rounded-md"
            >
              Cancel
            </button>
          )} */}
            <div className="sm:flex flex-wrap  sm:space-x-2 w-3/4  sm:w-full md:w-[80%]">
              <input
                className="block w-full sm:w-1/2  px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
                type="text"
                value={userName}
                onChange={handleUserName}
                placeholder="Enter User Name"
                required
              />
              <input
                className="block  w-full sm:w-1/3 px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
                type="tel"
                value={age}
                maxLength={3}
                onChange={handleAge}
                placeholder="Enter Age"
                required
              />
            </div>
            <div className="sm:flex flex-wrap  sm:space-x-2  w-3/4 sm:w-full md:w-[80%]">
              <input
                className="block w-full sm:w-1/3   px-4 py-2 mb-3 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
                type="date"
                value={dob}
                onChange={handleDob}
                placeholder="Date of Birth"
                required
              />
              {/* <MdAccountCircle className="relative z-10 left-[17vw] top-[1vh]  text-2xl" /> */}
              <input
                type="tel"
                value={accNumber}
                onChange={handleAccNumber}
                className="block px-4 py-2 mb-3  w-full sm:w-3/6  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
                placeholder="Enter Account Number"
                required
              />
            </div>
            <div className=" flex flex-wrap  sm:space-x-2  w-3/4 sm:w-full md:w-[80%]">
              <input
                type="tel"
                readOnly
                value={document.cookie}
                required
                className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
              />
              <input
                type="tel"
                value={card}
                onChange={handleCardNumber}
                required
                placeholder="Enter Card Details"
                className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
              />
            </div>
            <div className=" sm:flex flex-wrap  sm:space-x-2 w-3/4 sm:w-full md:w-[80%]">
              <input
                type="tel"
                value={cvv}
                placeholder="CVV"
                onChange={handleCvv}
                required
                className="block px-4 py-2 mb-3 w-full sm:w-1/3  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
              />
              <input
                type="text"
                value={expireDate}
                onChange={handleExpireDate}
                placeholder="MM/YY"
                required
                className="block px-4 py-2 mb-3 w-full sm:w-1/2  bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:border-white"
              />
            </div>
            <div className=" w-3/4 sm:w-full  md:w-[80%] text-white space-x-2 flex">
              <input
                type="button"
                value="Confirm"
                required
                onClick={updateProfile}
                className="block  py-2 mb-3 w-1/2 sm:w-1/3 relative box-border  hover:cursor-pointer  bg-gray-800 border-2 border-white rounded-md focus:outline-none "
              />

              <button
                onClick={cancelEdit}
                className=" block px-4 py-2 mb-3 w-1/2 box-border      bg-gray-800 border-2 hover:border-white rounded-md focus:outline-none focus:border-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
      {windowWidth > 1024 ? null : isProfileClicked ? (
        <>
          <SideBar {...sideBarProps} onClickHandler={handleMenuClick} />
        </>
      ) : null}
    </>
  );
}

export default memo(Profile);
