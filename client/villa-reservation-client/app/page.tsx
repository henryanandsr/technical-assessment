import React from "react";
import NavigationBar from "./components/NavigationBar";
import ListOfVilla from "./components/Homepage/ListOfVilla";

const Home = () => {
  return (
    <>
      <NavigationBar />
      <main className="flex flex-col items-center justify-between text-black">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
          <p className="text-lg text-gray-600">
            Explore amazing features and discover new possibilities.
          </p>
        </div>

        <img
          src="https://placekitten.com/1200/600"
          alt="Beautiful Landscape"
          className="mb-8 rounded-md shadow-lg"
        />
        < ListOfVilla />
      </main>
    </>
  );
};

export default Home;
