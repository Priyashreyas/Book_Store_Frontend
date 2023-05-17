import React, {useEffect, useState} from 'react';
import './FeaturedBooks.scss'
import Card from "../Card/Card";
import axios from "../../api/Axios";

const AUTH_URL = process.env.REACT_APP_AUTHENTICATE_URL;
const BOOKS_URL = process.env.REACT_APP_BOOKS_URL;

const FeaturedBooks = ({type}) => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookData) {
      return;
    }

    getBookData();
  });

  async function getBookData() {
    if (loading) {
      return;
    }
    setLoading(true);

    let token = null;
    await axios.post(AUTH_URL, {
      "username": "maitreyee",
      "password": "maitreyee"
    }).then((response) => {
      console.log('role = ' + response.data.role);
      console.log('token = ' + response.data.accessToken);
      token = response.data.accessToken;
    }, (error) => {
      console.error('Error = ' + error);
    });

    console.log(`${BOOKS_URL}?count=10`);

    await axios.get(`${BOOKS_URL}?count=10`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((response) => {
      console.log(response.data.books);
      setBookData(response.data.books);
      setLoading(false);
    }, (error) => {
      console.error('Error = ' + error);
    });
  }

  if (bookData) {
    return (
      <div className="featuredBooks">
        <div className="top">
          <h1>{type} products</h1>
          <p>
            Senectus suscipit ipsum impedit? Aliquip aliquid iure fringilla, erat natoque deleniti esse architecto,
            class convallis sagittis nisl sunt vel harum sem reprehenderit. Bibendum pretium sodales architecto hac
            eligendi repudiandae dolorum, dolorum ex. Quis eum, quasi sociosqu, ultricies dolorem, porro fermentum
            lobortis commodi cillum interdum, lacus qui, commodo illum. Diam. Consequuntur.
          </p>
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
