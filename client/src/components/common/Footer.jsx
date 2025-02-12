// import React from 'react';

// const Footer = () => {
//     return (
//         <footer className="bg-gray-800 text-white py-6 my-5">
// <div className="container mx-auto text-center">
//     <p className="mb-4">&copy; {new Date().getFullYear()} GYM Website. All rights reserved.</p>
//     <div className="flex justify-center space-x-4">
//         <a href="#" className="hover:text-gray-400">Privacy Policy</a>
//         <a href="#" className="hover:text-gray-400">Terms of Service</a>
//         <a href="/contact" className="hover:text-gray-400">Contact Us</a>
//     </div>
//     <p className='mt-2'>Made with <span className="text-yellow-300">&hearts;</span> Anurag Singh Rajput</p>
// </div>
//         </footer>
//     );
// };

// export default Footer;

//gpt code
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 w-11/12 text-white py-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section - Brand Name */}
        <div>
          <h2 className="text-2xl font-bold text-caribbeangreen-400">
            Anurag Gym
          </h2>
          <p className="text-gray-400 mt-2">
            Your fitness journey starts here!
          </p>
        </div>

        {/* Middle Section - Navigation Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link to="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
          <Link to="/membership" className="text-gray-400 hover:text-white">
            Membership
          </Link>
          <Link to="/gallery" className="text-gray-400 hover:text-white">
            Gallery
          </Link>
          <Link to="/trainers" className="text-gray-400 hover:text-white">
            Our Trainers
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white">
            Contact
          </Link>
        </div>

        {/* Right Section - Social Media & Contact */}
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaTwitter />
            </a>
          </div>
          <p className="text-gray-400 mt-4">📧 support@gym.com</p>
          <p className="text-gray-400">📞 +123 456 7890</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
        {/* &copy; {new Date().getFullYear()} Anurag Gym. All rights reserved. */}
      </div>

      <div className="container mx-auto text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} GYM Website. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact Us
          </a>
        </div>
        <p className="mt-2">
          Made with <span className="text-brown-600">&hearts;</span> Anurag
          Singh Rajput
        </p>
      </div>
    </footer>
  );
};

export default Footer;
