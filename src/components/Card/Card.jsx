import React from 'react';
import './Card.scss'
import {Link} from "react-router-dom";

const Card = ({item}) => {
  if (item) {
    return (
      <Link className="link" to={`/book/${item.id}`}>
        <div className="card">
          <div className="image">
            {item.new && <span>New Arrival</span>}
            <img src={item.imgs[0]} alt="image 1" className="mainImg"/>
            <img src={item.imgs[1]} alt="image 2" className="secondImg"/>
          </div>
          <h2>{item.title}</h2>
          <div className="prices">
            <h3>${item.oldPrice}</h3>
            <h3>${item.price}</h3>
          </div>
        </div>
      </Link>
    )
  } else {
    return <div>Item is loading...</div>
  }
}
export default Card;
