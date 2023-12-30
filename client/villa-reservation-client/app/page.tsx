import React from "react";
import NavigationBar from "./components/NavigationBar";
import ListOfVilla from "./components/Homepage/ListOfVilla";
import heroImage from "./assets/hero.jpg";

const Home = () => {
  return (
    <>
      <NavigationBar />
        <img
          src={heroImage.src}
          alt="Beautiful Landscape"
          className="mb-8 rounded-md shadow-lg w-full"
        />
        < ListOfVilla />
    </>
  );
};

export default Home;
