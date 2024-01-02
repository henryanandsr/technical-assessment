"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosPrivate from "@/app/utils/api";
import Cookies from "js-cookie";
import { handleLogout } from "@/app/utils/auth";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
    <nav className="bg-white p-8 fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <Link href="/">
          <div className="text-tertiary font-bold text-xl">LOGO</div>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-7">
          {loggedIn ? (
            <div className="flex flex-row items-center space-x-9">
              <Link href="/villa" className="text-black">
                VILLA
              </Link>
              <Link href="/booking" className="text-black">
                BOOKING
              </Link>
              <div>
                <div className="peer text-white flex flex-row space-x-2 items-center text-primary">
                  <FontAwesomeIcon icon={faUser} />
                  <div>{name}</div>
                </div>

                <div
                  className="absolute hidden peer-hover:flex hover:flex
         flex-col bg-white drop-shadow-lg"
                >
                  <button
                    onClick={handleLogoutButton}
                    className="text-white hover:text-gray-300 cursor-pointer bg-primary py-2 px-3"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-primary border border-primary px-7 py-4"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="text-white bg-primary px-7 py-4"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
