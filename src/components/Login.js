import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { store } from "../App";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

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
      await socket.emit("login", {
        Mobile: mobileNumber,
        Password: password,
      });
      socket.on("loginSuccess", () => {
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
      });
      socket.on("loginFailed", () => {
        setLoginFailed(true);
      });
    } else {
      setLoginInputAlert(true);
      // alert("Enter Valid Number");
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
      <h1 className="text-center text-[6vw] sm:text-[4vh] md:text-4xl font-bold font-sans mt-[3vh] sm:mt-[10%] md:mt-[14%] cursor-default ">
        Welcome Back
      </h1>
      <form
        className={
          windowWidth < 640
            ? "flex flex-col items-center bg-white m-auto h-auto w-full rounded-2xl  mt-[3rem] "
            : "flex flex-col items-center bg-white m-auto rounded-2xl h-auto w-full  mt-[3rem]"
        }
      >
        <div className="flex flex-col w-[70%]">
          <label htmlFor="" className="font-medium font-sans">
            Mobile Number
          </label>
          <input
            className={
              mobileNumber.length < 10
                ? "outline-0 h-10  w-full border-2 border-red-500  rounded-lg mb-3 p-[1rem]  font-sans  border-box  "
                : loginFailed
                ? "outline-0 h-10  w-full border-2 border-red-500  rounded-lg mb-3   p-[1rem] font-sans  border-box  "
                : "outline-0 h-10  w-full border-2 border-slate-300 rounded-lg mb-3   p-[1rem] font-sans  border-box "
            }
            type="tel"
            maxLength={10}
            value={mobileNumber}
            onChange={handleMobileNumber}
            placeholder="Enter Mobile Number"
          />
        </div>
        <div className="flex flex-col w-[70%] ">
          <label
            htmlFor=""
            className="block leading-6 text-left font-medium font-sans "
          >
            Password
          </label>
          <input
            className={
              loginFailed
                ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] sm:p-[1rem] border-2 border-red-500 font-sans border-box  "
                : "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] sm:p-[1rem] border-2 border-slate-300 font-sans border-box "
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
                  ? "relative ml-[40vw] bottom-[3rem] text-zinc-400"
                  : "relative  sm:ml-[35vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[20vw] bottom-[3rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "relative ml-[40vw] bottom-[3rem] text-zinc-400"
                  : "relative  sm:ml-[35vw]  md:ml-[30vw] lg:ml-[20vw] xl:ml-[20vw] bottom-[3rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          )}
        </div>

        {loginInputAlert ? (
          <p className="w-[70%] text-red-500 text-xs cursor-default">
            *Fill all the inputs
          </p>
        ) : null}
        {loginFailed ? (
          <div className="w-[70%] mb-2">
            {" "}
            <p className="text-xs  text-red-500">*wrong mobile/password</p>
          </div>
        ) : null}

        {isNewUser ? (
          <div className="w-3/5 mb-2">
            {" "}
            <p className="text-xs  text-red-500">*wrong mobile number</p>
          </div>
        ) : null}

        {}

        <button
          className="w-1/3  border-0  outline-0 text-white hover:bg-gray-600 bg-gray-800 text-white text-center p-[.5rem] font-bold font-sans h-auto  mt-[.8rem] rounded-md "
          onClick={
            connectionMode === "socket"
              ? loginToDashboardUsingSocket
              : loginToDashboard
          }
        >
          Log in
        </button>

        <p className="text-xs mt-[2rem] text-gray-800 sm:mt-[3rem] md:mt-[3rem] underline cursor-pointer ">
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
      </form>
    </>
  );
}

export default Login;
