import React, { useContext, useState, useEffect, memo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { store } from "../App";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "./images/Greenwhitelogo2.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const numberUtil = PhoneNumberUtil.getInstance();
  const {
    setIsLoggedOut,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    setIsLogin,
    setLoader,
    loader,
    setNewUser,
    isNewUser,
    loginFailed,
    setLoginFailed,
    loginInputAlert,
    setLoginInputAlert,
  } = useContext(store);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const handleMobileNumber = (value, country) => {
    const countryCode = country.countryCode.toUpperCase();
    try {
      const parsedNum = numberUtil.parse(
        `+${value}`,
        countryCode.toLowerCase()
      );
      const isValid = numberUtil.isValidNumber(parsedNum);
      setIsValidNumber(isValid);
    } catch (err) {
      return err;
    }
    setMobileNumber(value);
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
        break;
    }
  };
  const loginToDashboard = async (e) => {
    e.preventDefault();
    if (mobileNumber && password && isValidNumber) {
      setIsValidNumber(false);
      setLoader(true);
      try {
        const response = await axios.post(`http://localhost:8080/login/`, {
          Mobile: mobileNumber.slice(2),
          Password: password,
          TabId: sessionStorage.getItem("tabId") + mobileNumber.slice(2),
        });
        if (response.status === 200) {
          setLoader(false);
          setIsLoggedOut(false);
          navigate("/transferPage");
          document.cookie = mobileNumber.slice(2);
          setMobileNumber("");
          setPassword("");
          setLoginFailed(false);
          setLoginInputAlert(false);
        } else if (response.status === 201) {
          setNewUser(true);
          setIsLoggedOut(true);
          setLoader(false);
        } else if (response.status === 202) {
          setIsLoggedOut(true);
          setLoader(false);
          setLoginFailed(true);
        }
      } catch (error) {
        setIsLoggedOut(true);
        setLoader(false);
        setLoginInputAlert(true);
      }
    } else {
      setIsLoggedOut(true);
      setLoginInputAlert(true);
      setLoader(false);
    }
  };

  const loginToDashboardUsingSocket = async (e) => {
    e.preventDefault();
    if (mobileNumber && password && isValidNumber) {
      setIsValidNumber(false);
      setLoader(true);
      await socket.emit("login", {
        mobileNumber: mobileNumber.slice(2),
        password: password,
        tabId: sessionStorage.getItem("tabId") + mobileNumber.slice(2),
      });
      socket.on("loginSuccess", () => {
        setLoader(false);
        setIsLoggedOut(false);
        navigate("/transferPage");
        document.cookie = mobileNumber.slice(2);
        setMobileNumber("");
        setPassword("");
        setLoginFailed(false);
        setLoginInputAlert(false);
      });
      socket.on("newUser", () => {
        setNewUser(true);
        setIsLoggedOut(true);
        setLoader(false);
        setIsValidNumber(true);
      });
      socket.on("loginFailed", async () => {
        setIsLoggedOut(true);
        setLoader(false);
        setIsValidNumber(true);
        setLoginFailed(true);
      });
    } else {
      setIsLoggedOut(true);
      setLoginInputAlert(true);
      setLoader(false);
    }
  };
  useEffect(() => {
    setLoginInputAlert(false);
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
    <>
      <div className="items-center justify-center pt-8 text-gray-600 flex space-y-0 flex-col">
        <img
          className="object-cover min-h-8 min-w-40 max-w-56 sm:max-w-65  text-center text-gray-700 items-center font-poppins"
          src={logo}
        ></img>
        <h1 className="text-center m-0 text-md sm:text-lg md:text-xl font-bold font-poppins cursor-default ">
          Welcome Back
        </h1>
      </div>

      <form
        className={
          windowWidth < 640
            ? "flex flex-col items-center bg-white m-auto h-auto w-full rounded-2xl space-y-2 font-poppins "
            : "flex flex-col items-center bg-white m-auto rounded-2xl h-auto w-full space-y-2 font-poppins "
        }
      >
        <div className="flex flex-col space-y-1 w-custom-80 ">
          <label htmlFor="" className="text-sm mb-1 ">
            Mobile Number
          </label>

          <PhoneInput
            name="mobileNumber"
            country={"in"}
            countryCodeEditable={false}
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={handleMobileNumber}
            inputProps={
              loginInputAlert && !mobileNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins  border-box ",
                  }
                : isNewUser
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins  border-box ",
                  }
                : mobileNumber && !isValidNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins  border-box ",
                  }
                : {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border  border-slate-300 rounded-lg text-base pl-11 p-4 font-poppins  border-box ",
                  }
            }
            dialCodeEditable={false}
            buttonClass="border-red-800 border-2 rounded bg-white "
          />

          <div className="w-custom-80 mb-2">
            {mobileNumber ? (
              isValidNumber ? null : (
                <p className="text-xs w-custom-80 mt-minus-8  text-red-500">
                  Invalid number
                </p>
              )
            ) : null}
            {!mobileNumber && loginInputAlert ? (
              <p className="text-xs w-custom-80 mt-minus-8 text-red-500">
                Enter mobile number
              </p>
            ) : null}
            {isNewUser ? (
              <p className="text-xs mt-1 text-red-500">Wrong mobile number</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-custom-80 ">
          <label htmlFor="" className="block leading-6 text-left text-sm mb">
            Password
          </label>
          <input
            name="password"
            className={
              loginInputAlert && !password
                ? "outline-0 h-10 w-full rounded-lg  p-4 pl-2 sm:p-4 border text-base border-red-600  border-box  "
                : loginFailed
                ? "outline-0 h-10 w-full rounded-lg  p-4 pl-2 sm:p-4 border text-base border-red-600  border-box  "
                : "outline-0 h-10 w-full rounded-lg  p-4 pl-2 sm:p-4 border text-base border-slate-300  border-box "
            }
            type={showPassword ? "text" : "password"}
            minLength={6}
            value={password}
            onChange={handlePassword}
            placeholder="Enter your password"
          />

          {showPassword ? (
            <FaRegEye
              className={
                windowWidth < 640
                  ? "cursor-pointer relative m-l-57 bottom-8 text-zinc-400"
                  : "cursor-pointer relative  sm:m-l-42  md:m-l-35 lg:m-l-25 xl:m-l-23 bottom-0 sm:bottom-8 text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "cursor-pointer relative m-l-57 bottom-8 text-zinc-400"
                  : "cursor-pointer relative  sm:m-l-42  md:m-l-35 lg:m-l-25 xl:m-l-23 bottom-4 sm:bottom-8 text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          )}
        </div>

        <div className="w-custom-80">
          {loginInputAlert && !password ? (
            <p className="relative bottom-6  text-red-500 text-xs cursor-default ">
              Enter Password
            </p>
          ) : null}
          {loginFailed && !isNewUser ? (
            <p className="relative bottom-6  text-xs  text-red-500">
              Wrong password
            </p>
          ) : null}
        </div>

        <div className="w-custom-80 items-center flex justify-center">
          {" "}
          <button
            disabled={loader ? true : false}
            className="w-full  border-0  outline-0  hover:bg-gray-600 bg-gray-800 text-white text-center p-2 font-bold  h-auto   rounded-sm "
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
          <p className="text-xs mt-8 text-gray-800 sm:mt-12  mb-2 underline cursor-pointer ">
            Forgot Password?
          </p>
          <p className="font-light text-xs text-gray-800 mt-2 mb-8">
            Don't have an account?
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

export default memo(Login);
