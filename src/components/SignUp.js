import React, { useContext, useState, useEffect, memo } from "react";
import { store } from "../App";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import logo from "./images/Greenwhitelogo2.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignUp() {
  const {
    createPassword,
    confirmPassword,
    handleConfirmPassword,
    handleCreatePassword,
    handleRegMobileNumber,
    regMobileNumber,
    setRegMobileNumber,
    setCreatePassword,
    setConfirmPassword,
    isValidNumber,
    userName,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    setIsLogin,
    passwordError,
    setPasswordError,
  } = useContext(store);

  const [allInputAlert, setAllInputAlert] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const login = () => {
    setIsLogin(true);
    clearInputs();
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

  const clearInputs = () => {
    setRegMobileNumber("");
    setCreatePassword("");
    setConfirmPassword("");
  };

  const signupUser = async (e) => {
    e.preventDefault();
    if (regMobileNumber && createPassword && confirmPassword) {
      console.log("clicked");
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);

        try {
          const response = await axios.post("http://localhost:8080/toDB", {
            Mobile: regMobileNumber.slice(2),
            Password: createPassword,
          });

          if (response.status === 201) {
            setIsAlreadyUser(true);
            setIsLogin(false);
            console.log("user already");
          } else if (response.status === 200) {
            setIsLogin(true);
            setAllInputAlert(false);
            setRegMobileNumber("");
            setCreatePassword("");
            setConfirmPassword("");
            setSignUpFailed(false);
            setIsAlreadyUser(false);
            alert("New user registered");
            console.log("signed");
          }
        } catch (error) {
          console.log(error);
          setAllInputAlert(true);
        }
      }

      if (userName === "") {
        setLoggedUser(regMobileNumber);
      } else {
        setLoggedUser(userName);
      }
    } else {
      setAllInputAlert(true);
    }
  };

  const signUpUserUsingSocket = (e) => {
    e.preventDefault();

    if (regMobileNumber && createPassword && confirmPassword) {
      console.log("clicked");
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);

        socket.emit("signUpUser", {
          Mobile: regMobileNumber.slice(2),
          Password: createPassword,
        });
      }

      if (userName === "") {
        setLoggedUser(regMobileNumber);
      } else {
        setLoggedUser(userName);
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
      console.log("user already");
    });

    socket.on("userRegistered", () => {
      setIsLogin(true);
      setAllInputAlert(false);
      setRegMobileNumber("");
      setCreatePassword("");
      setConfirmPassword("");
      setSignUpFailed(false);
      setIsAlreadyUser(false);
      console.log("signed");
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
      <>
        <div className="space-y-3 sm:space-y-0 lg:space-y-0 flex flex-col items-center justify-center pt-[2rem] text-gray-600">
          <img
            className="font-extrabold text-xl sm:text-4xl object-cover h-[8vh] md:h-[10vh] w-[80%] md:w-[65%] lg:w-[25vw] text-center text-gray-700 items-center font-poppins"
            src={logo}
          ></img>
          <h1 className="text-center m-0 text-[4vw]   sm:text-2xl font-bold font-poppins    cursor-default ">
            User Register
          </h1>
        </div>

        <form className="flex flex-col items-center w-full m-auto    rounded-xl text-gray-800  ">
          <div className="flex flex-col w-[80%] ">
            <label htmlFor="" className="mb-[.2rem] text-[14px]">
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
                        "outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                    }
                  : isAlreadyUser
                  ? {
                      required: true,
                      className:
                        "outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                    }
                  : !isValidNumber
                  ? {
                      required: true,
                      className:
                        "outline-0 h-10  w-full border-2 border-red-600 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                    }
                  : {
                      required: true,
                      className:
                        "outline-0 h-10  w-full border-2 border-slate-300 rounded-lg text-[16px] pl-[10vw] sm:pl-[7vw] md:pl-[6vw] lg:pl-[4vw] xl:pl-[4vw]  p-[1rem] font-poppins  border-box ",
                    }
              }
              countryCodeEditable={false}
              buttonStyle={
                allInputAlert && !regMobileNumber
                  ? {
                      width: "14% ",
                      paddingLeft: "0px",
                      backgroundColor: "white",
                      border: "2px  solid rgb(220 38 38)",
                      borderColor: "rgb(220 38 38)",
                      borderRadius: " 0.5rem 0 0 0.5rem ",
                    }
                  : isAlreadyUser
                  ? {
                      width: "14% ",
                      paddingLeft: "0px",
                      backgroundColor: "white",
                      border: "2px  solid rgb(220 38 38)",
                      borderColor: "rgb(220 38 38)",
                      borderRadius: " 0.5rem 0 0 0.5rem ",
                    }
                  : !isValidNumber
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

            {isValidNumber ? null : (
              <p className="text-xs mt-[.2rem] text-red-500">Invalid Number</p>
            )}

            {allInputAlert && !regMobileNumber ? (
              <div className="w-[80%]">
                {" "}
                <p className="text-xs mt-[.2rem] text-red-500">
                  Enter Mobile Number
                </p>
              </div>
            ) : null}
            {isAlreadyUser ? (
              <p className="w-[80%] text-red-500 mt-[.2rem] text-xs">
                Mobile number already registered!
              </p>
            ) : null}
          </div>

          <div className="flex flex-col w-[80%] mt-[.2rem]  ">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Create Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] pl-2 sm:p-[1rem] border-2 border-red-500  border-box "
                  : signUpFailed || (allInputAlert && !createPassword)
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] pl-2 sm:p-[1rem] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg text-[16px] pl-2  sm:p-[1rem]  border-2 border-slate-300  border-box "
              }
              type={showCreatePassword ? "text" : "password"}
              min={6}
              max={10}
              value={createPassword}
              onChange={handleCreatePassword}
              onClick={() => setPasswordError(true)}
              placeholder="Enter Your Password"
              required
            />
            {showCreatePassword ? (
              <FaRegEye
                className="cursor-pointer relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[22vw] xl:ml-[23.8vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            ) : (
              <FaRegEyeSlash
                className="cursor-pointer relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[22vw] xl:ml-[23.8vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            )}

            {allInputAlert && !createPassword ? (
              <p className="text-xs text-red-500 mt-[-.8rem] mb-[.7rem]">
                Enter Password
              </p>
            ) : null}
            {passwordError ? (
              <p className="w-full text-red-500 text-xs mt-[-.8rem] mb-[.4rem] ">
                {/[A-Z]/.test(createPassword) ? null : (
                  <p className="w-full text-red-500 text-xs  ">
                    Password must have 1 upper case{" "}
                  </p>
                )}{" "}
                {/[a-z]/.test(createPassword) ? null : (
                  <p className="w-full text-red-500 text-xs  ">
                    Password must have 1 lower case{" "}
                  </p>
                )}{" "}
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                  createPassword
                ) ? null : (
                  <p className="w-full text-red-500 text-xs  ">
                    Password must have 1 special character{" "}
                  </p>
                )}{" "}
                {/[0-9]/.test(createPassword) ? null : (
                  <p className="w-full text-red-500 text-xs  ">
                    Password must have 1 digit{" "}
                  </p>
                )}{" "}
                {createPassword.length > 7 ? null : (
                  <p className="w-full text-red-500 text-xs ">
                    Password must have 8 characters{" "}
                  </p>
                )}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col  w-[80%] mt-[-.4rem]">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Confirm Password
            </label>
            <input
              className={
                signUpFailed || (allInputAlert && !confirmPassword)
                  ? "outline-0 h-10 w-full rounded-lg pl-2 sm:p-[1rem] text-[16px] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg pl-2 sm:p-[1rem] text-[16px] border-2 border-slate-300  border-box "
              }
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPassword}
              placeholder="Enter Your Password"
              min={6}
              max={10}
              required
            />
            {showConfirmPassword ? (
              <FaRegEye
                className="cursor-pointer relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[22vw] xl:ml-[23.8vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            ) : (
              <FaRegEyeSlash
                className="cursor-pointer relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[22vw] xl:ml-[23.8vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            )}
          </div>

          {signUpFailed ||
          (createPassword !== confirmPassword && confirmPassword) ? (
            <p className="w-[80%] text-xs mt-[-.8rem] text-red-500">
              Password does not match
            </p>
          ) : allInputAlert && !confirmPassword ? (
            <p className="text-xs w-[80%] text-red-500 mt-[-.8rem] mb-[.4rem]">
              Enter Password
            </p>
          ) : null}

          <div className="w-[80%] items-center flex justify-center">
            {" "}
            <button
              className="w-full bg-gray-800 hover:bg-gray-600 border-0  text-white text-center p-[.5rem] font-bold font-sans h-auto  mt-[1rem] rounded-md "
              onClick={
                connectionMode === "socket" ? signUpUserUsingSocket : signupUser
              }
            >
              Sign up
            </button>
          </div>
          <div className="flex flex-col justify-center  items-center">
            <p
              className={
                passwordError
                  ? "font-light text-xs mb-[2rem]  mt-[.4rem]"
                  : "font-light text-xs mb-[2rem]  mt-[3rem]"
              }
            >
              Already have an account?{" "}
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
      {/* </div> */}
    </>
  );
}

export default memo(SignUp);
