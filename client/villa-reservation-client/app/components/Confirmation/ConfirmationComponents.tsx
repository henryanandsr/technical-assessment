"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const pathName = usePathname();
  const transactionId = pathName.split("/").pop();
  const [transaction, setTransaction] = useState<Transaction>();
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(
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
      const res = await axios.put(
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
    <>
      <div>ConfirmationComponents</div>
      <div>Villa Name : {transaction?.villa.name}</div>
      <div>Address : {transaction?.villa.address}</div>
      <div>Price per night : {transaction?.villa.price}</div>
      <div>Description : {transaction?.villa.description}</div>
      <div>Amenities : {transaction?.villa.amenities.join(", ")}</div>
      {transaction?.villa.images && transaction.villa.images.length > 0 ? (
        <img
          src={displayImage(transaction.villa.images[0].data.data)}
          alt={transaction.villa.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300"></div>
      )}
      <div>Check In : {transaction?.checkIn.toLocaleString()}</div>
      <div>Check Out : {transaction?.checkOut.toLocaleString()}</div>
      <div>Total Guest : {transaction?.numberOfGuests.toString()}</div>
      <div>Total Price : {transaction?.price.toString()}</div>
      <button onClick={handleSubmit}>Confirm</button>
    </>
  );
}

export default ConfirmationComponents;
