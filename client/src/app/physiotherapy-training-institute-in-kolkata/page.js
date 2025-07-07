"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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


  return (
    <>
      <Navbar />
          <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30" > 
            <h1 className="text-5xl font-bold">Physiotherapy Training</h1>
          </div>
     

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
