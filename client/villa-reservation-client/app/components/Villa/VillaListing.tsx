"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import villaListing from "../../assets/villa-listing.jpg";
interface Villa {
  id: string;
  name: string;
  short_description: string;
  price: number;
  images: { filename: string; aliases: string[]; data: { data: number[] } }[];
}

function VillaListing() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const uri = process.env.SERVER_URL + "/api/villa";

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const res = await axios.get(uri, { withCredentials: true });
        setVillas(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching villas:", error);
        setLoading(false);
      }
    };

    fetchVillas();
  }, []);

  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    const base64String = btoa(
      String.fromCharCode.apply(null, Array.from(uint8Array))
    );
    return `data:image/png;base64,${base64String}`;
  };

  const filteredVillas = villas.filter((villa) =>
    villa.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-24">
      <div className="relative">
        <img src={villaListing.src} alt="" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-white text-6xl font-bold">
          Lorem Ipsum Dolor sir Amet
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-96 "
          />
        </div>
      </div>
      <div className="container mx-auto z-1 px-20 mt-5">
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {filteredVillas.map((villa) => (
                <div
                  key={villa.id}
                  className="bg-white rounded-md overflow-hidden flex flex-row shadow-md h-[20vh]"
                >
                  <Link href={"villa/" + villa.id}>
                    {villa.images && villa.images.length > 0 && (
                      <img
                        src={displayImage(villa.images[0].data.data)}
                        alt={villa.name}
                        className="h-full w-96 object-cover"
                      />
                    )}
                  </Link>
                  <div className="p-4 flex flex-row justify-between w-full items-center">
                    <Link href={"villa/" + villa.id}>
                      <h2 className="text-xl font-bold mb-2">{villa.name}</h2>
                      <p className="text-gray-700 mb-2">
                        {villa.short_description}
                      </p>
                      <p className="text-tertiary font-bold">
                        ${villa.price}/night
                      </p>
                    </Link>
                    <div className="px-2">
                      <Link
                        href="/"
                        className="bg-tertiary text-white rounded-md px-3 py-2"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VillaListing;
