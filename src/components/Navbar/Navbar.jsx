import React, {useContext, useState} from 'react';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './Navbar.scss'
import Cart from "../../pages/Cart/Cart";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";

const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL;

const Navbar = (props) => {
  const {setAuth} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const nonLoggedInPages = new Set(['/login', '/register']);

  const logout = async function () {
    console.log(auth?.accessToken);
    if (auth?.accessToken === null) {
      return;
    }

    await axios.post(LOGOUT_URL, {
      accessToken: 'Bearer ' + auth?.accessToken,
      headers: {
        Authorization: 'Bearer ' + auth?.accessToken
      },
    }, {
      withCredentials: true
    }).then((response) => {
      console.log(response.data);
      setAuth({});
      navigate('/login');
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
            console.log('Logout failed.');
            break;
        }
      }
    });
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <Link className="link" to="/">
              <img className="booksImage" src="/img/book_store_logo.png" alt="Book Store"/>
            </Link>
          </div>
          <div className="item">
            <Link className="link" to="/category/1">Featured</Link>
          </div>
          <div className="item">
            <Link className="link" to="/category/2">Trending</Link>
          </div>
        </div>
        <div className="center">
          <Link className="link" to="/">BOOK&nbsp;&nbsp;STORE</Link>
        </div>
        <div className="right">
          {auth?.role === "ROLE_ADMIN" &&
            <div className="item">
              {/*TODO: Add a page to add new book*/}
              <Link className="link" to="/book/new">Add Book</Link>
            </div>
          }
          {auth?.role === "ROLE_ADMIN" &&
            <div className="item">
              <Link className="link" to="/users">Users</Link>
            </div>
          }

          <div className="item">
            <Link className="link" to="/about">About Us</Link>
          </div>
          <div className="icons">
            {/*<div className={"search"}>*/}
            {/*  <SearchOutlinedIcon/>*/}
            {/*</div>*/}
            {/*<PersonOutlineIcon/>*/}
            <div className="cartIcon" onClick={event => setOpen(!open)}>
              <Link className="link" to="/cart">
                <ShoppingCartCheckoutIcon/>
                <span>0</span>
              </Link>
            </div>
            {!nonLoggedInPages.has(location.pathname) &&
              <div className="logoutIcon" onClick={event => logout()}>
                <LogoutOutlinedIcon/>
              </div>
            }
          </div>
        </div>
      </div>
      {
        open && <Cart/>
      }
    </div>
  )
}

export default Navbar;
