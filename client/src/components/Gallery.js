import React, { useState } from "react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-share.css";

export const Gallery = () => {
  const [activeGallery, setActiveGallery] = useState("annual");

  const galleryMap = {
    annual: galleryData1,
    sports: galleryData2,
    cultural: galleryData3,
  };

  const galleryButtons = [
    { key: "annual", label: "Annual Programme" },
    { key: "sports", label: "Our Excursion" },
    { key: "cultural", label: "Certificate Distribution" },
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
        elementClassNames="flex  flex-wrap gap-8  justify-center max-w-10xl mx-auto"
        plugins={[lgZoom, lgHash]}
        speed={500}
      >
        {galleryMap[activeGallery].map(({ src, thumb, html }, i) => (
          
            <a
              data-aos={ i%2 === 0 ? "fade-up" : "fade-down"} 
              key={i}
              data-lg-size="1400-1400"
              data-src={src}
              data-sub-html={html}
              className="w-[200px] h-[220px] overflow-hidden  shadow-md   hover:shadow-lg "
            >
              <img
                src={thumb}
                alt={`Gallery Image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/anu04.jpg",
    thumb: "/image/anu04.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  },
  {
    src: "/image/anu08.jpg",
    thumb: "/image/anu08.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11'>Katherine Gu</a></h4><p>For all those years we were alone and helpless.</p>",
  },
  {
    src: "/image/anu09.jpg",
    thumb: "/image/anu09.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11'>Katherine Gu</a></h4><p>For all those years we were alone and helpless.</p>",
  },
  {
    src: "/image/anu11.jpg",
    thumb: "/image/anu11.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11'>Katherine Gu</a></h4><p>For all those years we were alone and helpless.</p>",
  },
  {
    src: "/image/anu13.jpg",
    thumb: "/image/anu13.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11'>Katherine Gu</a></h4><p>For all those years we were alone and helpless.</p>",
  },
];
const galleryData2 = [
  {
    src: "/image/excu01.jpg",
    thumb: "/image/excu01.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu02.jpg",
    thumb: "/image/excu02.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu03.jpg",
    thumb: "/image/excu03.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu12.jpg",
    thumb: "/image/excu12.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu05.jpg",
    thumb: "/image/excu05.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  
  {
    src: "/image/excu06.jpg",
    thumb: "/image/excu06.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu07.jpg",
    thumb: "/image/excu07.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu08.jpg",
    thumb: "/image/excu08.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu09.jpg",
    thumb: "/image/excu09.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu10.jpg",
    thumb: "/image/excu10.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
  {
    src: "/image/excu11.jpg",
    thumb: "/image/excu11.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - <a href='https://unsplash.com/s/photos/fushimi-inari-taisha'>Kyoto, Japan</a></p>",
  },
];
const galleryData3 = [
  {
    src: "/image/certi-gal01.jpg",
    thumb:
      "/image/certi-gal01.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  },
   {
    src: "/image/certi-gal02.jpg",
    thumb:
      "/image/certi-gal02.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal03.jpg",
    thumb:
      "/image/certi-gal03.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal04.jpg",
    thumb:
      "/image/certi-gal04.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal05.jpg",
    thumb:
      "/image/certi-gal05.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal06.jpg",
    thumb:
      "/image/certi-gal06.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal07.jpg",
    thumb:
      "/image/certi-gal07.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal08.jpg",
    thumb:
      "/image/certi-gal08.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal09.jpg",
    thumb:
      "/image/certi-gal09.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  }, {
    src: "/image/certi-gal10.jpg",
    thumb:
      "/image/certi-gal10.jpg",
    html: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - <a href='https://unsplash.com/s/photos/shinimamiya'>Osaka, Japan</a></p>",
  },
 
];
