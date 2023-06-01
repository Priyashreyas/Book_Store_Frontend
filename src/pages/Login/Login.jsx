import React, {useContext, useEffect, useRef, useState} from 'react';
import './Login.scss'
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/Axios";
import {Link, useNavigate} from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import {useCookies} from "react-cookie";

const AUTH_URL = process.env.REACT_APP_AUTHENTICATE_URL;

const Login = (props) => {
  const [cookies, setCookie] = useCookies([]);
  const {setAuth} = useContext(AuthContext);
  const navigate = useNavigate();
  const usernameReference = useRef();
  const errorReference = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    usernameReference.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);

    try {
      await axios.post(
        AUTH_URL,
        JSON.stringify({username, password}),
        {
          headers: {
            'Content-type': 'application/json'
          },
          withCredentials: true
        }).then((response) => {
          console.log('data = ' + response?.data);
          const accessToken = response?.data?.accessToken;
          const role = response?.data?.role;

          setAuth({username, password, role, accessToken});

          setCookie("role", role, {
            path: "/"
          });
          setCookie("accessToken", accessToken, {
            path: "/"
          });

          setSuccess(true);
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
                setErrorMessage('Missing username or password.');
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
    <>
      {
        success ? (
          <div className="test">SUCCESS!!!</div>
        ) : (
          <div className="login">
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
                    <button className={"signIn"}>Sign In</button>
                  </div>
                </form>
              </div>
              <div className="item">
                <p>or</p>
              </div>
              <div className="item">
                <Link className="link" to="/register">
                  <button className={"signUp"}>Sign Up</button>
                </Link>
              </div>
            </div>
          </div>
        )
      }
    < />
  )
};

export default Login;
