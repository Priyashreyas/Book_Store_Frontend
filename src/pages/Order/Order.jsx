import React, {useContext, useEffect, useState} from 'react';
import './Order.scss'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";
import { Rating } from '@mui/material';
import { useDispatch} from "react-redux"; 
const ORDERS_URL = '/api/v1/order';
const AUTH_URL = process.env.REACT_APP_AUTHENTICATE_URL;

const Order = (props) => {
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();

  const dispatch = useDispatch();
  console.log(`auth1 = ${auth?.accessToken}`);

  const [selectedImg, setSelectedImg] = useState(() => 0);
  const [quantity, setQuantity] = useState(() => 1);
  const [orderData, setOrderData] = useState(() => null);

  useEffect(() => {
    let isMounted = true;
    console.log("Effect called!!");
    console.log(orderData);
    if (orderData) {
      return;
    }

    const abortController = new AbortController();

    async function getOrderData() {

      let at = auth?.accessToken;

      if (auth?.accessToken == null) {
        at = await refresh();
      }
      //console.log(`auth2 = ${auth?.accessToken}`);
      //console.log(`at = ${at}`);
      console.log(`role = ${auth?.role}, ls = ${window.sessionStorage.getItem('role')}`);
      console.log('Orders URL '+ORDERS_URL);
      console.log(`${ORDERS_URL}?count=10`);

      axios.get(`${ORDERS_URL}`, {
        headers: {
          Authorization: 'Bearer ' + at
        },
        signal: abortController.signal
      }).then((response) => {
        console.log(response.data.order);
        isMounted && setOrderData(prevData => response.data.order);
      }, (error) => {
        console.error('Error = ' + error);
        console.error('Error response = ' + error?.response);
        console.error('Error status = ' + error?.response?.status);

        if (error?.response) {
          switch (error?.response?.status) {
            case 400:
              console.log('Missing username or password.');
              break;
            case 401:
              console.log('Unauthorized request.');
              break;
            case 403:
              console.log('Invalid username or password.');
              break;
            case 415:
              console.log('Unsupported request payload format.');
              break;
            default:
              console.log('Failed to get the order data.');
              break;
          }
           if (error?.response?.status === 400 || error?.response?.status === 401 || error?.response?.status === 403) {
            console.log('Could not retrieve the order data.')
          }
        }
      });
    }

    getOrderData();

    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

  if (orderData) {
    return (
      <div className="order">
        <div className="left">
          <h1>{orderData.title}</h1>
          <span className="price">{orderData.currency}{orderData.price}</span>
          <Rating
            name="ratingComp"
            value={orderData.stars}
            precision={0.5}
            readOnly
            onChange={(event, newValue) => {
            //setValue(newValue);
            }}
          />
          <div className="info">
            <span>Author: {orderData.author.firstName} {orderData.author.lastName}</span>
            <span>Genre: {orderData.genre}</span>
          </div>
         {/*  <p>{bookData.description}</p>  */}
        </div>
      </div>
    )
  } else {
    return (
      <div className={"loading"}>
        <img className="loadingImage" src="/img/loading-waiting.gif" alt="Order data is loading..."/>
      </div>
    )
  }

};

export default Order;
