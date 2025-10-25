import React from "react";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <div>
      <footer className="bg-[#092143] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1  md:grid-cols-3 gap-8">
          <div>
            <img
              src="/image/global-logo.png"
              alt="teachers training in Kolkata"
              className="w-24 h-24 mb-4"
            />
            <p className="text-sm">
              Based in India, Global Technical Institute (GTI) is a leading
              technical education hub offering diverse courses and training
              programs. Our focus is on empowering individuals with practical
              skills and knowledge essential for workforce success.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <div>
                  <h4 className="font-semibold text-2xl flex gap-4">
                    {" "}
                    <IoIosMail /> <span>Email:</span>{" "}
                  </h4>
                  <p>global.technical8.institute@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div>
                  <h4 className="font-semibold text-2xl flex gap-4">
                    <FaPhoneAlt />
                    <span> Phone:</span>
                  </h4>
                  <p>8961008489</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div>
                  <h4 className="font-semibold text-2xl flex gap-4">
                    {" "}
                    <FaLocationDot />
                    <span>Address:</span>
                  </h4>
                  <p>
                    Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085
                    <br />
                    Landmark: Near Surah Kanya Vidyalaya.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Connect With Us</h2>
            <div className="flex space-x-4 text-white text-lg">
              <Link
                href="http://facebook.com/gtitrainingcourse"
                target="_blank"
                className="inline-block transform transition-transform duration-300 hover:scale-110"
              >
                <i className="fab fa-facebook-f text-4xl">
                  <CiFacebook />
                </i>
              </Link>
              <Link
                href="http://instagram.com/globaltechnicalinstitute/"
                target="_blank"
                className="inline-block transform transition-transform duration-300 hover:scale-110"
              >
                <i className="fab fa-instagram text-4xl">
                  <FaInstagram />
                </i>
              </Link>
              <Link
                href="http://api.whatsapp.com/send/?phone=919231551285"
                target="_blank"
                className="inline-block transform transition-transform duration-300 hover:scale-110"
              >
                <i className="fab fa-whatsapp text-4xl">
                  <FaWhatsapp />
                </i>
              </Link>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">USEFUL LINKS</h2>
              <Link
                href="/login"
                className=" flex justify-between transition-transform duration-300 hover:scale-105"
              >
                <img src=" /image/log-in.png" className="h-8 w-auto" />
                <h2 className="text-xl font-semibold mb-4">Login</h2>
              </Link>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/our-speciality" className="hover:underline">
                  Our Speciality
                </Link>
              </li>
              <li>
                <Link href=" /placement" className="hover:underline">
                  Our Placements
                </Link>
              </li>
              <li>
                <Link href=" /blog" className="hover:underline">
                  Our Blog
                </Link>
              </li>
              <li>
                <Link href=" /ourGallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/news-events" className="hover:underline">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href=" /contact-us" className="hover:underline">
                  Contact us
                </Link>
              </li>
              <li>
                <div className=" flex  w-auto   ">
                  <p>Privacy Policy</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <hr className="w=11/12 mt-2" />

        <div className="flex justify-center items-center p-3">
          <div >
            {" "}
            2025 Global Technical Institute, All Rights Reserved. | Developed by{" "}
            <div className="text-center">
              <Link
                className="text-lg text-green-300"
                href="https://ommdigitalsolution.com/"
              >
                Omm Digital Solution.
              </Link>{" "}
            </div>{" "}
          </div>
          {/* <div className="hidden md:flex  w-/12 md:w-1/12 ">
            {" "}
            Privacy Policy
          </div> */}
        </div>
      </footer>
    </div>
  );
}

export default Footer;
