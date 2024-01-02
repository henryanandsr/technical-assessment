"use client";
import useAxiosPrivate from "@/app/utils/api";
import Link from "next/link";
import { use, useEffect, useState } from "react";
interface Transaction {
  id: string;
  userId: string;
  villaId: string;
  numberOfGuests: Number;
  checkIn: Date;
  checkOut: Date;
  price: Number;
  confirmed: Boolean;
  createdAt: Date;
  updatedAt: Date;
  villa: Villa;
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

function TransactionList() {
  const axiosInstance = useAxiosPrivate();
  const [userId, setUserId] = useState("");
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(process.env.SERVER_URL + "/api/info", {
          withCredentials: true,
        });
        const user = res.data.data;
        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        if (userId) {
          const res = await axiosInstance.get(
            process.env.SERVER_URL + "/api/transaction/user/" + userId,
            { withCredentials: true }
          );
          const transactions = res.data.data;
          setTransaction(transactions || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransaction();
  }, [userId]);

  const displayImage = (imageData: number[]) => {
    const uint8Array = new Uint8Array(imageData);
    const base64String = btoa(
      String.fromCharCode.apply(null, Array.from(uint8Array))
    );
    return `data:image/png;base64,${base64String}`;
  };
  return (
    <>
      <div>TransactionList</div>
      {transaction.map((transaction) => (
          <div key={transaction.id}>
              <Link href={"/booking/" + transaction.id}>
            {transaction?.villa.images &&
            transaction.villa.images.length > 0 ? (
              <img
                src={displayImage(transaction.villa.images[0].data.data)}
                alt={transaction.villa.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300"></div>
            )}{" "}
            <div>Villa Name : {transaction.villa.name}</div>
            <div>Number of Guest : {transaction.numberOfGuests.toString()}</div>
            <div>Check In Date : {transaction.checkIn.toLocaleString()}</div>
            <div>Check Out Date : {transaction.checkOut.toLocaleString()}</div>
            <div> Total Price : {transaction.price.toString()}</div>
            <div>Status : {transaction.confirmed.toString()}</div>
            <div>Order At : {transaction.createdAt.toLocaleString()}</div>
            {/* <div>{transaction.updatedAt}</div> */}
        </Link>
          </div>
      ))}
    </>
  );
}

export default TransactionList;
