import React, {useContext, useEffect, useRef, useState} from 'react';
import './EditUser.scss'
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/Axios";
import {useNavigate, useParams} from "react-router-dom";
import useRefreshToken from "../../hooks/UseRefreshToken";
import UserDetails from "../../components/UserDetails/UserDetails";

const USERS_URL = process.env.REACT_APP_USERS_URL;
const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;

const EditUser = (props) => {
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const {id} = useParams();

  const [users, setUsers] = useState(() => null);

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
    let isMounted = true;
    console.log(users);
    if (users) {
      return;
    }

    const abortController = new AbortController();

    async function getUser() {

      let at = auth?.accessToken;

      if (auth?.accessToken == null) {
        at = await refresh();
      }

      axios.get(`${USERS_URL}/${id}`, {
        headers: {
          Authorization: 'Bearer ' + at
        },
        signal: abortController.signal
      }).then((response) => {
        console.log(response.data.users);
        isMounted && setUsers(prevData => response.data.users);

        let user = response.data.users[0];
        setUsername(user.username);
        setEmail(user.email);
        setPhone(user.phoneNumber);
        setFirstName(user.displayName.firstName);
        setLastName(user.displayName.lastName);
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
            navigate('/');
          }
        }
      });
    }


    getUser();

    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let at = auth?.accessToken;

      if (auth?.accessToken == null) {
        at = await refresh();
      }

      await axios.post(
        USERS_URL,
        JSON.stringify({
          user: {
            username,
            displayName: {firstName, lastName},
            email,
            phoneNumber: phone,
          }
        }),
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + at
          },
          withCredentials: true
        }).then((response) => {
          console.log('data = ' + response?.data);
          const accessToken = response?.data?.accessToken;
          const role = response?.data?.role;

          // setAuth({username, password, role, accessToken});

          setUsername('');
          setPassword('');

          navigate('/users');
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
    <div className={"editUser"}>
      <form className={"form"} onSubmit={handleSubmit}>
        <UserDetails className={"item"} item={{
          id,
          usernameReference,
          emailReference,
          phoneReference,
          firstNameReference,
          lastNameReference,
          errorReference,
          username,
          email,
          phone,
          firstName,
          lastName,
          password,
          confirmPassword,
          errorMessage,
          setUsername,
          setEmail,
          setPhone,
          setFirstName,
          setLastName,
          setPassword,
          setConfirmPassword,
          setErrorMessage,
        }}/>

        <div className="item">
          <button className={"saveBtn"}>Save</button>
        </div>
      </form>
    </div>
  )
};

export default EditUser;
