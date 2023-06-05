import React, {useContext, useState} from 'react';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './Navbar.scss'
import Cart from "../../pages/Cart/Cart";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import {useCookies} from "react-cookie";
import SearchIcon from "@material-ui/icons/Search";
import {useSelector} from "react-redux";
import CloseIcon from "@material-ui/icons/Close";

const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL;

const Navbar = ({ placeholder, data }) => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const {setAuth} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const nonLoggedInPages = new Set(['/login', '/register']);
  const Book = useSelector(state=>state.cart.Book);

  //added ankita
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });
    const newFilterName = data.filter((value) => {
      return value.author.firstName.toLowerCase().includes(searchWord.toLowerCase());
    });
   

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      const fullData =  newFilter.concat(newFilterName)
      //const fullDataWithGenre = fullData.concat(newFilterGenre);
      setFilteredData(fullData);
      //setFilteredData(newFilterName);
      
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };


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
      removeCookie("role");
      removeCookie("accessToken");
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
              <img className="booksImage" src="/img/bookLogo1.png" alt="Book Store"/>
            </Link>
          </div>
         {/* <div className="item">
            <Link className="link" to="/category/1">Featured</Link>
          </div>
          <div className="item">
            <Link className="link" to="/category/2">Trending</Link>
          </div>
  */}
   <div className="search">
        <div className="searchInputs">
            <input
              type="text"
              placeholder= "Search.."
              value={wordEntered}
              onChange={handleFilter}
            /> 
            <div className="searchIco">
             {filteredData.length === 0 ? (
                <SearchIcon />
              ) : (
                <CloseIcon id="clearBtn" onClick={clearInput} />
              )}
            </div>
        </div>
         
         
          {filteredData.length != 0 && (
           
            <div className="dataResult">
              {filteredData.slice(0, 8).map((value, key) => {
                return (
                 
                  <a className="dataItem" href={'http://localhost:3000/book/'+value._id} target="_blank">
                     <p>{value.title} </p>
                  
                 </a>
                );
                
              })}
            </div>
            
          )}
    </div>
        </div>
        <div className="center">
          <Link className="link" to="/">PIONEER&nbsp;BOOK&nbsp;STORE</Link>
        </div>
        <div className="right">
          {(auth?.role === "ROLE_ADMIN" || cookies.role === "ROLE_ADMIN") &&
            <div className="item">
              {/*TODO: Add a page to add new book*/}
              <Link className="link" to="/book/new">Add Book</Link>
            </div>
            
            
          }
          {auth?.role === "ROLE_ADMIN" &&
            <div className="item">
              <Link className="link" to="/delete">Delete Books</Link>
            </div>
          }
          {(auth?.role === "ROLE_ADMIN" || cookies.role === "ROLE_ADMIN") &&
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
                <span>{Book.length}</span>
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
