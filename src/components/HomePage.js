import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import SignUp from "./SignUp";
import Login from "./Login";
import SignUpMobile from "./SignUpMobile";

function HomePage() {
  const { registeredUsers, windowWidth, setWindowWidth, isLogin, setIsLogin } =
    useContext(store);

  useEffect(() => {
    console.log(registeredUsers);
  }, [registeredUsers]);
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
    <div className="h-screen fixed w-screen bg-gradient-to-b from-gray-500 to-black  ">
      <div className="h-[10%]  align-center pt-[1rem] pl-[5rem] ">
        <h1 className="font-extrabold text-4xl italic text-white">
          Easy Transfer
        </h1>
      </div>

      <div className="h-screen w-7/5  block sm:flex p-10 sm:p-4  border-box">
        <div
          className={
            windowWidth < 640
              ? "w-auto  h-auto bg-white  rounded-xl m-auto pt-[3rem] border-box "
              : isLogin
              ? " sm:w-1/2 lg:w-1/2 h-[80vh] bg-white lg:h-[80vh] rounded-l-xl ml-[4rem] "
              : " sm:w-1/2  lg:w-3/5 h-[80vh] lg:h-[80vh]  bg-gradient-to-b from-green-300 to-green-100 rounded-l-xl ml-[4rem] pt-[4rem] border-box"
          }
        >
          {isLogin ? (
            <>
              <Login />
            </>
          ) : (
            <>
              {windowWidth < 640 ? (
                <>
                  <SignUpMobile />
                </>
              ) : (
                <img
                  className=" transform -scale-x-100 h-full w-full lg:h-auto lg:w-auto"
                  src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-concept-3428212-2902554.png"
                  alt="Waiting"
                />
              )}
            </>
          )}
        </div>
        {windowWidth < 640 ? null : <SignUp />}
      </div>
    </div>
  );
}

export default memo(HomePage);
