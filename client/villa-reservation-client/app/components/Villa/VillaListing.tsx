"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
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
    <div className="container mx-auto mt-24 z-1">
      <h1 className="text-3xl font-bold mb-4">Villa Listings</h1>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {filteredVillas.map((villa) => (
              <div
                key={villa.id}
                className="bg-white rounded-md overflow-hidden shadow-lg"
              >
                <Link href={"villa/" + villa.id}>
                  {villa.images && villa.images.length > 0 && (
                    <img
                      src={displayImage(villa.images[0].data.data)}
                      alt={villa.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </Link>
                <div className="p-4">
                  <Link href={"villa/" + villa.id}>
                    <h2 className="text-xl font-bold mb-2">{villa.name}</h2>
                    <p className="text-gray-700 mb-2">
                      {villa.short_description}
                    </p>
                    <p className="text-blue-500 font-bold">
                      ${villa.price}/night
                    </p>
                  </Link>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default VillaListing;
