import React, { useContext } from "react";
import { store } from "../App";

function Menu(props) {
  const { nav, onClickHandler } = props;

  const { windowWidth, setIsProfileClicked, isProfileClicked } =
    useContext(store);

  const handleClick = (item) => {
    if (onClickHandler) {
      onClickHandler(item);
    }
  };
  const profile = () => {
    setIsProfileClicked(true);
  };
  return (
    <div className="h-[10%] w-screen   flex items-center justify-between sm:justify-evenly font-sans ">
      <div className=" items-center ">
        <h1 className=" items-center font-bold ml-[4rem] sm:ml-[0]  text-4xl  lg:ml-[3rem] box-border w-full  ">
          Easy Transfer
        </h1>
      </div>
      {windowWidth > 640 ? (
        <ul className="flex w-auto md:ml-[3rem] lg:ml-[0] items-center items-center md:space-x-2 xl:space-x-6 lg:space-x-2 font-bold text-lg">
          {nav.map((item, index) => (
            <li
              key={index}
              className="border-gray-800 border-2 rounded-full border-gray-800 hover:text-gray-300 hover:border-2 active:border-gray-300 hover:border-white px-2 box-border hover:rounded-full active:font-bold hover:cursor-pointer"
              onClick={() => handleClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : isProfileClicked ? null : (
        <h1
          className="fixed left-[80vw] font-bold text-lg items-center text-center"
          onClick={profile}
        >
          Menu
        </h1>
      )}
    </div>
  );
}

export default Menu;
