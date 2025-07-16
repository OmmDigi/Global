"use client";
import React, { useState } from "react";
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
  const [montessoriTeachers, setMontessoriTeachers] = useState(true);
  const [seniorTeachers, setSeniorTeachers] = useState(false);

  const handleTeacherShow = () => {
    setMontessoriTeachers(false);
  };
  const handleTeacherClose = () => {
    setMontessoriTeachers(true);
  };
  const handleSeniorTeacherShow = () => {
    setSeniorTeachers(true);
  };
  const handleSeniorTeacherClose = () => {
    setSeniorTeachers(false);
  };

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
          <h1 className="text-5xl font-bold">Physiotherapy Training</h1>
        </div>
      </div>

      <div className="space-y-6 bg-white">
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-6">
          <div
            onClick={
              montessoriTeachers ? handleTeacherShow : handleTeacherClose
            }
            className="bg-blue-800 text-white px-4 py-3 font-bold text-lg flex cursor-pointer"
          >
            <img
              className="w-8 h-8 mr-5  cursor-pointer"
              src={montessoriTeachers ? "image/minus.png" : "image/plus.png"}
            />
            Auxiliary Nursing Midwifery
          </div>
          {montessoriTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="image/teacters-training3.jpg"
                  alt="jun-teach02"
                  className="w-full rounded-lg shadow-md"
                />
                <img
                  src="image/trachers-training4.jpg"
                  alt="jun-teach03"
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              <div className="md:col-span-7">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
                  <tbody>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">COURSE NAME:</td>
                      <td className="px-4 py-2">Auxiliary Nursing Midwifery</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                      <td className="px-4 py-2">
                        1) Diploma in Patient Care
                        <br />
                        2) Govt. Registered Certificate on Auxiliary Nursing
                        Midwifery
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        COURSE DURATION:
                      </td>
                      <td className="px-4 py-2">2 years</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        BOARD AND RECOGNITION:
                      </td>
                      <td className="px-4 py-2">
                        1) BSS Promoted by Govt. of India
                        <br />
                        2) ISO Certified Global Technical Institute
                        <br />
                        3) Affiliated Partner NSDC
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">SESSION:</td>
                      <td className="px-4 py-2">
                        3 sessions (January, May, September)
                      </td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO.OF CLASSES:
                      </td>
                      <td className="px-4 py-2">2 classes per week</td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">SESSION:</td>
                      <td className="px-4 py-2">
                        3 Sessions (March, July & November)
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        MINIMUM QUALIFICATION:
                      </td>
                      <td className="px-4 py-2">10 th pass.</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        DOCUMENTS REQUIRED:
                      </td>
                      <td className="px-4 py-2">
                        1) Photo (6 Copies)
                        <br />
                        2) Attested Copies of Last Passed Marksheet
                        <br />
                        3) Madhyamik Admit Card
                        <br />
                        4) Any Photo ID Proof
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="text-blue-800 font-semibold mb-2">
                    Special Modules for Skill Development:
                  </h4>
                  <p>Personality development and grooming session.</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-6">
          <div
            onClick={
              seniorTeachers
                ? handleSeniorTeacherClose
                : handleSeniorTeacherShow
            }
            className="bg-blue-800 text-white px-4 py-3 font-bold text-lg flex cursor-pointer"
          >
            <img
              className="w-8 h-8 mr-5  cursor-pointer"
              src={seniorTeachers ? "image/minus.png" : "image/plus.png"}
            />
            General Nursing Midwifery
          </div>
          {seniorTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/sin-teach01.jpg"
                  alt="Senior Teacher Training"
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>

              <div className="md:col-span-7">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
                  <tbody>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">COURSE NAME:</td>
                      <td className="px-4 py-2">General Nursing Midwifery</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                      <td className="px-4 py-2">
                        1) Diploma in Elementary Education
                        <br />
                        2) Govt. Registered Certificate on General Nursing
                        Midwifery
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        COURSE DURATION:
                      </td>
                      <td className="px-4 py-2">3 years 6 month</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        BOARD & RECOGNITION:
                      </td>
                      <td className="px-4 py-2">
                        1) BSS Promoted by Govt. of India
                        <br />
                        2) ISO Certified Global Technical Institute
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">SESSION:</td>
                      <td className="px-4 py-2">1 session (Aug-Sep)</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO. OF CLASSES:
                      </td>
                      <td className="px-4 py-2">3 classes per week</td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        MINIMUM QUALIFICATION:
                      </td>
                      <td className="px-4 py-2">H.S pass</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        DOCUMENTS REQUIRED:
                      </td>
                      <td className="px-4 py-2">
                        1) Photo (6 Copies)
                        <br />
                        2) Last Passed Mark Sheet (Attested)
                        <br />
                        3) Madhyamik Admit Card
                        <br />
                        4) Any Photo ID Proof
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="text-blue-800 font-semibold mb-2">
                    Special Modules for Skill Development:
                  </h4>
                  <p>Personality development and grooming session.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
