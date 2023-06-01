import React, {useContext, useState} from 'react';
import './NewBook.scss'
import {useNavigate} from "react-router-dom";
import axios from "../../api/Axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/UseRefreshToken";

const BOOKS_URL = process.env.REACT_APP_BOOKS_URL;


const NewBook = (props) => {
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();
  const refresh = useRefreshToken();

  // TODO: Remove usage of bookData
  const [bookData, setBookData] = useState(() => null);
  const [bookTitle, setBookTitle] = useState(() => '');
  const [authorFirstName, setAuthorFirstName] = useState(() => '');
  const [authorLastName, setAuthorLastName] = useState(() => '');
  const [bookGenre, setBookGenre] = useState(() => '');
  const [bookDescription, setBookDescription] = useState(() => '');
  const [currency, setCurrency] = useState(() => '');
  const [price, setPrice] = useState(() => 0);
  const [oldPrice, setOldPrice] = useState(() => 0);
  const [stars, setStars] = useState(() => 0);
  const [isNew, setIsNew] = useState(() => false);
  const [images, setImages] = useState(() => '');
  const [bookId, setBookId] = useState(() => 0);
  const [bookFormat, setBookFormat] = useState(() => '');


  async function saveBook() {
    let at = auth?.accessToken;

    if (auth?.accessToken == null) {
      at = await refresh();
    }

    axios.post(BOOKS_URL,
      JSON.stringify({
        book: {
          title: bookTitle,
          author: {
            firstName: authorFirstName,
            lastName: authorLastName
          },
          genre: bookGenre,
          description: bookDescription,
          currency,
          price,
          oldPrice,
          stars,
          isNew,
          imgs: [images],
          id: bookId,
          format: bookFormat,
        }
      }),
      {
        headers: {
          Authorization: 'Bearer ' + at,
          'Content-type': 'application/json',
        },
        withCredentials: true,
      }).then((response) => {
      console.log(response.data.book);

      navigate(`/book/${bookId}`);
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
            console.log('Login failed.');
            break;
        }
        if (error?.response?.status === 400 || error?.response?.status === 401 || error?.response?.status === 403) {
          console.log('Could not update the book data.')
        }
      }
    });
  };

  return (
    <div className="book">
      <div className="left">
        <div className="mainImg">
          <img src={images} alt="Book Image"/>
          Image URL:
          <input type="text"
                 id="images"
                 autoComplete="off"
                 onChange={(e) => setImages(e.target.value)}
                 value={images}
                 placeholder="Enter Book Title"
                 required
          />
        </div>
      </div>
      <div className="right">
        <div className="item">
          Title:
          <input type="text"
                 id="bookTitle"
                 autoComplete="off"
                 onChange={(e) => setBookTitle(e.target.value)}
                 value={bookTitle}
                 placeholder="Enter Book Title"
                 required
          />
        </div>
        <div className="item">
          Book ID:
          <input type="text"
                 id="bookId"
                 autoComplete="off"
                 onChange={(e) => setBookId(e.target.value)}
                 value={bookId}
                 placeholder="Enter Book ID"
                 required
          />
        </div>
        <div className="item">
          Price:
          <input type="text"
                 id="currency"
                 autoComplete="off"
                 onChange={(e) => setCurrency(e.target.value)}
                 value={currency}
                 placeholder="Enter Currency"
                 required
          />
          <input type="text"
                 id="price"
                 autoComplete="off"
                 onChange={(e) => setPrice(e.target.value)}
                 value={price}
                 placeholder="Enter Price"
                 required
          />
        </div>
        <div className="item">
          Author:
          <input type="text"
                 id="authorFirstName"
                 autoComplete="off"
                 onChange={(e) => setAuthorFirstName(e.target.value)}
                 value={authorFirstName}
                 placeholder="Enter Author Firstname"
          />
          <input type="text"
                 id="authorLastName"
                 autoComplete="off"
                 onChange={(e) => setAuthorLastName(e.target.value)}
                 value={authorLastName}
                 placeholder="Enter Author Lastname"
          />
        </div>
        <div className={"item"}>
          Genre:
          <input type="text"
                 id="bookGenre"
                 autoComplete="off"
                 onChange={(e) => setBookGenre(e.target.value)}
                 value={bookGenre}
                 placeholder="Enter Book Genre"
          />
        </div>
        <div className="item">
          Description:
          <textarea id={"bookDescription"} name="bookDescription" rows="10" cols="50" required>
              {bookDescription}
            </textarea>
        </div>

        <button className="add" onClick={event => saveBook()}>
          Save
        </button>
      </div>
    </div>
  )
};

export default NewBook;
