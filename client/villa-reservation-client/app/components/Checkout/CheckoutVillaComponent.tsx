"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/app/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button
} from "@material-tailwind/react";
import { FaMinus, FaPlus } from 'react-icons/fa';


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
function CheckoutVillaComponent() {
  const axiosInstance = useAxiosPrivate();
  const router = useRouter();
  const usePathName = usePathname();
  const [villa, setVilla] = useState<Villa>();
  const [userId, setUserId] = useState<String>();
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);

  const id = usePathName.split("/").pop();
  // console.log("id", id);
  const uri = process.env.SERVER_URL + "/api/villa/" + id;
  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const res = await axiosInstance.get(uri, { withCredentials: true });
        setVilla(res.data.data);
      } catch (error) {
        console.error("Error fetching villas:", error);
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
  const calculateTotal = () => {
    if (checkInDate && checkOutDate && villa) {
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = nights * villa.price * guests;
      setTotal(totalAmount);
    }
  };
  useEffect(() => {
    calculateTotal();
  }, [checkInDate, checkOutDate, guests]);
  const handleSubmit = async () => {
    if (checkInDate && checkOutDate && villa) {
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = nights * villa.price * guests;
      const reservation = {
        userId: userId,
        villaId: villa.id,
        numberOfGuests: guests,
        checkIn: new Date(checkInDate.setHours(0, 0, 0, 0)).toISOString(),
        checkOut: new Date(checkOutDate.setHours(0, 0, 0, 0)).toISOString(),
        price: totalAmount,
      };
      console.log("reservation", reservation);
      try {
        const res = await axiosInstance.post(
          process.env.SERVER_URL + "/api/transaction",
          reservation,
          { withCredentials: true }
        );
        console.log(res);
        router.push("/booking/" + res.data.data.id);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(
          process.env.SERVER_URL + "/api/info",
          {
            withCredentials: true,
          }
        );
        setUserId(res.data.data.id);
        // console.log("USer IDDD", res.data.data.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-5 md:px-20">
      <div className="">
        <Typography
          placeholder="Header"
          className="font-bold text-4xl text-center mb-10 pt-5"
        >
          Checkout
        </Typography>
        {/* Display Villa */}
        {villa ? (
          <Card
            className="flex flex-col md:flex-row bg-bg2 rounded-md shadow-md"
            placeholder={""}
          >
            <CardHeader placeholder={""} className="">
              <img
                src={displayImage(villa.images[0].data.data)}
                alt="Villa"
                className="rounded-md w-full h-[35vh] mr-5 object-cover"
              />
            </CardHeader>
            <CardBody
              className="flex flex-col justify-center items-center md:items-start"
              placeholder={""}
            >
              <h2 className="font-bold mb-2">{villa.name}</h2>
              <p className="mb-2">{villa.address}</p>
              <p className="mb-2">{villa.description}</p>
              <p className="mb-2">$ {villa.price}</p>
            </CardBody>
            {/* <div className="flex flex-col justify-center items-center md:items-start">
              <h2 className="font-bold mb-2">{villa.name}</h2>
              <p className="mb-2">{villa.address}</p>
              <p className="mb-2">{villa.description}</p>
              <p className="mb-2">$ {villa.price}</p>
            </div> */}
          </Card>
        ) : (
          <div>Loading...</div>
        )}
        {/* Check In */}
        <div className="flex flex-col md:flex-row w-full bg-white rounded-md p-4 mt-5 shadow-lg justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-2">Check In</div>
            <DatePicker
              selected={checkInDate}
              onChange={(date: Date) => setCheckInDate(date)}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              maxDate={checkOutDate}
              customInput={
                <button className="bg-primary text-white px-4 py-2 rounded-md flex flex-row items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {/* if checkindate != null then div appear*/}
                  {checkInDate && (
                    <div className="ml-2">
                      {checkInDate.toLocaleDateString()}
                    </div>
                  )}
                </button>
              }
            />
          </div>
          {/* Check Out */}
          <div className="flex flex-col items-center">
            <div className="mb-2">Check Out</div>
            <DatePicker
              selected={checkOutDate}
              onChange={(date: Date) => setCheckOutDate(date)}
              minDate={checkInDate}
              dateFormat="dd-MM-yyyy"
              customInput={
                <button className="bg-primary text-white px-4 py-2 rounded-md flex flex-row items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {checkOutDate && (
                    <div className="ml-2">
                      {checkOutDate.toLocaleDateString()}
                    </div>
                  )}
                </button>
              }
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2">Guest</div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setGuests(guests - 1)}
                disabled={guests <= 1}
                className="bg-primary hover:bg-orange-700 text-white font-bold  rounded"
                placeholder={"minus button"}
              >
                <FaMinus />
              </Button>
              <span className="text-xl">{guests}</span>
              <Button
                onClick={() => setGuests(guests + 1)}
                className="bg-primary hover:bg-orange-700 text-white font-bold rounded"
                placeholder={"plus button"}
              >
                <FaPlus />
              </Button>
            </div>
          </div>
        </div>

        {/* Guest */}

        {/* Total */}
        <div className="flex flex-row items-center justify-between bg-white mt-5 p-5">
          <div className="text-xl">Total : $ {total}</div>
          <Button
            className="px-5 py-2 bg-primary rounded-md text-white"
            onClick={handleSubmit}
            placeholder={"book button"}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutVillaComponent;
