import { useState } from "react";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="flex justify-between items-center px-3 py-3">
      <div className="flex gap-4 items-center">
        <div>
          <img src={logo} alt="Logo" className="h-10 w-auto"></img>
        </div>
        <div className="hidden md:flex space-x-4">
          <a className="text-xl hover:cursor-pointer text-slate-600 hover:text-slate-900">
            Home
          </a>
          <a className="text-xl hover:cursor-pointer text-slate-600 hover:text-slate-900">
            About us
          </a>
          <a className="text-xl hover:cursor-pointer text-slate-600 hover:text-slate-900">
            Contact us
          </a>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="ctaBtn">
          <a href="http://localhost:5174">Book Now</a>
        </button>
        <div
          onClick={mobileMenu}
          className="space-y-1 rounded-lg md:hidden z-50"
        >
          <div className="w-14 h-2 bg-black rounded-lg"></div>
          <div className="w-14 h-2 bg-black rounded-lg"></div>
          <div className="w-14 h-2 bg-black rounded-lg"></div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full bg-gray-700 p-4 space-y-4">
          <a href="#" className="block text-white">
            Home
          </a>
          <a href="#about" className="block text-white">
            About Us
          </a>
          <a href="#apartments" className="block text-white">
            Our Apartments
          </a>
          <a href="#contact" className="block text-white">
            Contact Us
          </a>
          <button className="w-full bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600">
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
