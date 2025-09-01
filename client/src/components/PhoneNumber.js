import React, { useEffect, useState } from "react";

function PhoneNumber() {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const careerTexts = ["Career", "Future", "Dream Job", "Path", "Opportunity"];

  useEffect(() => {
    const typeText = () => {
      const fullText = careerTexts[textIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex <= fullText.length) {
          setCurrentText(fullText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            // Erase text
            const eraseInterval = setInterval(() => {
              if (charIndex > 0) {
                setCurrentText(fullText.slice(0, charIndex - 1));
                charIndex--;
              } else {
                clearInterval(eraseInterval);
                setTextIndex((prev) => (prev + 1) % careerTexts.length);
              }
            }, 10);
          }, 2000);
        }
      }, 10);
    };

    typeText();
  }, []);

  return (
    <div>
      <div className="flex relative justify-center w-full z-12">
        <section className="bg-blue-500 py-1  w-12/12 md:w-[96%]   ">
          <div className="container mx-auto flex flex-col md:flex-row items-center ">
            <div className="w-full md:w-1/2 text-center  md:text-left">
              <p className="text-3xl font-bold text-gray-100 md:pl-5 pt-3 md:p-0  ">
                Discover Your Idea
                <br className="  md:hidden flex" />
                <span className="text-gray-100 typed-text">
                  <span className="cursor text-5xl">&nbsp;</span>
                  {currentText}
                </span>
                {/* <span className="cursor text-5xl">|</span> */}
              </p>
            </div>

            <div className="w-full md:w-1/2 rounded-lg md:p-6 pl-2 pr-2 pb-3">
              <p className="text-lg font-medium text-gray-100 mt-4">
                <i className="fas fa-mobile-alt text-blue-500 mr-2"></i> Your
                Phone Number
              </p>
              <form
                method="POST"
                action="#"
                className="flex flex-col md:flex-row items-center gap-4 "
              >
                <input
                  type="tel"
                  name="phone"
                  placeholder="(+91) 9800000000"
                  required
                  maxLength="15"
                  className="flex-1 w-full px-4 py-2  border rounded-4xl border-gray-300  focus:ring-2 focus:ring-gray-400 shadow-xl bg-gray-100 focus:outline-none"
                />

                <button
                  type="submit"
                  className="bg-gray-100 text-gray-800 px-4 shadow-xl py-1 md:px-6 md:py-2 font-semibold rounded-4xl transition-all"
                >
                  Cal Me Back
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PhoneNumber;
