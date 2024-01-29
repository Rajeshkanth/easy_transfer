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
      {/* <div
        className={
          isLogin
            ? "  w-full bg-gradient-to-b from-black to-green-500 h-[70vh] font-poppins flex flex-col justify-center items-center mr-[4rem]"
            : "  w-full bg-white h-[70vh]  rounded-xl mr-[4rem]  text-[4xl] font-poppins"
        }
      > */}
      <>
        <h1 className=" text-4xl  font-bold text-center mt-[2rem] ">
          User Register
        </h1>
        <form className="flex flex-col items-center  m-auto h-auto text-gray-800 mt-[3rem] mb-[2rem]">
          <div className="flex flex-col w-3/5">
            <label htmlFor="" className="font-medium ">
              Mobile Number
            </label>
            <input
              className={
                regMobileNumber.length < 10
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg mb-4 p-[1rem]   border-box "
                  : isAlreadyUser
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg mb-4 p-[1rem]   border-box "
                  : "outline-0 h-10 w-full border-2 border-slate-200  rounded-lg mb-4 p-[1rem]   border-box "
              }
              type="tel"
              minLength={10}
              maxLength={10}
              value={regMobileNumber}
              onChange={handleRegMobileNumber}
              placeholder="Enter Mobile Number"
            />
          </div>

          <div className="flex flex-col w-3/5 ">
            <label
              htmlFor=""
              className="block leading-6 text-left font-medium  "
            >
              Create Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg  p-[1rem] border-2 border-red-500  border-box "
                  : signUpFailed
                  ? "outline-0 h-10 w-full rounded-lg  p-[1rem] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg  p-[1rem] border-2 border-slate-200  border-box "
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
                className="relative sm:ml-[20vw] md:ml-[21vw] lg:ml-[17vw] xl:ml-[16.5vw] bottom-[1.7rem] text-zinc-300"
                onClick={() => handleShowPassword("create")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative sm:ml-[20vw] md:ml-[21vw] lg:ml-[17vw] xl:ml-[16.5vw] bottom-[1.7rem] text-zinc-300"
                onClick={() => handleShowPassword("create")}
              />
            )}
          </div>
          <div className="flex flex-col w-3/5 ">
            <label
              htmlFor=""
              className="block leading-6 text-left font-medium  "
            >
              Confirm Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-red-500  border-box "
                  : signUpFailed
                  ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-slate-200  border-box "
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
                className="relative sm:ml-[20vw] md:ml-[21vw] lg:ml-[17vw] xl:ml-[16.5vw] bottom-[3rem] text-zinc-300"
                onClick={() => handleShowPassword("confirm")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative sm:ml-[20vw] md:ml-[21vw] lg:ml-[17vw] xl:ml-[16.5vw] bottom-[3rem] text-zinc-300"
                onClick={() => handleShowPassword("confirm")}
              />
            )}
          </div>
          {allInputAlert ? (
            <div className="w-3/5">
              {" "}
              <p className="text-xs text-red-500">*fill all inputs</p>
            </div>
          ) : null}
          {signUpFailed ? (
            <p className="w-3/5 text-xs text-red-500">
              *Password do not match.
            </p>
          ) : null}
          {isAlreadyUser ? (
            <p className="w-3/5 text-red-500 text-xs">
              *Mobile number already registered!
            </p>
          ) : null}

          {passwordError ? (
            <>
              <p className="w-3/5 text-red-500 text-xs">
                *password must have 1 upper case
              </p>
              <p className="w-3/5 text-red-500 text-xs">
                *password must have 1 lower case
              </p>
              <p className="w-3/5 text-red-500 text-xs">
                *password must have 1 special character
              </p>
              <p className="w-3/5 text-red-500 text-xs">
                *password must have 8 letters
              </p>
            </>
          ) : null}

          <button
            className="w-1/3 bg-gray-800 hover:bg-gray-600 border-0  text-white text-center p-[.5rem] font-bold font-sans h-auto  mt-[1rem] rounded-md "
            onClick={
              connectionMode === "socket" ? signUpUserUsingSocket : signupUser
            }
          >
            Sign up
          </button>

          <p className="font-light sm:text-[1vw] md:text-xs  mt-[2rem]">
            Already have an account?{" "}
            <strong
              className="font-bold text-gray-800 cursor-pointer"
              onClick={login}
            >
              Login
            </strong>
          </p>
        </form>
      </>
      {/* </div> */}
    </>
  );
}

export default SignUp;
