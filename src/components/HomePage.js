import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import SignUp from "./SignUp";
import Login from "./Login";
import { useNavigate } from "react-router";

function HomePage() {
  const { loader, windowWidth, setWindowWidth, isLogin, setSavedAcc } =
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
    setSavedAcc([]);
  }, []);
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
        {/* <h1 className="font-extrabold text-4xl w-auto font-extrabold ">
          Easy Transfer
        </h1> */}
        {/* <Menu nav={["Register"]} /> */}
      </div>
      {isLogin ? (
        <div className=" w-[70%] sm:w-[60%] md:w-[50%] lg:w-[33%]  mx-auto   shadow-md shadow-black h-auto rounded-xl  mt-[7vh] ">
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
        <div className="mx-auto w-[70%] sm:w-[60%] md:w-[50%] lg:w-[33%]  text-gray-800  bg-white  box-border mt-[5vh] lg:mt-[7vh] rounded-2xl h-auto">
          <div className="w-full border-2 bg-white text-gray-800 rounded-2xl shadow-md shadow-black">
            <SignUp />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(HomePage);
