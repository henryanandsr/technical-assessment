import React from "react";
import aboutUs from "../../assets/aboutUs.webp";
import Link from "next/link";
function AboutUsComponents() {
  return (
    <div className="flex items-center justify-center m-20">
      {/* Image on the left */}
      <img
        src={aboutUs.src}
        alt="Villa Image"
        className="w-1/2 rounded-md shadow-lg object-cover"
      />

      {/* Text on the right */}
      <div className="w-1/2 p-8">
        <p className="text-gray-700 mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry
        </p>
        <p className="text-gray-700 mb-10">
          {" "}
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.{" "}
        </p>
        <Link href="/aboutus" className="px-7 py-3 bg-primary text-white">
          About Us
        </Link>
      </div>
    </div>
  );
}

export default AboutUsComponents;
