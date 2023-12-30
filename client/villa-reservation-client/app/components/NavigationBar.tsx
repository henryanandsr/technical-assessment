"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

function NavigationBar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if the user is logged in based on the presence of the access token
    const serverUrl = process.env.SERVER_URL + "/api/info";
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      // If the access token is present, fetch user info
      axios.get(serverUrl, {withCredentials: true})
        .then((response) => {
          const res = response.data;
          setName(res.data.name);
          setLoggedIn(true);
        })
        .catch((error) => {
          setLoggedIn(false);
        });
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Implement the logout logic (clear the access token, redirect, etc.)
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    router.push("/login");
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
              <a href="/villa" className="text-white hover:text-gray-300">Villa</a>
              <a href="/booking" className="text-white hover:text-gray-300">Booking</a>
              <span className="text-white">Welcome, {name}</span>
              <button onClick={handleLogout} className="text-white hover:text-gray-300 cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-white hover:text-gray-300">Sign In</a>
              <a href="/register" className="text-white hover:text-gray-300">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
