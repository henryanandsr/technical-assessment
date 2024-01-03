"use client";
import useAxiosPrivate from "@/app/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        const res = await axiosInstance.get(
          process.env.SERVER_URL + "/api/info",
          {
            withCredentials: true,
          }
        );
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
          let transactions = res.data.data;
          transactions = transactions.sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    <div className="container mx-auto py-8 pt-24 px-20">
      <h1 className="text-3xl font-bold mb-6">Transaction List</h1>
      {transaction.map((transaction) => (
        <Link key={transaction.id} href={`/booking/${transaction.id}`}>
          <div className="mb-6 p-4 bg-white shadow-md rounded-md cursor-pointer transition-transform transform flex flex-row">
            {transaction?.villa.images &&
            transaction.villa.images.length > 0 ? (
              <div className="w-1/2 mr-5">
                <img
                  src={displayImage(transaction.villa.images[0].data.data)}
                  alt={transaction.villa.name}
                  className="w-full h-[30vh] object-cover mb-4 rounded-md"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-300 mb-4 rounded-md"></div>
            )}
            <div className="flex flex-col justify-center">
              <div className="font-bold text-lg mb-2">
                {transaction.villa.name}
              </div>
              <div>
                Status:{" "}
                <span
                  className={
                    transaction.confirmed ? "text-green-700 font-bold" : "text-red-500 font-bold"
                  }
                >
                  {transaction.confirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div>
                Order At:{" "}
                {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>{" "}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default TransactionList;
