import React, {useContext, useEffect, useState} from 'react';
import './FeaturedBooks.scss'
import Card from "../Card/Card";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

const BOOKS_URL = process.env.REACT_APP_BOOKS_URL;

const FeaturedBooks = ({type}) => {
  const [cookies, setCookie] = useCookies([]);
  const {auth} = useContext(AuthContext);
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (bookData) {
      return;
    }

    const abortController = new AbortController();

    async function getBookData() {
      if (loading) {
        return;
      }
      setLoading(true);

      let at = auth?.accessToken;
      if (at === undefined || at === null) {
        at = cookies.accessToken;
      }

      if (at === undefined || at === null) {
        at = await refresh();
      }

      console.log(`${BOOKS_URL}?count=10,type=${type}`);

      await axios.get(`${BOOKS_URL}?count=10&type=${type}`, {
        headers: {
          Authorization: 'Bearer ' + at
        }
      }).then((response) => {
        console.log(response.data.books);
        isMounted && setBookData(response.data.books);
        setLoading(false);
      }, (error) => {
        console.error('Error = ' + error);
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
      <div className="featuredBooks">
        <div className="top">
          <h1>{type} products</h1>
          {type === "featured" &&
            <p>
              Discover our handpicked selection of featured books, carefully chosen to ignite your imagination,
              stir your emotions, and transport you to captivating worlds. Whether you're seeking a thrilling
              adventure, a thought-provoking tale, or a heartwarming story, our featured books have something
              for every reader.
            </p>
          }
          {type === "trending" &&
            <p>
              Stay ahead of the literary curve with our collection of trending books that are captivating
              readers and generating buzz in the literary world. These are the books that everyone is talking
              about and you won't want to miss.
            </p>
          }
        </div>
        <div className="bottom">
          <div className={"cards"}>
            {bookData.map(item => (
              <Card item={item} key={item.id}/>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={"loading"}>
        <img className="loadingImage" src="/img/loading-waiting.gif" alt="Books are loading..."/>
      </div>
    )
  }
}

export default FeaturedBooks;
