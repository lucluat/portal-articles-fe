/** @format */

import { connectIdentity } from "../AppConfig";
import { deleteToken, getToken, isTokenValid } from "../helper/userToken";

// import {
//     FunctionComponent,
//     PropsWithChildren,
//     ReactElement,
//     useEffect,
//     useState,
//   } from "react";
  
  // import { Navigate } from "react-router-dom";
//   import { AccountAPI } from "../apis/account.api";
//   import { useAppDispatch, useAppSelector } from "../app/hooks";
//   import {
//     selectUser,
//     UpdateUser,
//     UserLogout,
//   } from "../app/reducers/Auth/Auth.reducer";
//   import GlobalLoading from "../components/global-loading/GlobalLoading";
  
//   import { getToken } from "../helper/userToken";
  
const AuthGuard = ({ children, levels }) => {

  const userToken = getToken();
  if (!isTokenValid(userToken)) {
    deleteToken();
    window.location.href = connectIdentity;
  } 

  return children;
  };
  
  export default AuthGuard;
  