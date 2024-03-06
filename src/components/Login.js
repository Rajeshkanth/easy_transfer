import React, { useContext, useState, useEffect, memo } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { store } from "../App";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "../images/Greenwhitelogo2.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    allowedPattern.test(value) ? setPassword(value) : setPassword("");
  };

  const signup = () => {
    setIsLogin(false);
    setMobileNumber("");
    setPassword("");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const clearInputs = () => {
    setMobileNumber("");
    setPassword("");
  };

  const newUser = () => {
    setNewUser(true);
    setIsLoggedOut(true);
    setLoader(false);
    setIsValidNumber(true);
  };

  const wrongPassword = () => {
    setIsLoggedOut(true);
    setLoader(false);
    setLoginFailed(true);
    setIsValidNumber(true);
  };

  const invalidInputs = () => {
    setIsLoggedOut(true);
    setLoginInputAlert(true);
    setLoader(false);
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
        });
        if (response.status === 200) {
          setLoader(false);
          setIsLoggedOut(false);
          navigate("/transferPage");
          document.cookie = mobileNumber.slice(2);
          clearInputs();
          setLoginFailed(false);
          setLoginInputAlert(false);
        } else if (response.status === 201) {
          newUser();
        } else if (response.status === 202) {
          wrongPassword();
        }
      } catch (error) {
        setIsLoggedOut(true);
        setLoader(false);
        setLoginInputAlert(true);
      }
    } else {
      invalidInputs();
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
      });
    } else {
      invalidInputs();
    }
  };

  useEffect(() => {
    setLoginInputAlert(false);
    socket.on("loginSuccess", () => {
      setLoader(false);
      setIsLoggedOut(false);
      navigate("/transferPage");
      document.cookie = mobileNumber.slice(2);
      clearInputs();
      setLoginFailed(false);
      setLoginInputAlert(false);
    });
    socket.on("newUser", () => {
      newUser();
    });
    socket.on("loginFailed", async () => {
      wrongPassword();
    });
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
          className="object-cover min-h-8 min-w-40 max-w-56 sm:max-w-65 text-center text-gray-700 items-center font-poppins"
          src={logo}
        ></img>
        <h1 className="text-center m-0 text-md sm:text-lg md:text-xl font-bold font-poppins cursor-default ">
          Welcome Back
        </h1>
      </div>
      <form
        onSubmit={
          connectionMode === "socket"
            ? loginToDashboardUsingSocket
            : loginToDashboard
        }
        className={
          windowWidth < 640
            ? "flex flex-col items-center bg-white m-auto h-auto w-full rounded-2xl space-y-2 font-poppins "
            : "flex flex-col items-center bg-white m-auto rounded-2xl h-auto w-full space-y-2 font-poppins "
        }
      >
        <div className="flex flex-col space-y-1 w-4/5">
          <label className="text-sm mb-1">Mobile Number</label>
          <PhoneInput
            name="mobileNumber"
            country={"in"}
            countryCodeEditable={false}
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={handleMobileNumber}
            inputProps={
              loginInputAlert && !mobileNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins border-box",
                  }
                : isNewUser
                ? {
                    required: true,
                    className:
                      "outline-0 h-10 w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins border-box",
                  }
                : mobileNumber && !isValidNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10 w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins border-box",
                  }
                : {
                    required: true,
                    className:
                      "outline-0 h-10 w-full border border-slate-300 rounded-lg text-base pl-11 p-4 font-poppins border-box ",
                  }
            }
            dialCodeEditable={false}
            buttonClass={
              loginInputAlert && !mobileNumber
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins hover:rounded-br-0 hover:rounded-tr-0"
                : isNewUser
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins hover:rounded-br-0 hover:rounded-tr-0"
                : mobileNumber && !isValidNumber
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins hover:rounded-br-0 hover:rounded-tr-0"
                : "border-slate-300 border-2 rounded-lg rounded-tr-0 rounded-br-0 !bg-transparent font-poppins hover:rounded-br-0 hover:rounded-tr-0"
            }
          />
          <div className="w-4/5 mb-2">
            {mobileNumber ? (
              isValidNumber ? null : (
                <p className="text-xs w-4/5 relative bottom-0  text-red-500">
                  Invalid number
                </p>
              )
            ) : null}
            {!mobileNumber && loginInputAlert ? (
              <p className="text-xs w-4/5 relative bottom-0 text-red-500">
                Enter mobile number
              </p>
            ) : null}
            {isNewUser ? (
              <p className="text-xs mt-1 text-red-500">Wrong mobile number</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-4/5 relative">
          <label className="block leading-6 text-left text-sm mb">
            Password
          </label>
          <input
            name="password"
            className={
              loginInputAlert && !password
                ? "outline-0 h-10 w-full rounded-lg p-4 pl-2 sm:p-4 border text-base border-red-600 border-box  "
                : loginFailed
                ? "outline-0 h-10 w-full rounded-lg p-4 pl-2 sm:p-4 border text-base border-red-600 border-box  "
                : "outline-0 h-10 w-full rounded-lg p-4 pl-2 sm:p-4 border text-base border-slate-300 border-box "
            }
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePassword}
            placeholder="Enter your password"
          />
          {showPassword ? (
            <FaRegEye
              className={
                windowWidth < 640
                  ? "cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
                  : "cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              }
              onClick={handleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
                  : "cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              }
              onClick={handleShowPassword}
            />
          )}
        </div>

        <div className="w-4/5 ">
          {loginInputAlert && !password ? (
            <p className="relative bottom-1  text-red-500 text-xs cursor-default ">
              Enter Password
            </p>
          ) : null}
          {loginFailed && !isNewUser ? (
            <p className="relative bottom-1  text-xs  text-red-500">
              Wrong password
            </p>
          ) : null}
        </div>

        <div className="w-4/5 items-center flex justify-center">
          <button
            type="submit"
            disabled={loader ? true : false}
            className="w-full border-0 outline-0 hover:bg-gray-600 bg-gray-800 text-white text-center p-2 font-bold  h-auto mt-4 rounded-lg "
          >
            Log in
          </button>
        </div>

        <div className="flex flex-col justify-center  items-center">
          <p className="text-xs mt-8 text-gray-800 sm:mt-12 mb-2 underline cursor-pointer ">
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
