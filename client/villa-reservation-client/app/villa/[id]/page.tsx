"use client";
import NavigationBar from "@/app/components/NavigationBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
    <>
      <NavigationBar />
      <h1 className="text-3xl font-bold text-center mb-4">VillaDetails</h1>
      {/* Display Villa */}
      {villa ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src={displayImage(villa.images[0].data.data)}
                alt={villa.name}
                className="mb-8 rounded-md shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{villa.name}</h1>
              <p className="text-xl mb-4">Price: {villa.price}</p>
              <p className="text-xl mb-4">Address: {villa.address}</p>
              <p className="text-xl mb-4">
                Description: {villa.short_description}
              </p>
              <p className="text-xl mb-4">Amenities: {villa.amenities}</p>
            </div>
            <Link href={`/villa/checkout/${id}`}>
                Book Now
            </Link>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default VillaDetails;
