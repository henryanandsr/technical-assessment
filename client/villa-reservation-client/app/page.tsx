"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "./components/NavigationBar";
import heroImage from "./assets/hero.jpg";
import AboutUsComponents from "./components/Homepage/AboutUsComponents";
import Footer from "./components/Homepage/Footer";
import MultiSelectDropdown from "./components/Villa/MultiSelectDropdown";
import useAxiosPrivate from "./utils/api";
import {
  ThemeProvider,
  Typography,
  Card,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";

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
  const handleCityChange = (value: string | undefined) => {
    if (value) {
      setCity(value);
    }
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
          <Typography
            className="absolute top-32 md:top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white text-center"
            placeholder={"h1"}
          >
            Welcome to Villa Reservation
          </Typography>
          <Card
            className="absolute top-2/3 md:top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white"
            placeholder={"form"}
            color="transparent"
            shadow={false}
          >
            <div className="">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2"
                placeholder={"Villa Name"}
              >
                Villa Name
              </Typography>
              <Input
                type="text"
                size="lg"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin={undefined}
              />
            </div>
            <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row mt-2 space-x-4">
              <div className="w-full lg:w-auto">
                <Select
                  onChange={(e) => {
                    setCountry(e as string);
                    setCity((prevCity) => {
                      if (prevCity !== null) {
                        return null;
                      }
                      return prevCity;
                    });
                  }}
                  label="Select Country"
                  placeholder={""}
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {Array.from(countries).map((country: string, index) => (
                    <Option key={`country-${index}`} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="">
                <Select
                  onChange={(e) => {
                    setCountry(e as string);
                    setCity((prevCity) => {
                      if (prevCity !== null) {
                        return null;
                      }
                      return prevCity;
                    });
                  }}
                  label="Select Country"
                  placeholder={""}
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {Array.from(countries).map((country: string, index) => (
                    <Option key={`country-${index}`} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="">
                <Select
                  key={country}
                  onChange={handleCityChange}
                  label="Select City"
                  placeholder={""}
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {Array.from(cities).map((city: string, index) => (
                    <Option key={`city-${index}`} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="">
                <Input
                  type="number"
                  label="Price Low"
                  placeholder=""
                  value={priceLow || ""}
                  onChange={(e) => setPriceLow(parseInt(e.target.value))}
                  crossOrigin={undefined}
                  className="focus:border-none"
                  labelProps={{
                    className: "before:content-none after:content-none ml-1 ",
                  }}
                />
              </div>
              <div className="">
                <Input
                  type="number"
                  label="Price High"
                  placeholder=""
                  value={priceHigh || ""}
                  onChange={(e) => setPriceHigh(parseInt(e.target.value))}
                  className="focus:border-none"
                  crossOrigin={undefined}
                  labelProps={{
                    className: "before:content-none after:content-none ml-1 ",
                  }}
                />
              </div>
              <div className="">
                <MultiSelectDropdown
                  formFieldName="Amenities"
                  options={amenitiesOptions}
                  selectedItems={amenities}
                  onSelectionChange={handleAmenitiesChange}
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="mt-2 py-2 w-full lg:w-auto rounded-md bg-tertiary text-white"
              placeholder={"Search"}
            >
              Search
            </Button>
          </Card>
        </div>
      </div>
      <AboutUsComponents />
      {/* <ListOfVilla /> */}
      <Footer />
    </ThemeProvider>
  );
};

export default Home;
