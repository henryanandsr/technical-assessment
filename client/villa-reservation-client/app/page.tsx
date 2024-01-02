import React from "react";
import NavigationBar from "./components/NavigationBar";
import ListOfVilla from "./components/Homepage/ListOfVilla";
import heroImage from "./assets/hero.jpg";
import AboutUsComponents from "./components/Homepage/AboutUsComponents";
import Footer from "./components/Homepage/Footer";

const Home = () => {
  return (
    <>
      <NavigationBar />
      <div className="relative">
        <img
          src={heroImage.src}
          alt="Beautiful Landscape"
          className="mb-8 rounded-md shadow-lg w-full h-screen object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        <div>
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-white">
            Welcome to Villa Reservation
          </h1>
        </div>
      </div>
      <AboutUsComponents />
      <ListOfVilla />
      <Footer />
    </>
  );
};

export default Home;
