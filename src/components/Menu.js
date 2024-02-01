import React, { useContext, useEffect } from "react";
import { store } from "../App";

function Menu(props) {
  const { nav, onClickHandler } = props;

  const { windowWidth, setWindowWidth, setIsProfileClicked, isProfileClicked } =
    useContext(store);

  const handleClick = (item) => {
    if (onClickHandler) {
      onClickHandler(item);
    }
  };
  const profile = () => {
    setIsProfileClicked(true);
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
    <div className="h-[10%] w-screen   flex items-center justify-between sm:justify-evenly font-sans ">
      <div className=" items-center ">
        <h1 className=" items-center font-bold ml-[2rem] text-center  sm:ml-[0] xl:ml-[0rem] text-2xl lg:text-4xl  box-border w-full  ">
          Easy Transfer
        </h1>
      </div>
      {windowWidth > 640 ? (
        <ul className="flex w-auto  md:ml-[1rem] lg:ml-[6rem]  xl:ml-[8rem] text-center   items-center md:space-x-0 xl:space-x-4 lg:space-x-2  font-bold text-md lg:text-lg">
          {nav.map((item, index) => (
            <li
              key={index}
              className="border-gray-800   hover:text-gray-300  active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
              onClick={() => handleClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : isProfileClicked ? null : (
        <h1
          className="fixed left-[80vw]  font-bold text-lg items-center text-center"
          onClick={() => setIsProfileClicked(true)}
        >
          Menu
        </h1>
      )}
    </div>
  );
}

export default Menu;
