import React, { memo, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LiaPhoneSolid } from "react-icons/lia";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { store } from "../App";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [allInputAlert, setAllInputAlert] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [loginInputAlert, setLoginInputAlert] = useState(false);
  const [mobileNumberLength, setMobileNumberLength] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    password,
    setPassword,
    setMobileNumber,
    mobileNumber,
    createPassword,
    confirmPassword,
    handleConfirmPassword,
    handleCreatePassword,
    handleRegMobileNumber,
    regMobileNumber,
    setRegMobileNumber,
    setCreatePassword,
    setConfirmPassword,
    setRegisteredUsers,
    registeredUsers,
    username,
    handleUserName,
    userName,
    setUserName,
    loggedUser,
    setLoggedUser,
    key,
    setKey,
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
    // const passwordPattern =
    //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~=\-{}[\]:;<>?,./]).{8,}$/;
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
    }
  };

  const clearInputs = () => {
    setRegMobileNumber("");
    setCreatePassword("");
    setConfirmPassword("");
  };

  const signupUser = (e) => {
    e.preventDefault();
    if (regMobileNumber && createPassword && confirmPassword) {
      let userExists = false;

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);

        if (key === regMobileNumber) {
          userExists = true;
          break;
        }
      }

      if (userExists) {
        setIsAlreadyUser(true);
      } else if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else if (regMobileNumber.length >= 10) {
        const newUser = {
          Mobile: regMobileNumber,
          Password: confirmPassword,
        };
        setRegisteredUsers((prev) => [...prev, newUser]);
        setIsLogin(true);
        setAllInputAlert(false);
        setRegMobileNumber("");
        setCreatePassword("");
        setConfirmPassword("");
        setSignUpFailed(false);
        setIsAlreadyUser(false);
        sessionStorage.setItem(newUser.Mobile, JSON.stringify(newUser));
        const response = axios.post("http://localhost:8080/toDB", {
          data: newUser,
        });
        if (userName === "") {
          setLoggedUser(newUser.Mobile);
        } else {
          setLoggedUser(userName);
        }
      }
    } else {
      setAllInputAlert(true);
    }
  };

  const loginToDashboard = (e) => {
    e.preventDefault();
    if (mobileNumber && password) {
      const storedUser = sessionStorage.getItem(mobileNumber);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.Password === password) {
          setLoggedUser(userData.Mobile);
          if (mobileNumber.length >= 10) {
            // setKey(mobileNumber);
            document.cookie = mobileNumber;

            setKey(document.cookie);

            navigate("/transferPage");
            setMobileNumberLength(false);
          } else {
            setMobileNumberLength(true);
          }
        } else {
          setLoginFailed(true);
        }
      } else {
        setLoginFailed(true);
      }
    } else {
      setLoginInputAlert(true);
    }
    setMobileNumber("");
    setPassword("");
  };

  useEffect(() => {
    console.log(registeredUsers);
  }, [registeredUsers]);

  return (
    <div className="h-screen fixed w-screen bg-indigo-950  ">
      <div className="h-[10%]    align-center pt-[1rem] pl-[4rem] ">
        <h1 className="font-extrabold text-4xl italic text-white">
          Easy Transfer
        </h1>
      </div>

      <div className="h-screen w-7/5  flex p-10 border-box">
        <div
          className={
            isLogin
              ? "w-1/2 h-[75vh] bg-white lg:h-[80vh] rounded-l-xl ml-[4rem] "
              : "w-3/5 h-[75vh] lg:h-[80vh]  bg-gradient-to-b from-green-300 to-green-100 rounded-l-xl ml-[4rem] pt-[4rem] border-box"
          }
        >
          {isLogin ? (
            <>
              {" "}
              <h1 className="text-center text-4xl font-bold font-['Open_Sans'] mt-[18%]  ">
                Welcome Back
              </h1>
              <form className="flex flex-col items-center  m-auto h-auto w-3/4  mt-[3rem]">
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
                      className="relative left-[14rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("login")}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="relative left-[14rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("login")}
                    />
                  )}
                </div>

                {loginInputAlert ? (
                  <p className="w-3/5 text-red-500 text-xs">
                    *Fill all the inputs
                  </p>
                ) : null}
                {loginFailed ? (
                  <div className="w-3/5 mb-2">
                    {" "}
                    <p className="text-xs  text-red-500">
                      *wrong username/password
                    </p>
                  </div>
                ) : null}

                {}

                <button
                  className="w-1/3 bg-gradient-to-b border-0  outline-0 from-black to-green-700 text-white text-center p-[.5rem] font-bold font-['Open_Sans'] h-auto border-2 mt-[1rem] rounded-full "
                  onClick={loginToDashboard}
                >
                  Log in
                </button>

                <p className="text-xs mt-[4rem] ">Forgot Password?</p>
                <p className="font-light text-xs  mt-[.7rem]">
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
          ) : (
            <>
              <img
                className=" transform -scale-x-100"
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-concept-3428212-2902554.png"
              />
            </>
          )}
        </div>
        <div
          className={
            isLogin
              ? "h-[75vh] lg:h-[80vh] w-3/5 bg-gradient-to-b from-black to-green-700 rounded-r-xl  text-white flex flex-col justify-center items-center mr-[4rem]"
              : " h-[75vh] w-1/2 bg-white lg:h-[80vh] rounded-r-xl mr-[4rem] "
          }
        >
          {isLogin ? (
            <>
              <h1 className="text-6xl font-extrabold italic">Easy Transfer</h1>
              <br />
              <p>Allows seamless transaction at ZERO transaction fee.</p>
              <br />
              <p> Login to your account to make payment.</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-center mt-[4rem] font-['Open-Sans']">
                User Register
              </h1>
              <form className="flex flex-col items-center  m-auto h-auto w-[98%] lg:w-[90%]  mt-[3rem]">
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
                        ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-red-500 font-['Open-Sans'] border-box bg-zinc-100"
                        : "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-slate-200 font-['Open-Sans'] border-box bg-zinc-100"
                    }
                    type={showCreatePassword ? "text" : "password"}
                    min={6}
                    max={10}
                    value={createPassword}
                    onChange={handleCreatePassword}
                    placeholder="Enter Your Password"
                  />
                  {/* {showCreatePassword ? (
                    <FaRegEye
                      className="relative lg:left-[15rem] xl:left-[10rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("create")}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="relative lg:left-[25rem] xl:left-[10rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("create")}
                    />
                  )} */}
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
                        ? "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-red-500 font-['Open-Sans'] border-box bg-zinc-100"
                        : "outline-0 h-10 w-full rounded-lg mb-5 p-[1rem] border-2 border-slate-200 font-['Open-Sans'] border-box bg-zinc-100"
                    }
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    placeholder="Enter Your Password"
                  />
                  {/* {showConfirmPassword ? (
                    <FaRegEye
                      className="relative left-[14rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("confirm")}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="relative left-[14rem] bottom-[3rem]"
                      onClick={() => handleShowPassword("confirm")}
                    />
                  )} */}
                </div>
                {allInputAlert ? (
                  <div className="w-3/5">
                    {" "}
                    <p className="text-sm text-red-500">
                      *Fill all the inputs.
                    </p>
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

                <button
                  className="w-1/3 bg-gradient-to-b border-0 from-black to-green-700 text-white text-center p-[.5rem] font-bold font-['Open_Sans'] h-auto border-2 mt-[1rem] rounded-full "
                  onClick={signupUser}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(HomePage);
