"use client";
import { useState, useEffect, useCallback, use } from "react";
import useAxiosPrivate from "@/app/utils/api";
import Link from "next/link";
import villaListing from "../../assets/villa-listing.jpg";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Input,
  Select,
  Typography,
  Option,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

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
    const countryParams = searchParams.get("country");
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get(uri_cities + "/" + countryParams, {
          withCredentials: true,
        });
        console.log("uri_cities", uri_cities + "/" + country);
        console.log("set cities", res.data.data);
        setCities(new Set(res.data.data.sort()));
      } catch (error) {
        console.error("Error fetching villas:", error);
      }
    };
    console.log("use effect 2", countryParams);
    if (countryParams) {
      fetchCities();
    }
    fetchCountries();
    fetchVillas();
  }, [useSearchParams, searchParams]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get(uri_cities + "/" + country, {
          withCredentials: true,
        });
        setCities(new Set(res.data.data.sort()));
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
  const handleCityChange = (value: string | undefined) => {
    if (value) {
      setCity(value);
    }
  };
  return (
    <div className="">
      <div className="relative">
        <img
          src={villaListing.src}
          alt=""
          className="mb-8 rounded-md shadow-lg w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute hidden md:block top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold">
          Lorem Ipsum Dolor sir Amet
        </div>
        <Card
          className="absolute top-1/2 md:top-2/3 md:top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white"
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
      <div className="container mx-auto z-1 p-5 md:px-20 mt-5">
        <div className="mb-2 flex flex-row justify-end items-center">
          <Select
            label="Items per page"
            id="itemsPerPage"
            value={searchParams.get("itemsPerPage") || "10"}
            onChange={(e) =>
              router.push(
                pathName + "?" + createQueryString("itemsPerPage", e as string)
              )
            }
            placeholder=""
          >
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {villas.map((villa, index) => (
                <Card
                  key={index}
                  className="bg-white rounded-md overflow-hidden flex flex-col md:flex-row shadow-md"
                  placeholder={"villa"}
                >
                  <CardHeader
                    color="blue"
                    placeholder={"image"}
                    className="relative h-56"
                  >
                    <Link href={"villa/" + villa.id}>
                      {villa.images && villa.images.length > 0 && (
                        <img
                          src={displayImage(villa.images[0].data.data)}
                          alt={villa.name}
                          // className="w-full h-full md:w-96 md:h-auto object-cover"
                        />
                      )}
                    </Link>
                  </CardHeader>
                  <CardBody
                    className="p-4 flex flex-row justify-between w-full items-center"
                    placeholder={""}
                  >
                    <Link href={"villa/" + villa.id}>
                      <h2 className="text-xl font-bold mb-2">{villa.name}</h2>
                      <p className="text-gray-700 mb-2">
                        {villa.short_description}
                      </p>
                      <p className="text-tertiary font-bold">
                        ${villa.price}/night
                      </p>
                    </Link>
                    <Button className="px-2 bg-tertiary" placeholder={""}>
                      <Link
                        href={`/villa/checkout/${villa.id}`}
                        // className="bg-tertiary text-white rounded-md px-3 py-2"
                      >
                        Book Now
                      </Link>
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </div>
        <div className="flex justify-center mt-4 mb-4 items-center">
          <Button
            onClick={() => {
              const currentPage = parseInt(searchParams.get("page") || "1");
              router.push(
                pathName +
                  "?" +
                  createQueryString("page", (currentPage - 1).toString())
              );
            }}
            disabled={Number(searchParams.get("page") || 1) === 1}
            placeholder={"Previous Page"}
            className="bg-primary"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <Typography className="mx-2" placeholder={"Page"}>
            Page {searchParams.get("page") || 1}
          </Typography>
          <Button
            onClick={() => {
              const currentPage = parseInt(searchParams.get("page") || "1");
              router.push(
                pathName +
                  "?" +
                  createQueryString("page", (currentPage + 1).toString())
              );
            }}
            placeholder={"Next Page"}
            disabled={
              villas.length < parseInt(searchParams.get("itemsPerPage") || "10")
            }
            className="bg-primary"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default VillaListing;
