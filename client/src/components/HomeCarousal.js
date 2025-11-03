import Image from "next/image";
import React, { useEffect, useState } from "react";

const slides = [
  // { id: "slide-7263", image: "image/caros7.png" },
  { id: "slide-7262", image: "image/caros10.webp" },
  { id: "slide-7265", image: "image/caros11.png" },
  { id: "slide-8058", image: "image/caros12.webp" },
  // { id: "slide-7272", image: "image/caros14.png" },
  { id: "slide-8760", image: "image/caros15.png" },
  { id: "slide-8660", image: "image/caros17.png" },
];
function HomeCarousal() {
  const [current, setCurrent] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  //   useEffect(() => {
  //     const typeText = () => {
  //       const fullText = careerTexts[textIndex];
  //       let charIndex = 0;

  //       const typeInterval = setInterval(() => {
  //         if (charIndex <= fullText.length) {
  //           setCurrentText(fullText.slice(0, charIndex));
  //           charIndex++;
  //         } else {
  //           clearInterval(typeInterval);
  //           setTimeout(() => {
  //             // Erase text
  //             const eraseInterval = setInterval(() => {
  //               if (charIndex > 0) {
  //                 setCurrentText(fullText.slice(0, charIndex - 1));
  //                 charIndex--;
  //               } else {
  //                 clearInterval(eraseInterval);
  //                 setTextIndex((prev) => (prev + 1) % careerTexts.length);
  //               }
  //             }, 10);
  //           }, 2000);
  //         }
  //       }, 10);
  //     };

  //     typeText();
  //   }, [textIndex]);
  return (
    <div>
      {" "}
      {/* carousal */}
      <div className="relative w-full h-[200px] md:h-[400px]">
        <div className="absolute top-0  w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="slide-inner">
                  <Image
                    src={slide.image}
                    alt="slide"
                    className={`object-cover md:w-[500px] md:h-[380px] sm:w-[330px] sm:h-[200px] rounded-lg transition-transform duration-1000 ${
                      index === current ? "scale-105" : "scale-100"
                    }`}
                    width={1280}
                    height={1280}
                  />
                </div>
              </div>
              <div className="slide-bg absolute inset-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeCarousal;
