"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Villa {
  id: string;
  name: string;
  short_description: string;
  price: number;
  images: { filename: string; aliases: string[]; data: { data: number[] } }[];
}

function ListOfVilla() {
  const [villaData, setVillaData] = useState<Villa[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(process.env.SERVER_URL + "/api/villa");
        setVillaData(result.data.data);
      } catch (error) {
        console.error("Error fetching villa data:", error);
      }
    };

    fetchData();
  }, []);

  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    const base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    return `data:image/png;base64,${base64String}`;
  };

  return (
    <div>
      <h1>List of Villa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg: grid-cols-3 gap-8">
        {villaData.map((villa) => (
          <div
            key={villa.id}
            className="bg-white rounded-md overflow-hidden shadow-lg"
          >
            {villa.images && villa.images.length > 0 ? (
              <img
                src={displayImage(villa.images[0].data.data)}
                alt={villa.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300"></div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{villa.name}</h2>
              <p className="text-gray-700 mb-2">{villa.short_description}</p>
              <p className="text-blue-500 font-bold">${villa.price}/night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOfVilla;
