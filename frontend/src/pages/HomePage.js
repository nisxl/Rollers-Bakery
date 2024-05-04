import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Body from "../components/Layout/Body";
const HomePage = () => {
  let [notes, setNotes] = useState([]);

  return (
    <div>
      <Body />
      <Footer />
      {/* <Chat /> */}
    </div>
  );
};

export default HomePage;
