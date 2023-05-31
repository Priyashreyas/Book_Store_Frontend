import React, {useContext, useEffect, useState} from 'react';
import './Book.scss'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import {useNavigate, useParams} from "react-router-dom";
//import { Provider } from "react-redux";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";
import { Rating } from '@mui/material';
import { useDispatch} from "react-redux"; 
import { addToCart } from '../../redux/cartReducer';

const BOOKS_URL = process.env.REACT_APP_BOOKS_URL;


const Book = (props) => {
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();

   const dispatch = useDispatch();
  console.log(`auth1 = ${auth?.accessToken}`);

  const {id} = useParams();
  const [selectedImg, setSelectedImg] = useState(() => 0);
  const [quantity, setQuantity] = useState(() => 1);
  const [bookData, setBookData] = useState(() => null);
 
  useEffect(() => {
    let isMounted = true;
    console.log("Effect called!!");
    console.log(bookData);
    if (bookData) {
      return;
    }

    const abortController = new AbortController();

    async function getBookData() {

      let at = auth?.accessToken;

      if (auth?.accessToken == null) {
        at = await refresh();
      }
      // console.log(`auth2 = ${auth?.accessToken}`);
      // console.log(`at = ${at}`);
      console.log(`role = ${auth?.role}, ls = ${window.sessionStorage.getItem('role')}`);
      console.log('BOOKS_URL '+BOOKS_URL);

      axios.get(`${BOOKS_URL}/${id}`, {
        headers: {
          Authorization: 'Bearer ' + at
        },
        signal: abortController.signal
      }).then((response) => {
        console.log(response.data.book);
        isMounted && setBookData(prevData => response.data.book);
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
              console.log('Failed to get the book data.');
              break;
          }
          if (error?.response?.status === 400 || error?.response?.status === 401 || error?.response?.status === 403) {
            navigate('/login');
          }
        }
      });
    }


    getBookData();

    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

  if (bookData) {
    return (
      <div className="book">
        <div className="left">
          <div className="mainImg">
            <img src={bookData.imgs[selectedImg]} alt="Image 1"/>
          </div>
        </div>
        <div className="right">
          {auth?.role === "ROLE_ADMIN" &&
            <button className="editBook" onClick={event => navigate(`/book/${id}/edit`)}>
              EDIT BOOK
            </button>
          }
          <h1>{bookData.title}</h1>
          <span className="price">{bookData.currency}{bookData.price}</span>
          <Rating
            name="ratingComp"
            value={bookData.stars}
            precision={0.5}
            readOnly
            onChange={(event, newValue) => {
            //setValue(newValue);
            }}
          />
          <div className="info">
            <span>Author: {bookData.author.firstName} {bookData.author.lastName}</span>
            <span>Genre: {bookData.genre}</span>
          </div>
         {/*  <p>{bookData.description}</p>  */}
          <div className="quantity">
            <button onClick={event => setQuantity(prevState => prevState === 1 ? 1 : prevState - 1)}>-</button>
            {quantity}
            <button onClick={event => setQuantity(prevState => prevState + 1)}>+</button>
          </div>
          
          <button className="add" onClick={()=>
          dispatch(
            addToCart({
            id:bookData.id,
            title:bookData.title,
            desc:bookData.desc,
            price:bookData.price,
            imgs:bookData.imgs[0],
            quantity,

          }))}>
           {/* ////  */}
            <AddShoppingCartOutlinedIcon/> ADD TO CART 
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div className={"loading"}>
        <img className="loadingImage" src="/img/loading-waiting.gif" alt="Book data is loading..."/>
      </div>
    )
  }
};

export default Book;
