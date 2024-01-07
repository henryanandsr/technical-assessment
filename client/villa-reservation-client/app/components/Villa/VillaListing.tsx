"use client";
import { useState, useEffect, useCallback, use } from "react";
import useAxiosPrivate from "@/app/utils/api";
import Link from "next/link";
import villaListing from "../../assets/villa-listing.jpg";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import path from "path";

interface Villa {
  id: string;
  name: string;
  short_description: string;
  price: number;
  images: { filename: string; aliases: string[]; data: { data: number[] } }[];
}

function VillaListing() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const axiosInstance = useAxiosPrivate();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [countries, setCountries] = useState<Set<string>>(new Set());
  const [city, setCity] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  const [priceLow, setPriceLow] = useState<number | null>(null);
  const [priceHigh, setPriceHigh] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const amenitiesOptions = [
    "Wifi",
    "Kitchen",
    "TV",
    "Pool",
    "AirConditioning",
    "Heating",
    "Parking",
    "Washer",
    "Dryer",
    "Breakfast",
  ];
  const handleAmenitiesChange = (selectedItems: string[]) => {
    setAmenities(selectedItems);
  };
  const uri_countries = process.env.SERVER_URL + "/api/countries";
  const uri_cities = process.env.SERVER_URL + "/api/countries";
  useEffect(() => {
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search"));
    }
    if (searchParams.get("country")) {
      setCountry(searchParams.get("country"));
    }
    if (searchParams.get("city")) {
      setCity(searchParams.get("city"));
    }
    if (searchParams.get("priceLow")) {
      setPriceLow(parseInt(searchParams.get("priceLow") || "0"));
    }
    if (searchParams.get("priceHigh")) {
      setPriceHigh(parseInt(searchParams.get("priceHigh") || "0"));
    }
    if (searchParams.get("amenities")) {
      setAmenities(searchParams.get("amenities")?.split(",") || []);
    }
    const addInitialParams = () => {
      try {
        let initial_param = new URLSearchParams();
        if (!searchParams.get("page")) {
          initial_param.set("page", "1");
        }
        if (!searchParams.get("itemsPerPage")) {
          initial_param.set("itemsPerPage", "10");
        }
        if (initial_param.toString() !== "") {
          router.push(pathName + "?" + initial_param.toString());
        }
      } catch (error) {
        console.error("Error adding initial params:", error);
      }
    };
    addInitialParams();
  }, []);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        if (searchParams.get("page") && searchParams.get("itemsPerPage")) {
          const INIT_URI =
            process.env.SERVER_URL +
            "/api/villa/search?" +
            searchParams.toString();
          const res = await axiosInstance.get(INIT_URI, {
            withCredentials: true,
          });
          setVillas(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching villas:", error);
        setLoading(false);
      }
    };
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(uri_countries, {
          withCredentials: true,
        });
        setCountries(new Set(res.data.data.sort()));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
    fetchVillas();
  }, [useSearchParams, searchParams]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get(uri_cities + "/" + country, {
          withCredentials: true,
        });
        setCities(res.data.data);
      } catch (error) {
        console.error("Error fetching villas:", error);
      }
    };
    fetchCities();
  }, [country]);
  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64String = btoa(binary);
    return `data:image/png;base64,${base64String}`;
  };
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const handleSubmit = () => {
    // reset params to empty
    let params = new URLSearchParams();
    console.log("searchQuery", params);
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (country) {
      // router.push(pathName + "?" + createQueryString("country", country));
      params.set("country", country);
    }
    if (city) {
      // router.push(pathName + "?" + createQueryString("city", city));
      console.log("city", city);
      params.set("city", city);
    }
    if (priceLow) {
      // router.push(
      //   pathName + "?" + createQueryString("priceLow", priceLow.toString())
      // );
      params.set("priceLow", priceLow.toString());
    }
    if (priceHigh) {
      // router.push(
      //   pathName + "?" + createQueryString("priceHigh", priceHigh.toString())
      // );
      params.set("priceHigh", priceHigh.toString());
    }
    params.set("page", searchParams.get("page") || "1");
    params.set("itemsPerPage", searchParams.get("itemsPerPage") || "10");
    router.push("?" + params.toString());
    if (amenities.length > 0) {
      const amenitiesString = amenities.join(",");
      params.set("amenities", amenitiesString);
      router.push(pathName + "?" + params.toString());
    }
  };

  return (
    <div className="mt-24">
      <div className="relative">
        <img src={villaListing.src} alt="" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold">
          Lorem Ipsum Dolor sir Amet
        </div>
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white flex flex-col">
          <div className="">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 px-4 py-2 w-full"
            />
          </div>
          <div className="flex flex-row mt-2 space-x-4">
            <div>
              <label htmlFor="country" className="block">
                Country
              </label>
              <select
                name="country"
                id="country"
                value={country || ""}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity(null);
                }}
                className="border border-gray-300 px-4 py-2"
              >
                <option value="">Select a country</option>
                {Array.from(countries).map((country: string, index) => (
                  <option key={`country-${index}`} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block">
                City
              </label>
              <select
                name="city"
                id="city"
                value={city || ""}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300 px-4 py-2"
              >
                <option value="">Select a city</option>
                {cities.map((city: string, index) => (
                  <option key={`city-${index}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priceLow" className="block">
                Price Low
              </label>
              <input
                type="number"
                placeholder="Search by price low..."
                value={priceLow || ""}
                onChange={(e) => setPriceLow(parseInt(e.target.value))}
                className="border border-gray-300 px-4 py-2 "
              />
            </div>
            <div className="flex flex-col justify-end">
              <label htmlFor="priceHigh" className="block">
                Price High
              </label>
              <input
                type="number"
                placeholder="Search by price high..."
                value={priceHigh || ""}
                onChange={(e) => setPriceHigh(parseInt(e.target.value))}
                className="border border-gray-300 px-4 py-2 "
              />
            </div>
            <div className="flex flex-col justify-end">
              <MultiSelectDropdown
                formFieldName="Amenities"
                options={amenitiesOptions}
                selectedItems={amenities}
                onSelectionChange={handleAmenitiesChange}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-2 py-2 w-full rounded-md bg-tertiary text-white"
          >
            Search
          </button>
        </div>
      </div>
      <div className="container mx-auto z-1 px-20 mt-5">
        <div className="mb-2 flex flex-row justify-end items-center">
          <label htmlFor="itemsPerPage" className="mr-2">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={searchParams.get("itemsPerPage") || "10"}
            onChange={(e) =>
              router.push(
                pathName +
                  "?" +
                  createQueryString("itemsPerPage", e.target.value)
              )
            }
            className="border border-gray-300 px-2 py-1"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {villas.map((villa, index) => (
                <div
                  key={index}
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
                        href={`/villa/checkout/${villa.id}`}
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
        <div className="flex justify-center mt-4 mb-4">
          <button
            onClick={() => {
              const currentPage = parseInt(searchParams.get("page") || "1");
              router.push(
                pathName +
                  "?" +
                  createQueryString("page", (currentPage - 1).toString())
              );
            }}
            disabled={Number(searchParams.get("page") || 1) === 1}
          >
            Previous Page
          </button>
          <span className="mx-2">Page {searchParams.get("page") || 1}</span>
          <button
            onClick={() => {
              const currentPage = parseInt(searchParams.get("page") || "1");
              router.push(
                pathName +
                  "?" +
                  createQueryString("page", (currentPage + 1).toString())
              );
            }}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}
export default VillaListing;
