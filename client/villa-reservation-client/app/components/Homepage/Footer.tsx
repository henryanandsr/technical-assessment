import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <div className="bg-bg1 px-20 py-16">
      <div className="bg-bg1 grid grid-cols-3">
        <div className="text-4xl text-tertiary font-bold">LOGO</div>
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faPhone} className="text-tertiary mr-2 h-5" />
            +1 (123) 456-7890
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-tertiary mr-2 h-5" />
            info@example.com
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Additional Info</h2>
          <p>Address: 123 Main Street, Cityville</p>
          <p>Follow us on social media</p>
        </div>
      </div>
      <div className="text-center mt-10">
        © 2024 Destiny Hotels & VillasWebsite Design & Development by Island
        Media Management
      </div>
    </div>
  );
}

export default Footer;
