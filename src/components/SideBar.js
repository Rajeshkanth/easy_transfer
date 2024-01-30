import React, { memo, useContext } from "react";
import { store } from "../App";

import { RiMenuFoldFill } from "react-icons/ri";

function SideBar(props) {
  const { nav, onClickHandler } = props;

  const { isProfileClicked, setIsProfileClicked } = useContext(store);

  const handleClick = (item) => {
    if (onClickHandler) {
      onClickHandler(item);
    }
  };
  const closeProfile = () => {
    setIsProfileClicked(false);
  };
  return (
    <>
      <div className="w-1/2 md:w-1/3 bg-gray-800 backdrop-blur-xl h-screen z-10 text-white font-sans fixed top-0  text-black">
        <div className=" pt-2 pb-8 border-box h-[85vh] font-sans">
          <div className="flex justify-between items-center border-b-2 border-gray-600  text-white box-border pb-[.8rem] cursor-pointer ">
            <h1 className="ml-[2rem] text-xl font-bold ">Menu</h1>
            <p className=" mr-[1rem]  " onClick={closeProfile}>
              <RiMenuFoldFill />
            </p>
          </div>
          <div className="space-y-2 flex text-white w-[80%] justify-center pl-6 flex-col items-left  pt-5 border-box text-lg    cursor-pointer ">
            {nav.map((item, index) => (
              <h1
                key={index}
                className="hover:font-bold hover:border-2   rounded px-4 box-border rounded- px-4 box-border py-1"
                onClick={() => handleClick(item)}
              >
                {item}
              </h1>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(SideBar);
