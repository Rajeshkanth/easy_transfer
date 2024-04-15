import React, { memo, useContext, useEffect } from "react";
import { store } from "../../App";
import SignUp from "./SignUp";
import Login from "./Login";
import { TextGenerateEffect } from "../utils/TextGenerate";

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
    <div className="h-screen fixed w-screen bg-white text-gray-900 font-poppins flex items-center justify-center">
      <div className="flex justify-between w-full items-center px-8 relative">
        <div className="w-auto hidden sm:block md:pl-4 cursor-default m-auto sm:mt-54 md:mt-32 xl:mt-32">
          <TextGenerateEffect
            words={`The Secure,  \n easiest and fastest \n way to transfer money.`}
          />
          <p className="ml-0 mt-10 text-xs md:text-sm lg:text-xl">
            send & receive money in minutes without paying extra charges.
          </p>
        </div>
        {isLogin ? <Login /> : <SignUp />}
      </div>

      {loader ? (
        <div className="fixed bg-transparent backdrop-blur h-screen w-screen top-0 left-0 z-100">
          <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div className="loader h-12"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(HomePage);
