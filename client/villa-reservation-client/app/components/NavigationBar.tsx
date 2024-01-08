"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosPrivate from "@/app/utils/api";
import Cookies from "js-cookie";
import { handleLogout } from "@/app/utils/auth";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Select,
  Option,
} from "@material-tailwind/react";

function NavigationBar() {
  const axiosInstance = axiosPrivate();
  const [openNav, setOpenNav] = useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
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
  const navList = loggedIn ? (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link href="/villa?page=1&itemsPerPage=10" className="text-black">
        VILLA
      </Link>
      <Link href="/booking" className="text-black">
        BOOKING
      </Link>
      <div>
        <div className="peer flex flex-row space-x-2 items-center text-primary">
          <FontAwesomeIcon icon={faUser} />
          <div>{name}</div>
        </div>

        <div
          className="absolute hidden peer-hover:flex hover:flex
          flex-col bg-white drop-shadow-lg"
        >
          <Link
            href="/profile"
            className="text-white hover:text-gray-300 cursor-pointer bg-primary py-2 px-3"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </Link>
          <button
            onClick={handleLogoutButton}
            className="text-white hover:text-gray-300 cursor-pointer bg-primary py-2 px-3"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </ul>
  ) : (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link href="/login">
        <Button
          placeholder="Sign In"
          className="bg-white text-black text-primary shadow-none"
        >
          SIGN IN
        </Button>
      </Link>

      <Link href="/register">
        <Button placeholder="Sign Up" className="bg-primary">
          SIGN UP
        </Button>
      </Link>
    </ul>
  );
  return (
    <Navbar
      className="sticky top-0 z-10 h-max max-w-full px-4 py-6 lg:px-8 lg:py-4"
      placeholder="Navbar"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <Link href="/">
          <Typography
            placeholder="Logo"
            className="text-tertiary font-bold text-xl"
          >
            LOGO
          </Typography>
        </Link>

        {/* Nav List */}
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-6">
          {navList}
        </div>

        <IconButton
          placeholder={"Menu"}
          variant="text"
          className="ml-auto h-6 w-6 text-inherit  lg:hidden text-primary"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          ) : (
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>{navList}</Collapse>
    </Navbar>
  );
}

export default NavigationBar;
