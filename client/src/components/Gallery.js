import React, { useState } from "react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-share.css";
import Image from "next/image";

export const Gallery = () => {
  const [activeGallery, setActiveGallery] = useState("annual");

  const galleryMap = {
    annual: galleryData1,
    sports: galleryData2,
    cultural: galleryData3,
  };

  const galleryButtons = [
    { key: "cultural", label: "Certificate Distribution" },
    { key: "sports", label: "Our Excursion" },
    { key: "annual", label: "Annual Programme" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#e8f0ff] to-white text-[#0e3481] py-10 px-4">
      {/* <HeaderComponent /> */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {galleryButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveGallery(key)}
            className={`px-4 py-2 border rounded-full transition-all duration-200 ${
              activeGallery === key
                ? "bg-[#0e3481] text-white"
                : "bg-white text-[#0e3481] hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <LightGallery
        elementClassNames="flex  flex-wrap gap-4 md:gap-8 justify-center max-w-10xl mx-auto"
        plugins={[lgZoom, lgHash]}
        speed={500}
      >
        {galleryMap[activeGallery].map(({ src, thumb, html }, i) => (
          <a
            data-aos={i % 2 === 0 ? "fade-up" : "fade-down"}
            key={i}
            data-lg-size="1400-1400"
            data-src={src}
            data-sub-html={html}
            className=" md:w-[200px] md:h-[220px] w-[150px] h-[160px] overflow-hidden  shadow-md   hover:shadow-lg "
          >
            <Image
              src={src}
              alt={`Gallery Image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              width={100}
              height={100}
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
};

const HeaderComponent = () => (
  <div className="text-center flex flex-col items-center mt-4 mb-4">
    <h1 className="text-xl md:text-2xl font-semibold mt-4 mb-0">Gallery</h1>
  </div>
);

// Image list
const galleryData1 = [
  {
    src: "/image/anu03.jpg",
    thumb: "/image/anu03.jpg",
  },
  {
    src: "/image/anu04.jpg",
    thumb: "/image/anu04.jpg",
  },
  {
    src: "/image/anu08.jpg",
    thumb: "/image/anu08.jpg",
  },
  {
    src: "/image/anu09.jpg",
    thumb: "/image/anu09.jpg",
  },
  {
    src: "/image/anu11.jpg",
    thumb: "/image/anu11.jpg",
  },
  {
    src: "/image/anu13.jpg",
    thumb: "/image/anu13.jpg",
  },
];
const galleryData2 = [
  {
    src: "/image/excu01.jpg",
    thumb: "/image/excu01.jpg",
  },
  {
    src: "/image/excu02.jpg",
    thumb: "/image/excu02.jpg",
  },
  {
    src: "/image/excu03.jpg",
    thumb: "/image/excu03.jpg",
  },
  {
    src: "/image/excu12.jpg",
    thumb: "/image/excu12.jpg",
  },
  {
    src: "/image/excu05.jpg",
    thumb: "/image/excu05.jpg",
  },

  {
    src: "/image/excu06.jpg",
    thumb: "/image/excu06.jpg",
  },
  {
    src: "/image/excu07.jpg",
    thumb: "/image/excu07.jpg",
  },
  {
    src: "/image/excu08.jpg",
    thumb: "/image/excu08.jpg",
  },
  {
    src: "/image/excu09.jpg",
    thumb: "/image/excu09.jpg",
  },
  {
    src: "/image/excu10.jpg",
    thumb: "/image/excu10.jpg",
  },
  {
    src: "/image/excu11.jpg",
    thumb: "/image/excu11.jpg",
  },
];
const galleryData3 = [
  {
    src: "/image/certi-gal01.jpg",
    thumb: "/image/certi-gal01.jpg",
  },
  {
    src: "/image/certi-gal02.jpg",
    thumb: "/image/certi-gal02.jpg",
  },
  {
    src: "/image/certi-gal03.jpg",
    thumb: "/image/certi-gal03.jpg",
  },
  {
    src: "/image/certi-gal04.jpg",
    thumb: "/image/certi-gal04.jpg",
  },
  {
    src: "/image/certi-gal05.jpg",
    thumb: "/image/certi-gal05.jpg",
  },
  {
    src: "/image/certi-gal06.jpg",
    thumb: "/image/certi-gal06.jpg",
  },
  {
    src: "/image/certi-gal07.jpg",
    thumb: "/image/certi-gal07.jpg",
  },
  {
    src: "/image/certi-gal08.jpg",
    thumb: "/image/certi-gal08.jpg",
  },
  {
    src: "/image/certi-gal09.jpg",
    thumb: "/image/certi-gal09.jpg",
  },
  {
    src: "/image/certi-gal10.jpg",
    thumb: "/image/certi-gal10.jpg",
  },
];
