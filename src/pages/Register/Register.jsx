import React, {useContext, useEffect, useRef, useState} from 'react';
import './Register.scss'
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/Axios";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import {useNavigate, useNavigation} from "react-router-dom";
import {useCookies} from "react-cookie";

const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;

const Register = (props) => {
  const [cookies, setCookie] = useCookies([]);
  const {auth, setAuth} = useContext(AuthContext);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const usernameReference = useRef();
  const emailReference = useRef();
  const phoneReference = useRef();
  const firstNameReference = useRef();
  const lastNameReference = useRef();
  const errorReference = useRef();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    usernameReference.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [firstName, lastName, username, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({username, password, firstName, lastName, email, phoneNumber: phone}),
        {
          headers: {
            'Content-type': 'application/json'
          },
          withCredentials: true
        }).then((response) => {
          console.log('data = ' + response?.data);

          if (auth?.role === "ROLE_ADMIN" || cookies.role === "ROLE_ADMIN") {
            navigate(-1);
            return
          }

          const accessToken = response?.data?.accessToken;
          const role = response?.data?.role;

          setAuth({username, password, role, accessToken});
          setCookie("role", role, {
            path: "/"
          });
          setCookie("accessToken", accessToken, {
            path: "/"
          });

          setUsername('');
          setPassword('');

          navigate('/');
        }, (error) => {
          console.error('Error = ' + error);
          if (!error?.response) {
            console.error('Error = ' + error);
            setErrorMessage('No Server Response.')
          } else {
            switch (error?.response?.status) {
              case 400:
                setErrorMessage('Username in use. Try another username.');
                break;
              case 401:
                setErrorMessage('Unauthorized request.');
                break;
              case 403:
                setErrorMessage('Invalid username or password.');
                break;
              case 415:
                setErrorMessage('Unsupported request payload format.');
                break;
              default:
                setErrorMessage('Login failed.');
                break;
            }
          }
          errorReference.current?.focus();
        }
      );


    } catch (e) {
      console.error('Error = ' + e);
    }
  };

  return (
    <div className="register">
      <div className="item">
        <p ref={errorReference}
           className={errorMessage ? "errMsg" : "offScreen"}
           aria-live={"assertive"}>
          {errorMessage}
        </p>
      </div>
      <div className={"box"}>
        <div className="item">
          <img className="booksImage" src="/img/books_icon_big.png" alt="Book Store"/>
        </div>
        <div className="item">
          <form className={"form"} onSubmit={handleSubmit}>
            <div className="item">
              <BadgeOutlinedIcon/>
              <input type="text"
                     id="firstName"
                     ref={firstNameReference}
                     autoComplete="off"
                     onChange={(e) => setFirstName(e.target.value)}
                     value={firstName}
                     placeholder="Enter first name"
                     required
              />
              <input type="text"
                     id="lastName"
                     ref={lastNameReference}
                     autoComplete="off"
                     onChange={(e) => setLastName(e.target.value)}
                     value={lastName}
                     placeholder="Enter last name"
                     required
              />
            </div>
            <div className="item">
              <PersonOutlineIcon/>
              <input type="text"
                     id="username"
                     ref={usernameReference}
                     autoComplete="off"
                     onChange={(e) => setUsername(e.target.value)}
                     value={username}
                     placeholder="Enter username"
                     required
              />
            </div>
            <div className="item">
              <EmailOutlinedIcon/>
              <input type="text"
                     id="email"
                     ref={emailReference}
                     autoComplete="off"
                     onChange={(e) => setEmail(e.target.value)}
                     value={email}
                     placeholder="Enter email address"
                     required
              />
            </div>
            <div className="item">
              <KeyOutlinedIcon/>
              <input type="password"
                     id="password"
                     onChange={(e) => setPassword(e.target.value)}
                     value={password}
                     placeholder="Enter password"
                     required
              />
            </div>
            <div className="item">
              <KeyOutlinedIcon/>
              <input type="password"
                     id="confirmPassword"
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     value={confirmPassword}
                     placeholder="Confirm password"
                     required
              />
            </div>
            <div className="item">
              <LocalPhoneOutlinedIcon/>
              <input type="text"
                     id="phone"
                     ref={phoneReference}
                     autoComplete="off"
                     onChange={(e) => setPhone(e.target.value)}
                     value={phone}
                     placeholder="Enter phone number"
              />
            </div>
            <div className="item">
              <button className={"registerBtn"}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Register;
