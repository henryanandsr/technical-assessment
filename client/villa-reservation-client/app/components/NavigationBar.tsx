"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosPrivate from "@/app/utils/api";
import Cookies from "js-cookie";
import { handleLogout } from "@/app/utils/auth";
import Link from "next/link";

function NavigationBar() {
  const axiosInstance = axiosPrivate();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if the user is logged in based on the presence of the access token
    const serverUrl = process.env.SERVER_URL + "/api/info";
    const accessToken = Cookies.get("accessToken");

    // If the access token is present, fetch user info
    axiosInstance
      .get(serverUrl, { withCredentials: true })
      .then((response) => {
        const res = response.data;
        console.log("get info");
        setName(res.data.name);
        setLoggedIn(true);
      })
      .catch((error) => {
        setLoggedIn(false);
      });
  }, [loggedIn]);

  const handleLogoutButton = async () => {
    const res = await handleLogout();
    console.log(res);
    if (res.status === "success") {
      router.push("/");
      setLoggedIn(false);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="text-white font-bold text-xl">Your Logo</div>

        {/* Navigation Links */}
        <div className="space-x-4">
          {loggedIn ? (
            <>
              <Link href="/villa" className="text-white">
                {/* <a className="text-white hover:text-gray-300">Villa</a> */}
                Villa
              </Link>
              <Link href="/booking" className="text-white">
                Booking
              </Link>
              <span className="text-white">Welcome, {name}</span>
              <button
                onClick={handleLogoutButton}
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white">
                Sign In
              </Link>
              <Link href="/register" className="text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
