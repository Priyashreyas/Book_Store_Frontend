import React from 'react';
import './Footer.scss'

const Footer = (props) => {
  return (
    <div className="footer">
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Category 1</span>
          <span>Category 2</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span>FAQ</span>
          <span>New Arrivals</span>
          <span>Trending</span>
          <span>Offers</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>We believe that books are more than just words on a page; they are gateways to new worlds, experiences, and perspectives.
            We offer a carefully curated selection of books across a range of genres, from bestsellers to indie gems.</span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Per habitasse malesuada imperdiet, fuga lacus. Augue venenatis conubia rhoncus proident
            morbi perferendis condimentum omnis! Corporis. Litora faucibus doloribus mi minima at, nemo,
            enim risus sint felis nemo, sem nullam proident voluptatem aspernatur, dicta neque at, sociis
            nisl, vulputate fugit temporibus sint proident dolore quaerat.</span>
        </div>
      </div>
      <div className="bottom">
        <div className="center">
          <span className="logo">Book Store</span>
          <span className="copyright">© Copyright 2023. All rights reserved</span>
        </div>
      </div>
    </div>
  )
}

export default Footer;
