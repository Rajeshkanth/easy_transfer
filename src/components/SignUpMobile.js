import React, { useContext, useEffect, useState } from "react";
import { store } from "../App";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

function SignUpMobile() {
  const [allInputAlert, setAllInputAlert] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    socket,
    setIsLogin,
    connectionMode,
  } = useContext(store);

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
      <h1 className="text-3xl font-extrabold text-center m-0 font-['Open-Sans']">
        User Register
      </h1>
      <form className="flex flex-col items-center  m-auto h-auto w-[98%] lg:w-[90%]  mt-[2rem]">
        <div className="flex flex-col w-3/5">
          <label htmlFor="" className="font-medium font-['Open-Sans']">
            Mobile Number
          </label>
          <input
            className={
              regMobileNumber.length < 10
                ? "outline-0 h-10 w-full border-2 border-red-500 rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100"
                : isAlreadyUser
                ? "outline-0 h-10 w-full border-2 border-red-500 rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100"
                : "outline-0 h-10 w-full border-2 border-slate-200 rounded-lg mb-3 p-[1rem] font-['Open-Sans']  border-box bg-zinc-100"
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
            className="block leading-6 text-left font-medium font-['Open-Sans'] "
          >
            Create Password
          </label>
          <input
            className={
              signUpFailed
                ? "outline-0 h-10 w-full rounded-lg mb-0 p-[1rem] border-2 border-red-500 font-['Open-Sans'] border-box bg-zinc-100"
                : "outline-0 h-10 w-full rounded-lg mb-0 p-[1rem] border-2 border-slate-200 font-['Open-Sans'] border-box bg-zinc-100"
            }
            type={showCreatePassword ? "text" : "password"}
            min={6}
            max={10}
            value={createPassword}
            onChange={handleCreatePassword}
            placeholder="Enter Your Password"
          />
          {showCreatePassword ? (
            <FaRegEye
              className="relative ml-[40vw] bottom-[1.8rem]"
              onClick={() => handleShowPassword("create")}
            />
          ) : (
            <FaRegEyeSlash
              className="relative ml-[40vw] bottom-[1.8rem]"
              onClick={() => handleShowPassword("create")}
            />
          )}
        </div>
        <div className="flex flex-col w-3/5 ">
          <label
            htmlFor=""
            className="block leading-6 text-left font-medium font-['Open-Sans'] "
          >
            Confirm Password
          </label>
          <input
            className={
              signUpFailed
                ? "outline-0 h-10 w-full rounded-lg mb-2 p-[1rem] border-2 border-red-500 font-['Open-Sans'] border-box bg-zinc-100"
                : "outline-0 h-10 w-full rounded-lg mb-2 p-[1rem] border-2 border-slate-200 font-['Open-Sans'] border-box bg-zinc-100"
            }
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPassword}
            placeholder="Enter Your Password"
          />
          {showConfirmPassword ? (
            <FaRegEye
              className="relative ml-[40vw] bottom-[2.3rem]"
              onClick={() => handleShowPassword("confirm")}
            />
          ) : (
            <FaRegEyeSlash
              className="relative ml-[40vw] bottom-[2.3rem]"
              onClick={() => handleShowPassword("confirm")}
            />
          )}
        </div>
        {allInputAlert ? (
          <div className="w-3/5">
            {" "}
            <p className="text-sm text-red-500">*Fill all the inputs.</p>
          </div>
        ) : null}
        {signUpFailed ? (
          <p className="w-3/5 text-xs text-red-500">*Password do not match.</p>
        ) : null}
        {isAlreadyUser ? (
          <p className="w-3/5 text-red-500 text-xs">
            *Mobile number already registered!
          </p>
        ) : null}

        <button
          className="w-1/3 bg-gradient-to-b border-0 from-black to-green-700 text-white text-center p-[.5rem] font-bold font-['Open_Sans'] h-auto border-2 mt-[1rem] rounded-full "
          onClick={
            connectionMode === "socket" ? signUpUserUsingSocket : signupUser
          }
        >
          Sign up
        </button>

        <p className="font-light text-xs  mt-[2rem]">
          Already have an account?{" "}
          <strong className="font-bold text-green-700" onClick={login}>
            Login
          </strong>
        </p>
      </form>
    </>
  );
}

export default SignUpMobile;
