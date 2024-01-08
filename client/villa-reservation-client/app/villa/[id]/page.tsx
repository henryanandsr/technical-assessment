"use client";
import NavigationBar from "@/app/components/NavigationBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OpenStreetMap from "@/app/components/map/OpenStreetMap";
interface Villa {
  id: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  longitude: number;
  latitude: number;
  address: string;
  amenities: string[];
  images: { filename: string; aliases: string[]; data: { data: number[] } }[];
}
function VillaDetails() {
  const [villa, setVilla] = useState<Villa>();
  const [loading, setLoading] = useState(true);
  const usePathName = usePathname();
  const id = usePathName.split("/").pop();
  console.log("id", id);
  const uri = process.env.SERVER_URL + "/api/villa/" + id;
  console.log(uri);

  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const res = await axios.get(uri, { withCredentials: true });
        setVilla(res.data.data);
        console.log("res", res.data.data);
        console.log("images", res.data.data.images);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching villas:", error);
        setLoading(false);
      }
    };

    fetchVilla();
  }, [id]);

  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    const base64String = btoa(
      String.fromCharCode.apply(null, Array.from(uint8Array))
    );
    return `data:image/png;base64,${base64String}`;
  };

  return (
    <div className="bg-bg1">
      <NavigationBar />
      {villa ? (
        <div className="container mx-auto px-20 py-10">
          <div className="grid grid-cols-1 gap-8">
            <div className="">
              <div className="">
                <div className="flex flex-row justify-between items-center mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-4">{villa.name}</h1>
                    <p className="text-sm mb-4">{villa.address}</p>
                  </div>
                  <div className="text-right">
                    <div>Price/room/night</div>
                    <div className="text-primary font-bold text-xl mb-2">
                      $ {villa.price}
                    </div>
                    <Link
                      href={`/villa/checkout/${id}`}
                      className="bg-primary px-10 py-2 text-white mb-2"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
                <img
                  src={displayImage(villa.images[0].data.data)}
                  alt={villa.name}
                  className="mb-8 rounded-md shadow-lg w-full"
                />
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-1/3">
                  <div className="text-xl mb-4 bg-white p-4 rounded-md">
                    <h2 className="font-bold">Description</h2>
                    <p className="text-sm">{villa.short_description}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md">
                    <h2 className="font-bold text-xl mb-4">Amenities</h2>
                    <ul className="list-disc list-inside">
                      {villa.amenities.map((amenity) => (
                        <li className="mb-2 text-sm">{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-full ml-4 rounded-md">
                  <OpenStreetMap
                    longitude={villa.longitude}
                    latitude={villa.latitude}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default VillaDetails;
