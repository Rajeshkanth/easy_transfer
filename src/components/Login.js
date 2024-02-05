import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { store } from "../App";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "./Loader";

function Login() {
  const navigate = useNavigate();

  const [loginFailed, setLoginFailed] = useState(false);
  const [loginInputAlert, setLoginInputAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    password,
    setPassword,
    setMobileNumber,
    mobileNumber,
    registeredUsers,
    setKey,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    setIsLogin,
    setLoader,
    loader,
  } = useContext(store);

  const handleMobileNumber = (e) => {
    const value = e.target.value;

    if (value.length <= 10) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setMobileNumber(sanitizedValue);
    }
  };

  const handlePassword = (e) => {
    const value = e.target.value;
    const allowedPattern = /^[a-zA-Z0-9@$]*$/;
    if (allowedPattern.test(value)) {
      setPassword(value);
    }
  };

  const signup = () => {
    setIsLogin(false);
    setMobileNumber("");
    setPassword("");
  };

  const handleShowPassword = (type) => {
    switch (type) {
      case "login":
        setShowPassword(!showPassword);
        break;
      case "create":
        setShowCreatePassword(!showCreatePassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        console.log("none");
        break;
    }
  };

  const loginToDashboard = async (e) => {
    e.preventDefault();
    if (mobileNumber && password && mobileNumber.length > 8) {
      const request = await axios.post(
        "https://polling-server.onrender.com/loginRequest",
        {
          Mobile: mobileNumber,
          Password: password,
        }
      );

      if (request.status === 200) {
        navigate("/transferPage");
        document.cookie = mobileNumber;
        setKey(document.cookie);
        setLoginFailed(false);
        setLoginInputAlert(false);
      } else if (request.status === 201) {
        // setLoginFailed(true);
        setNewUser(true);
      } else if (request.status === 202) {
        setLoginFailed(true);
      }
      setMobileNumber("");
      setPassword("");
    } else {
      setLoginInputAlert(true);
      // alert("Enter Valid Number");
    }
  };

  const loginToDashboardUsingSocket = async (e) => {
    e.preventDefault();
    if (mobileNumber && password && mobileNumber.length > 8) {
      setLoader(true);
      await socket.emit("login", {
        Mobile: mobileNumber,
        Password: password,
      });
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
      socket.on("loginFailed", () => {
        setLoginFailed(true);
        setLoader(false);
      });
    } else {
      setLoginInputAlert(true);
      setLoader(false);
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
    <>
      <div className="items-center justify-center pt-[2rem] text-gray-600 flex space-y-6 flex-col">
        <h1 className="font-extrabold text-3xl sm:text-4xl text-center text-gray-700 items-center font-poppins">
          Easy Transfer
        </h1>
        <h1 className="text-center m-0 text-[4vw] sm:text-[3vh] md:text-2xl font-bold font-poppins    cursor-default ">
          Welcome Back
        </h1>
      </div>

      <form
        className={
          windowWidth < 640
            ? "flex flex-col items-center bg-white m-auto h-auto w-full rounded-2xl space-y-3 font-poppins "
            : "flex flex-col items-center bg-white m-auto rounded-2xl h-auto w-full space-y-3 font-poppins "
        }
      >
        <div className="flex flex-col space-y-1 w-[80%]">
          <label htmlFor="" className="text-[14px] mb-[.2rem] ">
            Mobile Number
          </label>
          <input
            className={
              mobileNumber.length < 10
                ? "outline-0 h-10  w-full border-2 border-red-600  text-[16px] rounded-lg  p-[1rem]    border-box  "
                : loginFailed
                ? "outline-0 h-10  w-full border-2 border-red-600  rounded-lg  text-[16px] p-[1rem]   border-box  "
                : "outline-0 h-10  w-full border-2 border-slate-300 rounded-lg text-[16px]  p-[1rem]   border-box "
            }
            type="tel"
            maxLength={10}
            value={mobileNumber}
            onChange={handleMobileNumber}
            placeholder="Enter Mobile Number"
          />
          {isNewUser ? (
            <div className="w-[80%] mb-2">
              {" "}
              <p className="text-xs  text-red-500">wrong mobile number</p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col space-y-1 w-[80%] ">
          <label
            htmlFor=""
            className="block leading-6 text-left text-[14px] mb-[.2rem]  "
          >
            Password
          </label>
          <input
            className={
              loginFailed
                ? "outline-0 h-10 w-full rounded-lg  p-[1rem] sm:p-[1rem] border-2 text-[16px] border-red-300  border-box  "
                : "outline-0 h-10 w-full rounded-lg  p-[1rem] sm:p-[1rem] border-2 text-[16px] border-slate-300  border-box "
            }
            type={showPassword ? "text" : "password"}
            minLength={6}
            maxLength={10}
            value={password}
            onChange={handlePassword}
            placeholder="Enter Your Password"
          />

          {showPassword ? (
            <FaRegEye
              className={
                windowWidth < 640
                  ? "relative ml-[45vw] bottom-[2rem] text-zinc-400"
                  : "relative  sm:ml-[35vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-0 sm:bottom-[2rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "relative ml-[45vw] bottom-[2rem] text-zinc-400"
                  : "relative  sm:ml-[35vw]  md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-[1rem] sm:bottom-[2rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          )}
        </div>

        <div className="w-[80%]">
          {loginInputAlert ? (
            <p className=" text-red-500 text-xs cursor-default">
              Fill all the inputs
            </p>
          ) : null}
          {loginFailed ? (
            <p className="text-xs  text-red-500">Wrong password</p>
          ) : null}
        </div>

        <div className="w-[80%] items-center flex justify-center">
          {" "}
          <button
            className="w-full  border-0  outline-0  hover:bg-gray-600 bg-gray-800 text-white text-center p-[.5rem] font-bold  h-auto   rounded-md "
            onClick={
              connectionMode === "socket"
                ? loginToDashboardUsingSocket
                : loginToDashboard
            }
          >
            Log in
          </button>
        </div>

        <div className="flex flex-col justify-center  items-center">
          {" "}
          <p className="text-xs mt-[2rem] text-gray-800 sm:mt-[3rem]  mb-[.4rem] underline cursor-pointer ">
            Forgot Password?
          </p>
          <p className="font-light text-xs text-gray-800 mt-[.5rem] mb-[2rem]">
            Don't have an account?{" "}
            <strong
              className="font-bold text-gray-800 cursor-pointer"
              onClick={signup}
            >
              Sign up
            </strong>
          </p>
        </div>
      </form>
    </>
  );
}

export default Login;
