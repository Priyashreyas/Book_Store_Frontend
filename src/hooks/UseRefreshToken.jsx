import React from 'react';
import useAuth from "./UseAuth";
import axios from "../api/Axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

const useRefreshToken = (props) => {
  const [cookies, setCookie] = useCookies([]);
  const {setAuth} = useAuth();
  const navigate = useNavigate();

  return async () => {
    const response = await axios.get('/api/v1/auth/refresh', {
      withCredentials: true
    }).catch(function (e) {
      console.log(`Error: ${e}`);
      navigate('/login');
    });

    setAuth(prev => {
      // console.log(`previous auth = ${JSON.stringify(prev)}`);
      // console.log(`new token = ${response?.data?.accessToken}`);

      return {...prev, accessToken: response?.data?.accessToken}
    })

    setCookie("accessToken", response?.data?.accessToken, {
      path: "/"
    });

    return response?.data?.accessToken;
  };
};

export default useRefreshToken;
