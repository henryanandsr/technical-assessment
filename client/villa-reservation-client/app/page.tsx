"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "./components/NavigationBar";
import heroImage from "./assets/hero.jpg";
import AboutUsComponents from "./components/Homepage/AboutUsComponents";
import Footer from "./components/Homepage/Footer";
import MultiSelectDropdown from "./components/Villa/MultiSelectDropdown";
import useAxiosPrivate from "./utils/api";
import { ThemeProvider } from "@material-tailwind/react";

interface Villa {
  id: string;
  name: string;
  short_description: string;
  price: number;
  images: { filename: string; aliases: string[]; data: { data: number[] } }[];
}
const Home = () => {
  const axiosInstance = useAxiosPrivate();
  const Router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [countries, setCountries] = useState<Set<string>>(new Set());
  const [city, setCity] = useState<string | null>(null);
  const [cities, setCities] = useState<Set<string>>(new Set());
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
  const uri_countries = process.env.SERVER_URL + "/api/countries";
  const uri_cities = process.env.SERVER_URL + "/api/countries";

  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const fetchCities = async () => {
      if (country) {
        try {
          const res = await axiosInstance.get(uri_cities + "/" + country, {
            withCredentials: true,
          });
          setCities(new Set(res.data.data.sort()));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [country]);
  const handleAmenitiesChange = (selectedItems: string[]) => {
    setAmenities(selectedItems);
  };
  const handleSubmit = async () => {
    // move to villa/search with query params
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (country) {
      params.append("country", country);
    }
    if (city) {
      params.append("city", city);
    }
    if (priceLow) {
      params.append("priceLow", priceLow.toString());
    }
    if (priceHigh) {
      params.append("priceHigh", priceHigh.toString());
    }
    if (amenities.length > 0) {
      params.append("amenities", amenities.join(","));
    }
    console.log("params", params.toString());
    Router.push(`/villa?${params.toString()}` + "&page=1" + "&itemsPerPage=10");
  };
  return (
    <ThemeProvider>
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
          <div className="relative">
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
                    {Array.from(cities).map((city: string, index) => (
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
        </div>
      </div>
      <AboutUsComponents />
      {/* <ListOfVilla /> */}
      <Footer />
    </ThemeProvider>
  );
};

export default Home;
