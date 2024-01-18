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
    if (mobileNumber && password) {
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
    } else {
      setLoginInputAlert(true);
    }
    setMobileNumber("");
    setPassword("");
  };

  const loginToDashboardUsingSocket = async (e) => {
    e.preventDefault();
    if (mobileNumber && password) {
      await socket.emit("login", {
        Mobile: mobileNumber,
        Password: password,
      });
      socket.on("loginSuccess", () => {
        navigate("/transferPage");
        document.cookie = mobileNumber;
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
    }
    setMobileNumber("");
    setPassword("");
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
      <h1 className="text-center text-[6vw] sm:text-[3vh] md:text-4xl font-bold font-['Open_Sans'] sm:mt-[18%] cursor-default ">
        Welcome Back
      </h1>
      <form
        className={
          windowWidth < 640
            ? "flex flex-col items-center  m-auto h-auto w-full  mt-[3rem]"
            : "flex flex-col items-center  m-auto h-auto sm:w-full md:w-full lg:w-[70%]  mt-[3rem]"
        }
      >
        <div className="flex flex-col w-3/5">
          <label htmlFor="" className="font-medium font-['Open-Sans']">
            Mobile Number
          </label>
          <input
            className={
              mobileNumber.length < 10
                ? "outline-0 h-10  w-full border-2 border-red-500  rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100 "
                : loginFailed
                ? "outline-0 h-10  w-full border-2 border-red-500  rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100 "
                : "outline-0 h-10  w-full border-2 border-slate-300 rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100"
            }
            type="tel"
            maxLength={10}
            value={mobileNumber}
            onChange={handleMobileNumber}
            placeholder="Enter Mobile Number"
          />
        </div>
        <div className="flex flex-col w-3/5 ">
          <label
            htmlFor=""
            className="block leading-6 text-left font-medium font-['Open-Sans'] "
          >
            Password
          </label>
          <input
            className={
              loginFailed
                ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-red-500 font-['Open-Sans'] border-box bg-zinc-100 "
                : "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-slate-300 font-['Open-Sans'] border-box bg-zinc-100"
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
                  ? "relative ml-[34vw] bottom-[3rem]"
                  : "relative  sm:ml-[18vw] md:ml-[21vw] lg:ml-[14vw] xl:ml-[15vw] bottom-[3rem]"
              }
              onClick={() => handleShowPassword("login")}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "relative ml-[34vw] bottom-[3rem]"
                  : "relative  sm:ml-[18vw]  md:ml-[21vw] lg:ml-[14vw] xl:ml-[15vw] bottom-[3rem]"
              }
              onClick={() => handleShowPassword("login")}
            />
          )}
        </div>

        {loginInputAlert ? (
          <p className="w-3/5 text-red-500 text-xs cursor-default">
            *Fill all the inputs
          </p>
        ) : null}
        {loginFailed ? (
          <div className="w-3/5 mb-2">
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
          className="w-1/3 bg-gradient-to-b border-0  outline-0 from-black to-green-700 text-white text-center p-[.5rem] font-bold font-['Open_Sans'] h-auto  mt-[.8rem] rounded-full "
          onClick={
            connectionMode === "socket"
              ? loginToDashboardUsingSocket
              : loginToDashboard
          }
        >
          Log in
        </button>

        <p className="text-xs mt-[2rem] sm:mt-[5rem] md:mt-[3rem] underline cursor-pointer ">
          Forgot Password?
        </p>
        <p className="font-light text-xs  mt-[.5rem]">
          Don't have an account?{" "}
          <strong
            className="font-bold text-green-700 cursor-pointer"
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
