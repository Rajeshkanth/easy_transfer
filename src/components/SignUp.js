import React, { useContext, useState, useEffect } from "react";
import { store } from "../App";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

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
    registeredUsers,
    userName,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    isLogin,
    setIsLogin,
    passwordError,
    setPasswordError,
  } = useContext(store);

  //   const [isLogin, setIsLogin] = useState(true);
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
    if (
      regMobileNumber &&
      createPassword &&
      confirmPassword &&
      passwordError !== true
    ) {
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);
        const response = await axios.post(
          "https://polling-server.onrender.com/toDB",
          {
            Mobile: regMobileNumber,
            Password: createPassword,
          }
        );

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
          console.log("signed");
        }
      }

      if (userName === "") {
        setLoggedUser(regMobileNumber);
      } else {
        setLoggedUser(userName);
      }
      // }
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

        socket.emit("signUpUser", {
          Mobile: regMobileNumber,
          Password: createPassword,
        });

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
        <div className="space-y-3 sm:space-y-5 lg:space-y-6 items-center justify-center pt-[2rem] text-gray-600">
          <h1 className="font-extrabold text-3xl sm:text-4xl text-center text-gray-700 items-center font-poppins">
            Easy Transfer
          </h1>
          <h1 className="text-center m-0 text-[4vw]   sm:text-2xl font-bold font-poppins    cursor-default ">
            User Register
          </h1>
        </div>

        <form className="flex flex-col items-center w-full m-auto  sh-auto  rounded-xl text-gray-800  ">
          <div className="flex flex-col w-[80%]">
            <label htmlFor="" className="mb-[.2rem] text-[14px]">
              Mobile Number
            </label>
            <input
              className={
                regMobileNumber.length < 10
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg  p-[1rem] text-[16px]  border-box "
                  : isAlreadyUser
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg  p-[1rem]  text-[16px] border-box "
                  : "outline-0 h-10 w-full border-2 border-slate-200  rounded-lg  p-[1rem] text-[16px]  border-box "
              }
              type="tel"
              minLength={10}
              maxLength={10}
              value={regMobileNumber}
              onChange={handleRegMobileNumber}
              placeholder="Enter Mobile Number"
            />
          </div>

          <div className="flex flex-col w-[80%] mt-[1rem]  ">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Create Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-red-500  border-box "
                  : signUpFailed
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-slate-200  border-box "
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
                className="relative ml-[45vw] sm:ml-[40vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative ml-[45vw] sm:ml-[40vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            )}
          </div>

          <div className="flex flex-col  w-[80%] ">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Confirm Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg  p-[1rem] text-[16px] border-2 border-red-500  border-box "
                  : signUpFailed
                  ? "outline-0 h-10 w-full rounded-lg  p-[1rem] text-[16px] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg  p-[1rem] text-[16px] border-2 border-slate-200  border-box "
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
                className="relative ml-[45vw] sm:ml-[40vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative ml-[45vw] sm:ml-[40vw] md:ml-[30vw] lg:ml-[20vw] xl:ml-[22vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            )}
          </div>
          {allInputAlert ? (
            <div className="w-[80%]">
              {" "}
              <p className="text-xs text-red-500">*fill all inputs</p>
            </div>
          ) : null}
          {signUpFailed ? (
            <p className="w-[80%] text-xs text-red-500">
              *Password does not match.
            </p>
          ) : null}
          {isAlreadyUser ? (
            <p className="w-[80%] text-red-500 text-xs">
              *Mobile number already registered!
            </p>
          ) : null}

          {passwordError ? (
            <div className="w-[80%]">
              <p className="w-full text-red-500 text-xs">
                *password must have 1 upper case
              </p>
              <p className="w-full text-red-500 text-xs">
                *password must have 1 lower case
              </p>
              <p className="w-full text-red-500 text-xs">
                *password must have 1 special character
              </p>
              <p className="w-full text-red-500 text-xs">
                *password must have 8 letters
              </p>
            </div>
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

export default SignUp;
