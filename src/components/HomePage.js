import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import SignUp from "./SignUp";
import Login from "./Login";
import SignUpMobile from "./SignUpMobile";
import Menu from "./Menu";
import Profile from "./Profile";
import { useNavigate } from "react-router";

function HomePage() {
  const { registeredUsers, windowWidth, setWindowWidth, isLogin, setIsLogin } =
    useContext(store);

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
    <div className="h-screen fixed w-screen bg-gray-800 text-white font-sans">
      <div className="h-[10%] w-screen  flex items-center pl-[4rem] box-border">
        <h1 className="font-extrabold text-4xl w-auto font-extrabold ">
          Easy Transfer
        </h1>
        {/* <Menu nav={["Register"]} /> */}
      </div>
      {isLogin ? (
        <div className=" w-[70%] sm:w-[33vw]  mx-auto   shadow-md shadow-gray-300 h-auto rounded-2xl  mt-[10vh] ">
          <div className="w-full border-2 border-white bg-white text-gray-800 rounded-2xl ">
            <Login />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-[70%] sm:w-[33%]  text-gray-800  bg-white  box-border mt-[8vh] rounded-2xl h-auto">
          <div className="w-full border-2 bg-white text-gray-800 rounded-2xl shadow-md shadow-black">
            <SignUp />
          </div>
        </div>
      )}

      {/* <div className="h-screen w-7/5  block sm:flex p-10 sm:p-4  border-box">
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
      </div> */}
    </div>
  );
}

export default memo(HomePage);
