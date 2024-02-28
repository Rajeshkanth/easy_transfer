import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import logo from "./images/Greenwhitelogo2.png";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useNavigate } from "react-router";

function Menu(props) {
  const { nav, onClickHandler } = props;

  const { windowWidth, setWindowWidth, setIsProfileClicked, isProfileClicked } =
    useContext(store);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (onClickHandler) {
      onClickHandler(item);
    }
  };

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
    <div className="h-[10%] fixed md:relative w-screen z-[20] bg-gray-800 pb-2 sm:pb-0 pt-2 md:pt-0 flex items-center justify-between sm:justify-between sm:pr-[4vw] md:pr-[2vw] md:justify-around font-sans ">
      <div className=" items-center ml-[1vw] pt-[.3rem] pb-[.2rem]">
        <img
          src={logo}
          className=" items-center object-contain  w-[40vw] md:w-[28vw] lg:w-[24vw] font-bold ml-[2rem] text-center  sm:ml-[0rem] xl:ml-[0rem] text-2xl lg:text-4xl  box-border   "
          onClick={() => navigate("/transferPage")}
        ></img>
      </div>
      {windowWidth > 640 ? (
        <ul className="flex w-auto  md:ml-[1rem] lg:ml-[6rem]  xl:ml-[14rem] xl:pl-[4vw] text-center   items-center md:space-x-0 xl:space-x-4 lg:space-x-2  font-bold text-md md:text-sm lg:text-lg">
          {isProfileClicked
            ? null
            : nav.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.icon
                      ? "border-gray-800 text-2xl hover:text-gray-300  active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
                      : "border-gray-800   hover:text-gray-300  active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
                  }
                  onClick={
                    item.id
                      ? () => handleClick(item.id)
                      : () => handleClick(item)
                  }
                >
                  {item.icon ? item.icon : item}
                </li>
              ))}
        </ul>
      ) : isProfileClicked ? null : (
        <h1
          className="fixed left-[80vw]  font-bold text-2xl items-center text-center"
          onClick={() => setIsProfileClicked(true)}
        >
          <RiMenuUnfoldFill />
        </h1>
      )}
    </div>
  );
}

export default memo(Menu);
