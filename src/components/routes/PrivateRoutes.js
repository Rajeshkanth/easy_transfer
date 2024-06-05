import React, { memo, useContext } from "react";
import { store } from "../../App";
import { Navigate, Outlet } from "react-router";

function PrivateRoutes() {
  const { isLoggedOut } = useContext(store);

  return <>{isLoggedOut ? <Navigate to={"/"} /> : <Outlet />}</>;
}

export default memo(PrivateRoutes);
