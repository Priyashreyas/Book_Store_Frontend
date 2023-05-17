import React from 'react';
import useAuth from "./UseAuth";
import axios from "../api/Axios";
import {useNavigate} from "react-router-dom";

const useRefreshToken = (props) => {
  const {setAuth} = useAuth();
  const navigate = useNavigate();

  return async () => {
    const response = await axios.get('/api/v1/auth/refresh', {
      withCredentials: true
    }).catch(function (e) {
      console.log(`Error: ${e}`);
      navigate('/login');
    });

    window.sessionStorage.setItem('role', response?.data?.role);

    setAuth(prev => {
      // console.log(`previous auth = ${JSON.stringify(prev)}`);
      // console.log(`new token = ${response?.data?.accessToken}`);

      return {...prev, accessToken: response?.data?.accessToken}
    })

    return response?.data?.accessToken;
  };
};

export default useRefreshToken;
