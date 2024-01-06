"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        console.log("Villa data:", result.data.data);
      } catch (error) {
        console.error("Error fetching villa data:", error);
      }
    };

    fetchData();
  }, []);

  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64String = btoa(binary);
    return `data:image/png;base64,${base64String}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-primary pb-2">
      <div className="m-20">
        <h1 className="text-5xl mb-7 pt-6 font-bold text-center text-white mb-4">
          Our Villas
        </h1>
        <Slider {...settings}>
          {villaData.map((villa) => (
            <div
              key={villa.id}
              className="bg-white rounded-md overflow-hidden relative"
            >
              {villa.images && villa.images.length > 0 ? (
                <img
                  src={displayImage(villa.images[0].data.data)}
                  alt={villa.name}
                  className="w-full h-[75vh] object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300"></div>
              )}
              <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white w-full h-full flex flex-col justify-end items-center">
                <h2 className="text-4xl font-bold mb-2">{villa.name}</h2>
                <p className="mb-2">{villa.short_description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ListOfVilla;
