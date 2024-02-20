import React, { useContext, useState, useEffect, memo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { store } from "../App";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "./Loader";
import logo from "./images/Greenwhitelogo2.png";
// import PhoneInput2 from "react-phone-number-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
// import { isValidPhoneNumber } from "react-phone-number-input";
import parsePhoneNumber from "libphonenumber-js";

function Login() {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  // const [isNewUser, setNewUser] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [indiaCode, setIndiaCode] = useState(false);
  const [singaporeCode, setSingaporeCode] = useState(false);
  const [usRussiaCode, setUsRussiaCode] = useState(false);
  const [isValidIndianNumber, setIsValidIndianNumber] = useState(true);
  const [isValidUsRussianNumber, setIsValidUsRussianNumber] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedDialCode, setSelectedDialCode] = useState("");
  const numberUtil = PhoneNumberUtil.getInstance();
  const [parsedNum, setParsedNum] = useState("");
  // const phoneNumber = parsePhoneNumber(`+6594374758`, "SG");
  // const checking = numberUtil.isValidNumber("+914542610685", "IN");

  const {
    password,
    setPassword,
    setMobileNumber,
    mobileNumber,
    setKey,
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

  const handleMobileNumber = (value, country) => {
    const dialCode = country.dialCode;
    const countryCode = country.countryCode.toUpperCase();
    // const maxLength = numberUtil.getLengthOfNationalDestinationCode("us");
    // console.log(numberUtil.getExampleNumber(countryCode));
    // console.log(numberUtil);

    const firstDigit = value.substring(dialCode.length, dialCode.length + 1);

    // console.log(phones["am"]);
    // const regex = phones[countryCode];
    // console.log(regex);
    // console.log(regex.test(mobileNumber), mobileNumber);

    // setSelectedCountryCode(countryCode);
    // setSelectedDialCode(dialCode);
    // const isValid = isValidPhoneNumber(
    //   `+${dialCode + value.slice(dialCode.length)}`
    // );
    // setIsValidIndianNumber(isValid);
    // console.log(
    //   isValidIndianNumber,
    //   dialCode,
    //   value.slice(dialCode.length),
    //   isValidPhoneNumber(`+${dialCode + value.slice(dialCode.length)}`)
    // );
    // if (phoneNumber) {
    //   const a = phoneNumber.isValid();
    //   console.log(a, "85", phoneNumber.isValid());
    // }

    try {
      const parsedNum = numberUtil.parse(
        `+${value}`,
        countryCode.toLowerCase()
      );
      const isValid = numberUtil.isValidNumber(parsedNum);
      setIsValidIndianNumber(isValid);
    } catch (err) {
      console.log(err);
      console.log("Value:", value);
      console.log("Country Code:", countryCode);
    }

    // if (regex.test(mobileNumber)) {
    //   setIsValidIndianNumber(true);
    // } else {
    //   setIsValidIndianNumber(false);
    // }
    // if (dialCode === "91") {
    //   if (/^[6-9]/.test(firstDigit)) {
    //     setIndiaCode(true);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(false);
    //     setIsValidIndianNumber(true);
    //   } else {
    //     setIndiaCode(true);
    //     setIsValidIndianNumber(false);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(false);
    //   }
    // } else if (dialCode === "1") {
    //   if (/^[2-9]/.test(firstDigit)) {
    //     setIsValidIndianNumber(true);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(true);
    //     setIndiaCode(false);
    //   } else {
    //     setIsValidIndianNumber(false);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(true);
    //     setIndiaCode(false);
    //   }
    // } else if (dialCode === "7") {
    //   if (/^[7-8]/.test(firstDigit)) {
    //     setIsValidIndianNumber(true);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(true);
    //     setIndiaCode(false);
    //   } else {
    //     setIsValidIndianNumber(false);
    //     setSingaporeCode(false);
    //     setUsRussiaCode(true);
    //     setIndiaCode(false);
    //   }
    // } else if (dialCode === "65") {
    //   if (/^[8-9]/.test(firstDigit)) {
    //     setIsValidIndianNumber(true);
    //     setSingaporeCode(true);
    //     setUsRussiaCode(false);
    //     setIndiaCode(false);
    //   } else {
    //     setIsValidIndianNumber(false);
    //     setSingaporeCode(true);
    //     setUsRussiaCode(false);
    //     setIndiaCode(false);
    //   }
    // }
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
        setNewUser(true);
      } else if (request.status === 202) {
        setLoginFailed(true);
      }
      setMobileNumber("");
      setPassword("");
    } else {
      setLoginInputAlert(true);
    }
  };

  const loginToDashboardUsingSocket = async (e) => {
    e.preventDefault();
    console.log(mobileNumber);
    console.log(isValidIndianNumber);
    if (
      mobileNumber &&
      password &&
      mobileNumber.length > 7 &&
      isValidIndianNumber
      // isValidIndianNumber
    ) {
      console.log(mobileNumber, mobileNumber.slice(2).substring(0, 1));
      setLoader(true);
      await socket.emit("login", {
        Mobile: mobileNumber.slice(2),
        Password: password,
      });

      socket.on("loginSuccess", () => {
        setLoader(false);
        navigate("/transferPage");
        document.cookie = mobileNumber.slice(2);
        setMobileNumber("");
        setPassword("");
        setKey(document.cookie);
        setLoginFailed(false);
        setLoginInputAlert(false);
      });
      socket.on("newUser", () => {
        setNewUser(true);
        setLoader(false);
        setIsValidIndianNumber(true);
      });
      socket.on("loginFailed", async () => {
        setLoader(false);
        setIsValidIndianNumber(true);
        setLoginFailed(true);
      });
    } else {
      setLoginInputAlert(true);
      setIsValidIndianNumber(false);
      setLoader(false);
      // alert("failed");
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
      <div className="items-center justify-center pt-[2rem] text-gray-600 flex space-y-0 flex-col">
        <img
          className="font-extrabold text-xl sm:text-4xl object-cover h-[7vh] sm:h-[7vh] md:h-[9vh] lg:h-[9vh] xl:h-[11vh] w-[80%] md:w-[80%] lg:w-[24vw] xl:w-[22vw] text-center text-gray-700 items-center font-poppins"
          src={logo}
        ></img>
        <h1 className="text-center m-0 text-[4vw] sm:text-[3vh] md:text-2xl font-bold font-poppins    cursor-default ">
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
        <div className="flex flex-col space-y-[2px] w-[80%]">
          <label htmlFor="" className="text-[14px] mb-[.1rem] ">
            Mobile Number
          </label>

          <PhoneInput
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
                      "1 outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
                : mobileNumber && mobileNumber.length < 12 && indiaCode
                ? {
                    required: true,
                    className:
                      "2 outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
                : mobileNumber && mobileNumber.length < 11 && usRussiaCode
                ? {
                    required: true,
                    className:
                      "3 outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
                : isNewUser
                ? {
                    required: true,
                    className:
                      "4 outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
                : mobileNumber && !isValidIndianNumber
                ? {
                    required: true,
                    className:
                      "5 outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
                : {
                    required: true,
                    className:
                      "6 outline-0 h-10  w-full border-2 border-slate-300 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4.5vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                  }
            }
            dialCodeEditable={false}
            // onlyCountries={["in", "us", "ru", "sg"]}
            buttonStyle={
              loginInputAlert && !mobileNumber
                ? {
                    width: "14% ",
                    paddingLeft: "0px",
                    backgroundColor: "white",
                    border: "2px  solid rgb(220 38 38)",
                    borderColor: "rgb(220 38 38)",
                    borderRadius: " 0.5rem 0 0 0.5rem ",
                  }
                : isNewUser
                ? {
                    width: "14% ",
                    paddingLeft: "0px",
                    backgroundColor: "white",
                    border: "2px  solid rgb(220 38 38)",
                    borderColor: "rgb(220 38 38)",
                    borderRadius: " 0.5rem 0 0 0.5rem ",
                  }
                : mobileNumber && !isValidIndianNumber
                ? {
                    width: "14% ",
                    paddingLeft: "0px",
                    backgroundColor: "white",
                    border: "2px  solid rgb(220 38 38)",
                    borderColor: "rgb(220 38 38)",
                    borderRadius: " 0.5rem 0 0 0.5rem ",
                  }
                : {
                    width: "14% ",
                    paddingLeft: "0px",
                    backgroundColor: "white",
                    border: "2px  solid rgb(203 213 225)",
                    borderColor: "rgb(203 213 225)",
                    borderRadius: " 0.5rem 0 0 0.5rem ",
                  }
            }
          />

          <div className="w-[80%] mb-2">
            {mobileNumber ? (
              isValidIndianNumber ? null : (
                <p className="text-xs w-[80%] mt-[.4rem]  text-red-500">
                  Invalid number
                </p>
              )
            ) : null}
            {!mobileNumber && loginInputAlert ? (
              <p className="text-xs w-[80%] mt-[.4rem] text-red-500">
                Enter Mobile Number
              </p>
            ) : null}
            {isNewUser ? (
              <p className="text-xs mt-[.2rem] text-red-500">
                Wrong Mobile Number
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-[80%] ">
          <label
            htmlFor=""
            className="block leading-6 text-left text-[14px] mb-[.1rem]  "
          >
            Password
          </label>
          <input
            className={
              loginInputAlert && !password
                ? "outline-0 h-10 w-full rounded-lg  p-[1rem] pl-[.5rem] sm:p-[1rem] border-2 text-[16px] border-red-600  border-box  "
                : loginFailed
                ? "outline-0 h-10 w-full rounded-lg  p-[1rem] pl.[.5rem] sm:p-[1rem] border-2 text-[16px] border-red-600  border-box  "
                : "outline-0 h-10 w-full rounded-lg  p-[1rem] pl-[.5rem] sm:p-[1rem] border-2 text-[16px] border-slate-300  border-box "
            }
            type={showPassword ? "text" : "password"}
            minLength={6}
            value={password}
            onChange={handlePassword}
            placeholder="Enter Your Password"
          />

          {showPassword ? (
            <FaRegEye
              className={
                windowWidth < 640
                  ? "relative ml-[56.5vw] bottom-[2rem] text-zinc-400"
                  : "relative  sm:ml-[42vw] md:ml-[35vw] lg:ml-[25vw] xl:ml-[23.8vw] bottom-0 sm:bottom-[2rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          ) : (
            <FaRegEyeSlash
              className={
                windowWidth < 640
                  ? "relative ml-[56.5vw] bottom-[2rem] text-zinc-400"
                  : "relative  sm:ml-[42vw]  md:ml-[35vw] lg:ml-[25vw] xl:ml-[23.8vw] bottom-[1rem] sm:bottom-[2rem] text-zinc-400"
              }
              onClick={() => handleShowPassword("login")}
            />
          )}
        </div>

        <div className="w-[80%]">
          {/* {loginInputAlert ? (
            <p className=" text-red-500 text-xs cursor-default">
              Fill all the inputs
            </p>
          ) : null} */}
          {loginInputAlert && !password ? (
            <p className="relative top-[-4%] md:top-[-4.5vh] text-red-500 text-xs cursor-default mt-[.4rem] ">
              Enter Password
            </p>
          ) : null}
          {loginFailed && !isNewUser ? (
            <p className="relative top-[-3%] md:top-[-3vh] text-xs  text-red-500">
              Wrong password
            </p>
          ) : null}
        </div>

        <div className="w-[80%] items-center flex justify-center">
          {" "}
          <button
            disabled={loader ? true : false}
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

export default memo(Login);
