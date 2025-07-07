import React from "react";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
function Footer() {
  return (
    <div>
      <footer className="bg-[#092143] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/global-logo-150x150.png"
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
              <a href="http://facebook.com/gtitrainingcourse" target="_blank">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="http://instagram.com/globaltechnicalinstitute/"
                target="_blank"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="http://api.whatsapp.com/send/?phone=919231551285"
                target="_blank"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">USEFUL LINKS</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/about-us/"
                  className="hover:underline"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/our-speciality/"
                  className="hover:underline"
                >
                  Our Speciality
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/placement/"
                  className="hover:underline"
                >
                  Our Placements
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/blog/"
                  className="hover:underline"
                >
                  Our Blog
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/gallery/"
                  className="hover:underline"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/news-events/"
                  className="hover:underline"
                >
                  News & Events
                </a>
              </li>
              <li>
                <a
                  href="https://globaltechnicalinstitute.com/contact-us/"
                  className="hover:underline"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="w=11/12" />

        <div className="flex justify-between p-5">
          <div> 2024 Global Technical Institute</div>
          <div> Privacy Policy</div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
