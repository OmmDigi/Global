import { PhoneCall } from "lucide-react";
import React, { useEffect, useState } from "react";

function PhoneNumber() {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const careerTexts = ["Career", "Future", "Dream Job", "Path", "Opportunity"];

  return (
    <div>
      <div className="flex relative justify-center w-full z-12">
        <section className="bg-blue-500 py-1  w-12/12 md:w-[100%]   ">
          <div className="container mx-auto flex flex-col md:flex-row md:justify-around gap-2 md:py-3 ">
            <p className="text-xl md:text-3xl text-center font-bold text-gray-100 md:pl-5 pt-1 md:p-0  ">
              Don’t Just Study, Start Your Career.
            </p>
            {/* <p className="text-2xl font-bold text-gray-100 md:pl-5  md:p-0  "></p> */}
            {/* <span className="cursor text-5xl">|</span> */}

            {/* <p className="text-lg font-medium text-gray-100 mt-4">
                <i className="fas fa-mobile-alt text-blue-500 mr-2"></i> Your
                Phone Number
              </p> */}
            {/* <form
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
                  Call Me Back
                </button>
                </form> */}
            <div className="flex flex-col md:flex-row items-center mb-3 md:mb-0 ">
              <a
                href="tel:+919231551285"
                className="bg-gray-100 text-gray-800 px-4 shadow-xl py-1 md:px-6 md:py-2 font-semibold rounded-4xl transition-all flex items-center gap-4"
              >
                <PhoneCall size={20} />
                Call Us Today
                {/* Call Now Before It’s Too Late! */}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PhoneNumber;
