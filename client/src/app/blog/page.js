"use client";
import React, { useEffect, useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
// import { XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
// import Image from "next/image";

// const responsive2 = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 1,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 1,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  // const openImage = (src) => {
  //   setImgSrc(src);
  //   setIsOpen(true);
  // };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setImgSrc(""), 300); // Delay clearing src until after animation
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-300 overflow-hidden top-0 z-0">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/image/instit.jpg')" }} // replace with your image path
        ></div>
        <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
          <h1 className="text-5xl font-bold">Our Blog</h1>
        </div>
      </div>

      <article className="w-full lg:w-1/4  md:w-1/3 h-4/6 p-4">
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
          <figure className="relative">
            <Link href="#">
              <img
                src="image/blog1.jpg"
                alt="Nursing Institute in Kolkata"
                className="w-full h-auto object-cover"
              />
            </Link>
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              <span>Jul 02</span>
            </div>
          </figure>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">
              Blog, Nursing Training Institute in Kolkata
            </p>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
              <Link href="#">
                Why Studying at a Reputed Nursing Institute in Kolkata Boosts
                Your Future?
              </Link>
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <span>By admin</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              In today’s rapidly growing healthcare sector, the demand for
              trained and qualified nurses is higher than ever...
            </p>
            <div className="mt-4">
              <Link
                href="#"
                className="text-blue-600 hover:underline font-semibold text-sm"
              >
                Continue reading
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
