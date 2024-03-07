import React, { useContext, useState, useEffect, memo } from "react";
import { store } from "../App";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import logo from "../assets/images/Greenwhitelogo2.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useNavigate } from "react-router";

function SignUp() {
  const {
    isValidNumber,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    setIsLogin,
    setIsLoggedOut,
    setIsValidNumber,
  } = useContext(store);

  const [allInputAlert, setAllInputAlert] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(true);
  const [regMobileNumber, setRegMobileNumber] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const phoneNumber = PhoneNumberUtil.getInstance();
  const navigate = useNavigate();

  const login = () => {
    setIsLogin(true);
    clearInputs();
  };

  const handleRegMobileNumber = (value, country) => {
    try {
      const parsedNum = phoneNumber.parseAndKeepRawInput(
        `+${value}`,
        country.countryCode
      );
      const isValid = phoneNumber.isValidNumber(parsedNum);
      setIsValidNumber(isValid);
    } catch (err) {
      return err;
    }
    setRegMobileNumber(value);
  };

  const handleCreatePassword = (e) => {
    const value = e.target.value;
    const allowedPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_+={}[\]:;'"<>,./?]).{8,}$/;
    const testedValue = allowedPattern.test(value);
    setCreatePassword(value);
    if (testedValue) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    const allowedPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_+={}[\]:;'"<>,./?]).{8,}$/;
    const testedValue = allowedPattern.test(value);
    setConfirmPassword(value);
    if (testedValue) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleShowPassword = (type) => {
    switch (type) {
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

  const clearInputs = () => {
    setRegMobileNumber("");
    setCreatePassword("");
    setConfirmPassword("");
  };

  const signupUser = async (e) => {
    e.preventDefault();
    if (regMobileNumber && createPassword && confirmPassword) {
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);
        try {
          const response = await axios.post("http://localhost:8080/signUp", {
            mobile: "+" + regMobileNumber,
            password: createPassword,
          });

          if (response.status === 201) {
            setIsAlreadyUser(true);
            setIsLogin(false);
          } else if (response.status === 200) {
            setIsLoggedOut(false);
            navigate("/transferPage");
            sessionStorage.setItem("mobileNumber", "+" + regMobileNumber);
            setIsLogin(true);
            setAllInputAlert(false);
            setRegMobileNumber("");
            setCreatePassword("");
            setConfirmPassword("");
            setSignUpFailed(false);
            setIsAlreadyUser(false);
          }
        } catch (error) {
          setAllInputAlert(true);
        }
      }
    } else {
      setAllInputAlert(true);
    }
  };

  const signUpUserUsingSocket = (e) => {
    e.preventDefault();
    if (regMobileNumber && createPassword && confirmPassword) {
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);
        socket.emit("signUp", {
          mobileNumber: "+" + regMobileNumber,
          password: createPassword,
        });
      }
    } else {
      setAllInputAlert(true);
    }
  };

  useEffect(() => {
    setPasswordError(false);
  }, []);

  useEffect(() => {
    socket.on("userRegisteredAlready", () => {
      setIsAlreadyUser(true);
      setIsLogin(false);
    });

    socket.on("userRegistered", (data) => {
      setIsLogin(true);
      setAllInputAlert(false);
      setIsLoggedOut(false);
      navigate("/transferPage");
      sessionStorage.setItem("mobileNumber", data.mobileNumber);
      setRegMobileNumber("");
      setCreatePassword("");
      setConfirmPassword("");
      setSignUpFailed(false);
      setIsAlreadyUser(false);
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
  }, [windowWidth, setWindowWidth]);

  return (
    <>
      <div className="space-y-2 sm:space-y-0 flex flex-col items-center justify-center pt-8 text-gray-600">
        <img
          className="object-cover min-h-8 min-w-40 max-w-56 sm:max-w-65 text-center text-gray-700 items-center font-poppins"
          src={logo}
          alt="Easy Transfer"
        ></img>
        <h1 className="text-center m-0 text-lg sm:text-lg font-bold font-poppins cursor-default ">
          User Register
        </h1>
      </div>

      <form className="flex flex-col items-center w-full m-auto rounded-xl text-gray-800">
        <div className="flex flex-col w-4/5 ">
          <label htmlFor="" className="mb-1 text-sm">
            Mobile Number
          </label>
          <PhoneInput
            country={"in"}
            placeholder="Enter Mobile Number"
            value={regMobileNumber}
            onChange={handleRegMobileNumber}
            inputProps={
              allInputAlert && !regMobileNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base  pl-11  p-4 font-poppins border-box ",
                  }
                : isAlreadyUser
                ? {
                    required: true,
                    className:
                      "outline-0 h-10  w-full border border-red-600 rounded-lg text-base  pl-11  p-4 font-poppins border-box ",
                  }
                : !isValidNumber
                ? {
                    required: true,
                    className:
                      "outline-0 h-10 w-full border border-red-600 rounded-lg text-base pl-11 p-4 font-poppins border-box ",
                  }
                : {
                    required: true,
                    className:
                      "outline-0 h-10 w-full border border-slate-300 rounded-lg text-base pl-11 p-4 font-poppins border-box ",
                  }
            }
            buttonClass={
              allInputAlert && !regMobileNumber
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins"
                : isAlreadyUser
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins"
                : !isValidNumber
                ? "border-red-600 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins"
                : "border-slate-300 border-2 rounded-lg rounded-br-0 rounded-tr-0 bg-white font-poppins"
            }
          />

          {isValidNumber ? null : (
            <p className="text-xs mt-1 text-red-500">Invalid Number</p>
          )}

          {allInputAlert && !regMobileNumber ? (
            <span className="w-4/5 text-xs mt-1 text-red-500">
              Enter mobile number
            </span>
          ) : null}
          {isAlreadyUser ? (
            <span className="w-4/5 text-red-500 mt-1 text-xs">
              Mobile number already registered!
            </span>
          ) : null}
        </div>

        <div className="flex flex-col w-4/5 mt-1 relative">
          <label htmlFor="" className="block leading-6 text-left text-sm mb-1">
            Create Password
          </label>
          <input
            className={
              passwordError
                ? "outline-0 h-10 w-full rounded-lg text-base pl-2 sm:p-4 border border-red-500 border-box "
                : signUpFailed || (allInputAlert && !createPassword)
                ? "outline-0 h-10 w-full rounded-lg text-base pl-2 sm:p-4 border border-red-500 border-box "
                : "outline-0 h-10 w-full rounded-lg text-base pl-2 sm:p-4 border border-slate-300 border-box "
            }
            type={showCreatePassword ? "text" : "password"}
            max={10}
            value={createPassword}
            onChange={handleCreatePassword}
            onClick={() => setPasswordError(true)}
            placeholder="Enter Your Password"
            required
          />

          {showCreatePassword ? (
            <FaRegEye
              className="cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              onClick={() => handleShowPassword("create")}
            />
          ) : (
            <FaRegEyeSlash
              className="cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              onClick={() => handleShowPassword("create")}
            />
          )}
        </div>

        {allInputAlert && !createPassword ? (
          <span className="w-4/5 text-xs text-red-500 mb-0">
            Enter password
          </span>
        ) : null}

        {passwordError && (
          <p className="w-4/5 md:w-4/5 text-red-500 text-xs mb-2 ">
            {!/[A-Z]/.test(createPassword) && <p>Must have 1 upper case. </p>}
            {!/[a-z]/.test(createPassword) && <p>Must have 1 lower case. </p>}
            {!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(createPassword) && (
              <p>Must have 1 special character. </p>
            )}
            {!/[0-9]/.test(createPassword) && <span>Must have 1 digit. </span>}
            {createPassword.length <= 7 && (
              <p>Must have at least 8 characters. </p>
            )}
          </p>
        )}

        <div className="flex flex-col w-4/5 relative">
          <label htmlFor="" className="block leading-6 text-left text-sm mb-1">
            Confirm Password
          </label>
          <input
            className={
              signUpFailed || (allInputAlert && !confirmPassword)
                ? "outline-0 h-10 w-full rounded-lg pl-2 sm:p-4 text-base border border-red-500 border-box "
                : "outline-0 h-10 w-full rounded-lg pl-2 sm:p-4 text-base border border-slate-300 border-box "
            }
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPassword}
            placeholder="Enter Your Password"
            max={10}
            required
          />
          {showConfirmPassword ? (
            <FaRegEye
              className="cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              onClick={() => handleShowPassword("confirm")}
            />
          ) : (
            <FaRegEyeSlash
              className="cursor-pointer absolute right-4 bottom-1 -translate-y-2/4 text-zinc-400"
              onClick={() => handleShowPassword("confirm")}
            />
          )}
        </div>

        {signUpFailed ||
        (createPassword !== confirmPassword && confirmPassword) ? (
          <span className="w-4/5 text-xs text-red-500">
            Password does not match
          </span>
        ) : allInputAlert && !confirmPassword ? (
          <span className="text-xs w-4/5 text-red-500 mb-2">
            Enter Password
          </span>
        ) : null}

        <div className="w-4/5 items-center flex justify-center mt-4">
          {" "}
          <button
            className="w-full bg-gray-800 hover:bg-gray-600 border-0 text-white text-center p-2 font-bold font-sans h-auto mt-4 rounded-md "
            onClick={
              connectionMode === "socket" ? signUpUserUsingSocket : signupUser
            }
          >
            Sign up
          </button>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p
            className={
              passwordError
                ? "font-light text-xs mb-8  mt-2"
                : "font-light text-xs mb-8  mt-12"
            }
          >
            Already have an account?
            <strong
              className="font-bold text-gray-800 cursor-pointer"
              onClick={login}
            >
              Login
            </strong>
          </p>
        </div>
      </form>
    </>
  );
}

export default memo(SignUp);
