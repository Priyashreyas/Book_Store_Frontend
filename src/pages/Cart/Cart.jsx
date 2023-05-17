import React from 'react';
import './Cart.scss'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const Cart = (props) => {
  const data = [
    {
      id: 1,
      title: 'Book1 akdlsjhfasdjkhf;kasdjf',
      isNew: true,
      author: 'RK',
      oldPrice: 19,
      price: 12,
      imgs: [
        {
          path: "/img/books.avif"
        },
        {
          path: "/img/ThePowerOfNow.jpg"
        },
      ]
    },
    {
      id: 2,
      title: 'Book2',
      isNew: false,
      author: 'RK a;ldskjf;asjkdf;asdkjfal;dskfk;asdjf;asdjfnkasdjflkasjdhfklsdjhfkjsdhflkjsdhfklsdjfhklsjdhfksdjfklsjdhfksjdhfksdjhfkjshdklfjsdhkfjs',
      oldPrice: 19,
      price: 12,
      imgs: [
        {
          path: "/img/books.avif"
        },
        {
          path: "/img/ThePowerOfNow.jpg"
        },
      ]
    },
    {
      id: 3,
      title: 'Book3',
      isNew: false,
      author: 'RK',
      oldPrice: 19,
      price: 12,
      imgs: [
        {
          path: "/img/ThePowerOfNow.jpg"
        },
        {
          path: "/img/books.avif"
        },
      ]
    },
    {
      id: 4,
      title: 'Book4',
      isNew: true,
      author: 'RK',
      oldPrice: 19,
      price: 12,
      imgs: [
        {
          path: "/img/books.avif"
        },
        {
          path: "/img/ThePowerOfNow.jpg"
        },
      ]
    },
  ]

  return (
    <div className="cart">
      <h1>Books in your cart</h1>
      {data?.map(book=>(
        <div className="item" key={book.id}>
          <img src={book.imgs[0].path} alt="hi"/>
          <div className="details">
            <h1>{book.title.substring(0, 50)}</h1>
            <p>{book.author.substring(0, 50)}</p>
            <div className="price">
              1 x {book.price}
            </div>
          </div>
          <div className="delete">
            <DeleteOutlinedIcon/>
          </div>
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>$123</span>
      </div>
      <button>PROCEED TO CHECKOUT</button>
      <span className="reset">
        Reset Cart
      </span>
    </div>
  )
}

export default Cart;
