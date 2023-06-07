import React from 'react';
import './Cart.scss'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {useSelector} from "react-redux"
import { removeItem, resetCart, addToCart } from "../../redux/cartReducer";
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
    
    let addToCartValus = dispatch(addToCart);
    console.log('dispatch(addToCart'+JSON.stringify(addToCartValus));
    axios.post(CART_URL,
      JSON.stringify({
        order: {
          title: 'How to Draw Anything',
          id: 9780716022237,
          review: 'Good for beginners',
          //author: 'Mark Linley',
          genre: 'Art-Photography',
          description: 'Fuga feugiat aliquid dolore rem curae eu tempus maecenas porttitor pede mauris diamlorem integer tempus, iusto, mauris, aliquam quos nibh! Sequi doloremque, accusamus! Eleifend? Eos exercitation faucibus proin labore do volutpat nam? Illum, litora modi augue? Aliquid impedit? Perferendis iste aliquet hac sunt at. Consectetuer. Nemo sunt perferendis, voluptates mollis.',
          currency: '$',
          price: 5.26,
          quantity: 2,
          trackingStatus : 'Shipped',
          stars : 3.5,
          imgs: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9780/7160/9780716022237.jpg',
          format: 'Paperback', 
        },
        
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
      navigate(`/`);
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
          <img src={book.imgs} alt="hi" id="images" />
          <div className="details">
            <h1>{book.title} </h1>
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

