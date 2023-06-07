import React, {useContext, useEffect, useState} from 'react';
import './Order.scss'
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";
import { Rating } from '@mui/material';

const ORDER_URL = process.env.REACT_APP_ORDER_URL;

const Order = (props) => {
  const {auth} = useContext(AuthContext);
  const refresh = useRefreshToken();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (orderData) {
      return;
    }

    const abortController = new AbortController();

    async function getOrderData() {

      let at = auth?.accessToken; 

      if (at === undefined || at === null) {
        at = await refresh();
      }

      await axios.get(`${ORDER_URL}?count=10`, {
        headers: {
          Authorization: 'Bearer ' + at,
        }
      }).then((response) => {
        isMounted && setOrderData(prevData => response.data);
      }, (error) => {
        console.error('Error = ' + error);
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
          <h2>Your Previous Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Book Title</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Ratings</th>
                <th>Review</th>
              </tr>
            </thead>
          <tbody>
          {orderData.books.map(book => (
            <tr>
              <td>{book.id}</td>
              <td>{book.title} </td>
              <td>{book.genre}</td>
              <td>{book.currency} {book.price}</td>
              <td>{book.quantity}</td>
              <td>{book.trackingStatus}</td>
              <td>
                <Rating
                name="ratingComp"
                value={book.stars}
                precision={0.5}
                readOnly
                onChange={(event, newValue) => {
                //setValue(newValue);
                }}
                />
              </td>
              <td>{book.review}</td>
            </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    )
  } else {
    return (
      <div className="order">
        <div className="left">
          <h2>You have not placed any orders yet.</h2>
        </div>
      </div>
    )
  }
};

export default Order;
