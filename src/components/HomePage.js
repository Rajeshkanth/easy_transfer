import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import SignUp from "./SignUp";
import Login from "./Login";
import Meteors from "../Meteors";

function HomePage() {
  const {
    loader,
    windowWidth,
    setWindowWidth,
    isLogin,
    setLoginFailed,
    setNewUser,
    passwordError,
    setIsLoggedOut,
  } = useContext(store);

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

  useEffect(() => {
    setIsLoggedOut(true);
    const sessionCleared = sessionStorage.getItem("userName") ? true : false;
    if (!sessionCleared) {
      disableBackButton();
    }
  }, []);

  const disableBackButton = () => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  return (
    <>
      <div
        className={
          passwordError && windowWidth < 640 && !isLogin
            ? "h-screen pt-10 w-screen bg-gray-800 text-white font-poppins"
            : "h-screen fixed w-screen bg-gray-800 text-white font-poppins"
        }
      >
        {isLogin ? (
          <div className="z-10 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[36%] xl:w-[33%]  mx-auto    shadow-md shadow-black h-auto rounded-xl  mt-[15vh] ">
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
          <div
            className={
              passwordError && windowWidth < 640
                ? "mx-auto w-[80%] sm:w-[60%] md:w-[50%] lg:w-[33%]  text-gray-800  bg-white  box-border  mt-[6vh] rounded-xl h-auto"
                : "mx-auto w-[80%] sm:w-[60%] md:w-[50%] lg:w-[33%]  text-gray-800  bg-white  box-border  mt-[15vh] rounded-xl h-auto"
            }
          >
            <div className="w-full border-2 bg-white text-gray-800 space-y-4 sm:space-y-5 lg:space-y-7 rounded-xl  shadow-md shadow-black">
              <SignUp />
            </div>
          </div>
        )}
      </div>
      <Meteors number={20} />
    </>
  );
}

export default memo(HomePage);
