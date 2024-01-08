"use client";
import useAxiosPrivate from "@/app/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faUserFriends,
  faDollarSign,
  faMapMarkerAlt,
  faInfoCircle,
  faConciergeBell,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@material-tailwind/react";

interface Transaction {
  id: String;
  userId: String;
  villaId: String;
  numberOfGuests: Number;
  checkIn: Date;
  checkOut: Date;
  price: Number;
  confirmed: Boolean;
  createdAt: Date;
  updatedAt: Date;
  villa: Villa;
  user: User;
}
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
interface User {
  id: string;
  name: string;
}
function ConfirmationComponents() {
  const axiosInstance = useAxiosPrivate();
  const router = useRouter();
  const pathName = usePathname();
  const transactionId = pathName.split("/").pop();
  const [transaction, setTransaction] = useState<Transaction>();
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axiosInstance.get(
          process.env.SERVER_URL + "/api/transaction/" + transactionId,
          { withCredentials: true }
        );
        const transaction = res.data.data;
        const mappedTransaction = {
          id: transaction.id,
          userId: transaction.userId,
          villaId: transaction.villaId,
          numberOfGuests: transaction.numberOfGuests,
          checkIn: transaction.checkIn,
          checkOut: transaction.checkOut,
          price: transaction.price,
          confirmed: transaction.confirmed,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          villa: transaction.villa,
          user: transaction.user,
        };
        setTransaction(mappedTransaction);
        setTransaction(res.data.data);
        console.log(transaction.villa);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };
    fetchTransaction();
  }, [transactionId]);
  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    const base64String = btoa(
      String.fromCharCode.apply(null, Array.from(uint8Array))
    );
    return `data:image/png;base64,${base64String}`;
  };
  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.put(
        process.env.SERVER_URL + "/api/transaction/confirm/" + transactionId,
        {},
        { withCredentials: true }
      );
      router.push("/booking");
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };

  return (
    <div className="container mx-auto px-5 md:px-20">
      <div className="text-2xl mb-5 mt-5 font-bold">Confirmation Page</div>
      {transaction ? (
        <div className="flex flex-row bg-bg2 rounded-md shadow-md">
          <img
            src={displayImage(transaction.villa.images[0].data.data)}
            alt={transaction.villa.name}
            className="w-full h-[50vh] object-cover"
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="p-5 flex flex-col justify-center bg-white w-full md:w-1/2 mt-3 rounded-md">
          <div className="font-bold">Villa Information</div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Address : {transaction?.villa.address}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Price/night/person : {transaction?.villa.price}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Description : {transaction?.villa.description}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faConciergeBell} className="mr-2" />
            Amenities : {transaction?.villa.amenities.join(", ")}
          </div>
        </div>
        <div className="p-5 bg-white rounded-md w-full md:w-1/2 md:ml-3 mt-3 flex flex-col justify-center">
          <div className="font-bold">Booking Information</div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
            Check In :{" "}
            {new Date(transaction?.checkIn ?? "")
              .toLocaleDateString("ru", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .split(".")
              .join("/")}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
            Check Out :{" "}
            {transaction?.checkOut
              ? new Date(transaction.checkOut)
                  .toLocaleDateString("ru", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .split(".")
                  .join("/")
              : ""}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
            Total Guest : {transaction?.numberOfGuests.toString()}
          </div>
          <div className="text-sm flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Total Price : ${transaction?.price.toString()}
          </div>
        </div>
      </div>
      <Button
        className={`bg-tertiary w-full mt-4 py-2 rounded-md text-white ${
          transaction?.confirmed ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmit}
        disabled={!!transaction?.confirmed}
        placeholder={"Confirm"}
      >
        {transaction?.confirmed ? "Confirmed" : "Confirm"}
      </Button>
    </div>
  );
}

export default ConfirmationComponents;
