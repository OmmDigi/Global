"use client";
import React, { useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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
          <h1 className="text-5xl font-bold"> Nursing Training</h1>
        </div>
      </div>

      <div className="space-y-6 bg-white mt-10">
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-6">
          <div
            onClick={
              montessoriTeachers ? handleTeacherShow : handleTeacherClose
            }
            className="bg-blue-800 text-white px-4 py-3 font-bold text-lg flex cursor-pointer"
          >
            <div className="pr-4 pt-1">
              {montessoriTeachers ? <FaMinus /> : <FaPlus />}
            </div>
            Auxiliary Nursing Midwifery
          </div>
          {montessoriTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="image/nursing/nurse-tra01.jpg"
                  alt="jun-teach02"
                  className="w-full rounded-lg shadow-md"
                />
                <img
                  src="image/nursing/nurse-tra02a.jpg"
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
            <div className="pr-4 pt-1">
              {seniorTeachers ? <FaMinus /> : <FaPlus />}
            </div>
            General Nursing Midwifery
          </div>
          {seniorTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="/image/nursing/ANM-768x466.jpg"
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

 <section className="py-12 px-4 bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <p>
          Welcome to <strong>Global Technical Institute</strong> –{" "}
          <Link
            href="https://globaltechnicalinstitute.com/"
            className="text-blue-600 hover:underline font-semibold"
          >
            The Best Nursing Training Institute in Kolkata
          </Link>
        </p>

        <p>
          Are you passionate about healthcare and helping others? If so, our{" "}
          <strong>Auxiliary Nursing Midwifery (ANM)</strong> course at Global
          Technical Institute is the perfect choice for you. With a strong focus
          on practical skills and comprehensive theoretical knowledge, we offer
          a rewarding learning experience that prepares you for a successful
          career in patient care. As Kolkata’s leading{" "}
          <Link
            href="https://globaltechnicalinstitute.com/nursing-training-in-kolkata"
            className="text-blue-600 hover:underline font-semibold"
          >
            nursing training institute in Kolkata
          </Link>
          , we are committed to delivering quality education and shaping skilled
          healthcare professionals.
        </p>

        <h2 className="text-xl font-semibold mt-8">Course Overview:</h2>
        <p>
          Our Auxiliary Nursing Midwifery program is a comprehensive 2-year
          course designed to equip you with the skills and knowledge required in
          the healthcare industry. Upon successful completion, you will be
          awarded two certificates – a{" "}
          <strong>
            Diploma in Patient Care and a Government-Registered Certificate in
            Auxiliary Nursing Midwifery.
          </strong>{" "}
          The Government of India recognizes these certifications and holds
          immense value in the job market.
        </p>

        <h2 className="text-xl font-semibold mt-8">Board and Recognition:</h2>
        <div className="flex flex-col items-center">
          <Image
            src="/image/nursing/nurse03.webp"
            alt="nursing training institute in kolkata"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            Nursing training institute in Kolkata
          </p>
        </div>

        <p>
          At Global Technical Institute, we take pride in our affiliations and
          recognition. Our course is promoted by the Government of India through
          the Bharat Sevak Samaj (BSS), ensuring the highest education
          standards. Additionally, our institute holds ISO certification,
          further validating our commitment to quality training. We are also an
          affiliated partner of the{" "}
          <strong>National Skill Development Corporation (NSDC)</strong>, which
          opens up various career opportunities for our students.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          Course Structure and Schedule:
        </h2>
        <p>
          The ANM course consists of three sessions — January, May, and
          September. Each session spans two years, allowing you to complete the
          course at your own pace. We understand the importance of balancing
          your studies with other commitments, so we offer two weekly classes,
          ensuring flexibility and convenience for our students.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          Minimum Qualifications and Required Documents:
        </h2>
        <div className="flex flex-col items-center">
          <Image
            src="/image/nursing/nurse-4.jpeg"
            alt="nursing training institute in kolkata"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            Nursing training institute in Kolkata
          </p>
        </div>

        <p>
          To enroll in our ANM course, you must have at least passed the 10th
          grade. Please ensure you have the following documents ready:
        </p>

        <ol className="list-decimal pl-6 space-y-2">
          <li>Six copies of your recent passport-sized photographs.</li>
          <li>Attested copies of your last pass-out mark sheet.</li>
          <li>Madhyamik admit card.</li>
          <li>Any valid photo identification proof.</li>
        </ol>

        <h2 className="text-xl font-semibold mt-8">
          Special Modules for Skill Development:
        </h2>
        <p>
          We have included a special module on personality development and
          grooming sessions to enhance your overall growth and professionalism.
          These sessions focus on developing communication skills, building
          self-confidence, and presenting yourself effectively in a professional
          healthcare setting.
        </p>

        <p>
          Join{" "}
          <Link
            href="https://globaltechnicalinstitute.com/"
            className="text-blue-600 hover:underline font-semibold"
          >
            Global Technical Institute
          </Link>{" "}
          and embark on a fulfilling journey toward a rewarding career in
          patient care. Our comprehensive ANM course, recognized certifications,
          and dedicated faculty members ensure you receive the best education
          and training. Take the first step today by enrolling in our esteemed
          nursing training institute in{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Kolkata"
            className="text-blue-600 hover:underline"
          >
            Kolkata
          </Link>
          .
        </p>
      </div>
    </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
