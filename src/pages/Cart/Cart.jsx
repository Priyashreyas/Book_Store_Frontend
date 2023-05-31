import React from 'react';
import './Cart.scss'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {useSelector} from "react-redux"
import { removeItem, resetCart } from "../../redux/cartReducer";
import { Provider } from "react-redux";
import {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";
import {useDispatch} from "react-redux";

//const CART_URL = process.env.REACT_APP_CART_URL;
const CART_URL = '/api/v1/cart';

const Cart = (props) => {
  const Book = useSelector(state=>state.cart.Book);
  const dispatch = useDispatch();

  const totalprice = () => {
    let total = 0;
    Book.forEach((book) => {
      total += book.quantity * book.price;
    });
    return total.toFixed(2);
  };
  //console.log('CART_URL '+CART_URL);
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  // TODO: Remove usage of bookData

  const [bookTitle, setBookTitle] = useState(() => '');
  const [authorFirstName, setAuthorFirstName] = useState(() => '');
  //const [authorLastName, setAuthorLastName] = useState(() => '');
  const [bookGenre, setBookGenre] = useState(() => '');
  const [quantity, setquantity] = useState(() => '');
  const [trackingStatus, settrackingStatus] = useState(() => '');
  const [bookDescription, setBookDescription] = useState(() => '');
  const [currency, setCurrency] = useState(() => '');
  const [price, setPrice] = useState(() => 0);
  const [stars, setStars] = useState(() => 0);
  const [isNew, setIsNew] = useState(() => false);
  const [images, setImages] = useState(() => '');
  const [bookId, setBookId] = useState(() => 0);
  const [bookFormat, setBookFormat] = useState(() => '');

  async function saveOrder() {
    let at = auth?.accessToken;

    if (auth?.accessToken == null) {
      at = await refresh();
    }
    console.log('CART_URL '+CART_URL);
    console.log(`Role = ${auth?.role}`)

    axios.post(CART_URL,
      JSON.stringify({
        book: {
          title: bookTitle,
          author: authorFirstName,
          genre: bookGenre,
          description: bookDescription,
          currency,
          price,
          quantity,
          trackingStatus,
          stars,
          isNew,
          //imgs: [images],
          id: bookId,
          format: bookFormat,
        }
      }),
      {
        headers: {
          Authorization: 'Bearer ' + at,
          'Content-type': 'application/json',
        },
        withCredentials: true,
      }).then((response) => {
      console.log(response.data.book);
      console.error('success in cart');
      navigate(`/book`);
    }, (error) => {

      console.error('Error in Cart= ' + error);
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
            console.log('Login failed.');
            break;
        }
        if (error?.response?.status === 400 || error?.response?.status === 401 || error?.response?.status === 403) {
          console.log('Could not update the order data.')
        }
      }
    });
  };


  return (  
    <div className="cart">
      <h1>Books in your cart</h1>
      {Book?.map(book=>(
        <div className="item" key={book.id}>
          <img src={book.imgs} alt="hi"/>
          <div className="details">
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <div className="price">
              {book.quantity} x {book.price}
            </div>
          </div>
          <div className="delete" onClick={()=>dispatch(removeItem(book.id))}>
            <DeleteOutlinedIcon/>
          </div>
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>{totalprice()}</span>
      </div>
      <button onClick={event => saveOrder()} to="/cart"> 
       PROCEED TO CHECKOUT
       </button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  ) 
}
export default Cart;

