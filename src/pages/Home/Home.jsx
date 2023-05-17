import React from 'react';
import FeaturedBooks from "../../components/FeaturedBooks/FeaturedBooks";
import './Home.scss'

const Home = (props) => {
  return (
    <div className={"home"}>
      <FeaturedBooks type="featured"/>
      <FeaturedBooks type="trending"/>
    </div>
  )
}

export default Home;
