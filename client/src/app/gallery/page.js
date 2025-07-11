"use client";
import React, { useEffect, useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import AOSProvider from "@/components/AOSProvider";

const responsive2 = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  const openImage = (src) => {
    setImgSrc(src);
    setIsOpen(true);
  };

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
      <AOSProvider>

   
      <Navbar />
      <div className="relative bg-gray-300 overflow-hidden top-0 z-0">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/image/instit.jpg')" }} // replace with your image path
        ></div>
        <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
          <h1 className="text-5xl font-bold">Gallery</h1>
        </div>
      </div>

      <Gallery />

      {/* <section>
        <div>
          <div className="text-center mb-8">
            <h4 className="text-2xl font-semibold ">Annual Programme</h4>
            <div className="flex justify-center">
              <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
            </div>
          </div>
          <div className="flex justify-center">
            <p className="w-11/12">
              Gallery consisting of clicks from our Annual Programme. Contact us
              to be a part of our family.
            </p>
          </div>
          <div id="about" className="w-full bg-gray-100 py-12 px-4">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex justify-center ">
                <img
                  height={512}
                  width={512}
                  alt=""
                  // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  src="image/anu13.jpg"
                  className="h-40 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openImage("image/anu13.jpg")}
                />
              </div>
              <div className="flex justify-center ">
                <img
                  height={512}
                  width={512}
                  alt=""
                  // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  src="image/anu03.jpg"
                  className="h-40 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openImage("image/anu03.jpg")}
                />
              </div>
              <div className="flex justify-center ">
                <img
                  height={512}
                  width={512}
                  alt=""
                  // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  src="image/anu04.jpg"
                  className="h-40 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openImage("image/anu04.jpg")}
                />
              </div>
              <div className="flex justify-center ">
                <img
                  height={512}
                  width={512}
                  alt=""
                  // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  src="image/anu08.jpg"
                  className="h-40 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openImage("image/anu08.jpg")}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <h4 className="text-2xl font-semibold ">Our Excursion</h4>
            <div className="flex justify-center">
              <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
            </div>
          </div>
          <div className="flex justify-center">
            <p className="w-11/12">
              Gallery consisting of clicks from our Excursions. Contact us to be
              a part of our family.
            </p>
          </div>
          <div id="about" className="w-full bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            </div>
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <h4 className="text-2xl font-semibold ">
              {" "}
              Ceremony for Diploma Certificate Distribution
            </h4>
            <div className="flex justify-center">
              <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
            </div>
          </div>
          <div className="flex justify-center">
            <p className="w-11/12">
              Gallery consisting of clicks from our Diploma Certification
              Ceremonies. Contact us to be a part of our family.
            </p>
          </div>
          <div id="about" className="w-full bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
      <BackToTopButton />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center 
         z-50"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
            onClick={closeModal}
          >
            <XMarkIcon aria-hidden="true" className="size-6" />
          </button>
          <img
            src={imgSrc}
            alt="Full view"
            className={`max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg border-4 border-white transform transition-all duration-300 scale-100 opacity-100 ${
              isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />
        </div>
      )}
       </AOSProvider>
    </>
  );
}

export default page;
