import React, {useContext, useEffect, useState} from 'react';
import './Users.scss'
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/Axios";
import {Link, useNavigate} from "react-router-dom";
import useRefreshToken from "../../hooks/UseRefreshToken";

const USERS_URL = process.env.REACT_APP_USERS_URL;

const Users = (props) => {
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();

  const [users, setUsers] = useState(() => null);

  useEffect(() => {
    let isMounted = true;
    console.log(users);
    if (users) {
      return;
    }

    const abortController = new AbortController();

    async function getUsers() {

      let at = auth?.accessToken;

      if (auth?.accessToken == null) {
        at = await refresh();
      }
      console.log('USERS_URL'+USERS_URL);
      axios.get(USERS_URL, {
        headers: {
          Authorization: 'Bearer ' + at
        },
        signal: abortController.signal
      }).then((response) => {
        console.log('uderData'+JSON.stringify(response));
        isMounted && setUsers(i => response.data.users);
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


    getUsers();

    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

  async function deleteUser(username) {
    let at = auth?.accessToken;

    if (auth?.accessToken == null) {
      at = await refresh();
    }

    axios.delete(`${USERS_URL}?username=${username}`,
      {
        headers: {
          Authorization: 'Bearer ' + at
        },
        withCredentials: true,
      }).then((response) => {
      console.log(response.data.message);
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
      }
    });
  }

  return (
    <div className={"users"}>
      <div className={"usersList"}>
        <table>
          <thead>
          <tr>
            <th>Username</th>
            <th>Display Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {users?.map(user => (
            <tr>
              <td>{user.username}</td>
              <td>{user.displayName.firstName} {user.displayName.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.role}</td>
              <td>
                <Link className="link" to={`/user/${user.username}/edit`}>
                  <button className={"editButton"}>Edit User</button>
                </Link>
              </td>
              <td>
                <button className={"deleteButton"} onClick={() => deleteUser(user.username)}>
                  Delete User
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div>
        <Link className="link" to={`/register`}>
          <button className={"newUserButton"}>Add User</button>
        </Link>
      </div>
    </div>
  )
};

export default Users;
