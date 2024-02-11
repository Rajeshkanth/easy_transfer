import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import SignUp from "./SignUp";
import Login from "./Login";
import { useNavigate } from "react-router";

function HomePage() {
  const {
    loader,
    windowWidth,
    setWindowWidth,
    isLogin,
    setSavedAcc,
    password,
    setPassword,
    setMobileNumber,
    mobileNumber,
    registeredUsers,
    setKey,
    loginFailed,
    setLoginFailed,
    loginInputAlert,
    setLoginInputAlert,
    connectionMode,
    socket,
    setIsLogin,
    setLoader,
    setNewUser,
  } = useContext(store);

  const navigate = useNavigate();

  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "Profile":
        navigate("/Profile");
        break;
      case "Beneficiaries":
        navigate("/Beneficiaries");
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
      default:
        console.log(`Unknown menu item: ${menuItem}`);
    }
  };

  useEffect(() => {
    socket.on("loginSuccess", () => {
      setLoader(false);
      navigate("/transferPage");
      document.cookie = mobileNumber;
      setMobileNumber("");
      setPassword("");
      setKey(document.cookie);
      setLoginFailed(false);
      setLoginInputAlert(false);
    });
    socket.on("newUser", () => {
      setNewUser(true);
      setLoader(false);
    });
    socket.on("loginFailed", async () => {
      setLoader(false);
      setLoginFailed(true);
    });
  }, []);

  useEffect(() => {
    setLoginFailed(false);
    setNewUser(false);
  }, [isLogin]);

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
    <div className="h-screen fixed w-screen bg-gray-800 text-white font-sans">
      {isLogin ? (
        <div className=" w-[70%] sm:w-[60%] md:w-[50%] lg:w-[33%]  mx-auto    shadow-md shadow-black h-auto rounded-xl  mt-[15vh] ">
          {loader ? (
            <div className="fixed bg-transparent h-screen w-screen top-[0vh] left-[0vw] ">
              <div className="h-screen w-screen flex flex-col justify-center items-center">
                <div className="loader "></div>
                <p>
                  <strong className="text-white"></strong>{" "}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full border-2 border-white bg-white space-y-8 text-gray-800 rounded-xl ">
              <Login />
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto w-[70%] sm:w-[60%] md:w-[50%] lg:w-[33%]  text-gray-800  bg-white  box-border  mt-[15vh] rounded-xl h-auto">
          <div className="w-full border-2 bg-white text-gray-800 space-y-4 sm:space-y-5 lg:space-y-7 rounded-2xl  shadow-md shadow-black">
            <SignUp />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(HomePage);
