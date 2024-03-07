import React, { memo, useContext, useEffect } from "react";
import { store } from "../App";
import logo from "../assets/images/green-white-logo.png";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useNavigate } from "react-router";

function Menu(props) {
  const { nav, onClickHandler } = props;
  const { windowWidth, setWindowWidth, setIsProfileClicked, isProfileClicked } =
    useContext(store);
  const navigate = useNavigate();

  const home = () => {
    navigate("/transferPage");
  };

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
    <div className="h-18 fixed md:relative w-screen z-20 bg-gray-800 pb-2 sm:pb-0 pt-2 md:pt-0 flex items-center justify-between sm:pr-8 md:justify-around font-poppins">
      <div className="items-center ml-2 pt-1 pb-1">
        <img
          src={logo}
          className="items-center object-contain max-w-56 md:max-w-64 font-bold ml-4 text-center sm:ml-0 text-2xl lg:text-4xl box-border"
          onClick={() => home()}
        ></img>
      </div>
      {windowWidth > 640 ? (
        <ul className="flex w-auto md:ml-4 lg:ml-24 xl:ml-64 xl:pl-16 text-center items-center md:space-x-0 xl:space-x-4 lg:space-x-2 font-bold text-md md:text-sm lg:text-lg">
          {isProfileClicked
            ? null
            : nav.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.icon
                      ? "border-gray-800 text-2xl hover:text-gray-300 active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
                      : "border-gray-800 hover:text-gray-300 active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
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
          className="fixed right-12 font-bold text-2xl"
          onClick={() => setIsProfileClicked(true)}
        >
          <RiMenuUnfoldFill />
        </h1>
      )}
    </div>
  );
}

export default memo(Menu);
