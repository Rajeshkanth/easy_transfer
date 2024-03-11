import React, { memo, useContext, useEffect } from "react";
import { store } from "../../App";
import SignUp from "./SignUp";
import Login from "./Login";

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

  const disableBackButton = () => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

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

  return (
    <>
      <div
        className={
          passwordError && windowWidth < 640 && !isLogin
            ? "h-screen pt-10 w-screen bg-gray-800 text-white font-poppins flex items-center justify-center"
            : "h-screen fixed w-screen bg-gray-800 text-white font-poppins flex items-center justify-center"
        }
      >
        {isLogin ? (
          <div className="z-10 w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 mx-auto shadow-md shadow-black h-auto rounded-xl">
            {loader ? (
              <div className="fixed bg-transparent h-screen w-screen top-0 left-0">
                <div className="h-screen w-screen flex flex-col justify-center items-center">
                  <div className="loader"></div>
                </div>
              </div>
            ) : (
              <div className="w-full border-2 border-white bg-white space-y-8 text-gray-800 rounded-xl">
                <Login />
              </div>
            )}
          </div>
        ) : (
          <div
            className={
              passwordError && windowWidth < 640
                ? "mx-auto w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 text-gray-800 bg-white box-border rounded-xl h-auto"
                : "mx-auto w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 text-gray-800 bg-white box-border rounded-xl h-auto"
            }
          >
            <div className="w-full border-2 bg-white text-gray-800 space-y-4 sm:space-y-5 lg:space-y-7 rounded-xl shadow-md shadow-black">
              <SignUp />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(HomePage);
