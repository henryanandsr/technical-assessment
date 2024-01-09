import React from "react";
import aboutUs from "../../assets/aboutUs.webp";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
function AboutUsComponents() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center m-20">
      {/* Image on the left */}
      <Image
        src={aboutUs.src}
        alt="Villa Image"
        className="w-full md:w-1/2 rounded-md shadow-lg object-cover mb-8 md:mb-0 md:mr-8"
      />
      {/* Text on the right */}
      <div className="w-full md:w-1/2 p-8">
        <p className="text-gray-700 mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry
        </p>
        <p className="text-gray-700 mb-10">
          {" "}
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.{" "}
        </p>
        <Button placeholder={"About Us"} className="px-7 py-3 bg-primary text-white">
          <Link href="/aboutus">
            About Us
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default AboutUsComponents;
