import React, {useContext, useEffect, useState} from 'react';
import './DeleteBook.scss'
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/Axios";

import {Link} from "react-router-dom";
import useRefreshToken from "../../hooks/UseRefreshToken";
import {useNavigate, useParams} from "react-router-dom";


//const DELETE_URL = process.env.REACT_APP_DELETE_URL;
const BOOKS_URL = process.env.REACT_APP_DELETE_URL;
//USERS_URL
const Book = (props) => {
//ADDED
const {auth} = useContext(AuthContext);
const navigate = useNavigate();
const refresh = useRefreshToken();

console.log(`auth1 = ${auth?.accessToken}`);

//const {id} = useParams();
//const [selectedImg, setSelectedImg] = useState(() => 0);
//const [quantity, setQuantity] = useState(() => 1);
const [bookDataDelete, setBookData] = useState(() => null);


  useEffect(() => {
    let isMounted = true;
    console.log("Effect called!!");
    //console.log('bookData'+bookData);
    if (bookDataDelete) {
      return;
    }

    const abortController = new AbortController();
    getBookData(abortController, isMounted);
    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

    async function getBookData(abortController, isMounted) {

        let at = auth?.accessToken;
  
        if (auth?.accessToken == null) {
          at = await refresh();
        }
        
        console.log(`role = ${auth?.role}, ls = ${window.sessionStorage.getItem('role')}`);
        console.log('BOOKS_URL'+BOOKS_URL);
        axios.get(`${BOOKS_URL}`, {
          headers: {
            Authorization: 'Bearer ' + at,
          
          },
        signal: abortController.signal
         //console.log('my response of delete'+response.data.book);
        }).then((getResponse) => {
          console.log('my response of delete'+JSON.stringify(getResponse));
          isMounted && setBookData(prevData => getResponse.data.books);
          console.log('prevData in delete'+bookDataDelete);
          navigate('/delete');
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

  async function deleteBook(id) {
    let at = auth?.accessToken;

    if (auth?.accessToken == null) {
      at = await refresh();
    }

    axios.delete(`${BOOKS_URL}?id=${id}`,
      {
        headers: {
          Authorization: 'Bearer ' + at
        },
        withCredentials: true,
      }).then((response) => {
      console.log(response.data.message);
      console.log(response.data.message);
      const abortController = new AbortController();

      getBookData(abortController, true);

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
            <th>ID</th>
            <th>Name</th>
            <th>Genre</th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {bookDataDelete?.map(book => (
            <tr>
              <td>{book.id}</td>
              <td>{book.title} </td>
              <td>{book.genre}</td>
              <td>
                <button className={"deleteButton"} onClick={() => deleteBook(book.id)}>
                  Delete Book
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
     
    </div>
  )
};

export default Book;
