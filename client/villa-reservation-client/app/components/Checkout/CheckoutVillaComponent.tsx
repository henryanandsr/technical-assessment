"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/app/utils/api";

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
        // console.log("res", res.data.data);
        // console.log("images", res.data.data.images);
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
        const res = await axiosInstance.get(process.env.SERVER_URL + "/api/info", {
          withCredentials: true,
        });
        setUserId(res.data.data.id);
        // console.log("USer IDDD", res.data.data.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div>Checkout Villa</div>
      {/* Display Villa */}
      {villa ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src={displayImage(villa.images[0].data.data)}
                alt="Villa"
                className="mb-8 rounded-md shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">{villa.name}</h2>
              <p className="text-xl mb-2">{villa.short_description}</p>
              <p className="text-xl mb-2">{villa.description}</p>
              <p className="text-xl mb-2">{villa.price}</p>
              <p className="text-xl mb-2">{villa.longitude}</p>
              <p className="text-xl mb-2">{villa.latitude}</p>
              <p className="text-xl mb-2">{villa.address}</p>
              <p className="text-xl mb-2">{villa.amenities}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {/* Check In */}
      <div>Check In</div>
      <input
        type="date"
        value={checkInDate?.toISOString().split("T")[0] || ""}
        onChange={(e) => setCheckInDate(new Date(e.target.value))}
      />
      {/* Check Out */}
      <div>Check Out</div>
      <input
        type="date"
        value={checkOutDate?.toISOString().split("T")[0] || ""}
        onChange={(e) => setCheckOutDate(new Date(e.target.value))}
      />

      {/* Guest */}
      <div>Guest</div>
      <div>
        <button onClick={() => setGuests(guests - 1)} disabled={guests <= 1}>
          -
        </button>
        <span>{guests}</span>
        <button onClick={() => setGuests(guests + 1)}>+</button>
      </div>
      {/* Total */}
      <div>Total : {total}</div>
      {/* Book Now */}
      <button onClick={handleSubmit}>Book Now</button>
    </>
  );
}

export default CheckoutVillaComponent;
