import React from "react";

// Sample data for villas
const villaData = [
  {
    id: "1",
    name: "Luxury Villa 1",
    price: 500,
    shortDescription: "Stunning villa with breathtaking views.",
    image: "https://placekitten.com/800/600",
  },
  {
    id: "2",
    name: "Seaside Retreat",
    price: 350,
    shortDescription: "Relax by the beach in this beautiful villa.",
    image: "https://placekitten.com/801/600",
  },
];

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-between p-24 text-black">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-lg text-gray-600">
          Explore amazing features and discover new possibilities.
        </p>
      </div>

      <img
        src="https://placekitten.com/1200/600" // Replace with your image URL
        alt="Beautiful Landscape"
        className="mb-8 rounded-md shadow-lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {villaData.map((villa) => (
          <div
            key={villa.id}
            className="bg-white rounded-md overflow-hidden shadow-lg"
          >
            <img
              src={villa.image}
              alt={villa.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{villa.name}</h2>
              <p className="text-gray-700 mb-2">{villa.shortDescription}</p>
              <p className="text-blue-500 font-bold">${villa.price}/night</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign In
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">
          Sign Up
        </button>
      </div>
    </main>
  );
};

export default Home;
