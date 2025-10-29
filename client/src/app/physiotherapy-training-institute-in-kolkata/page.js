"use client";
import React, { useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaMinus, FaPlus } from "react-icons/fa";

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
            Physiotherapy Training
          </div>
          {montessoriTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="image/physiotherapy/physio-tra01.jpg"
                  alt="jun-teach02"
                  className="w-full rounded-lg shadow-md"
                />
                <img
                  src="image/physiotherapy/WhatsApp-Image-2024-11-16-at-4.45.39-PM-1063x800.jpeg"
                  alt="jun-teach03"
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              <div className="md:col-span-7">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
                  <tbody>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">COURSE NAME:</td>
                      <td className="px-4 py-2">Physiotherapy Training</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                      <td className="px-4 py-2">
                        1) Certificate in Physiotherapy
                        <br />
                        2) Diploma in Physiotherapy
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        COURSE DURATION:
                      </td>
                      <td className="px-4 py-2"> 1 or 2 Years</td>
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
                        3 Sessions (March, July, November)
                      </td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO.OF CLASSES:
                      </td>
                      <td className="px-4 py-2">2 Classes per week</td>
                    </tr>

                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        MINIMUM QUALIFICATION:
                      </td>
                      <td className="px-4 py-2">Madhyamik</td>
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
            Bachelor of Physiotherapy
          </div>
          {seniorTeachers && (
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
              <div className="md:col-span-5 space-y-6">
                <img
                  src="/image/physiotherapy/glob-phisio.jpg"
                  alt="Senior Teacher Training"
                  className="rounded-lg shadow-md w-full max-w-md"
                />
                <img
                  src="/image/physiotherapy/WhatsApp-Image-2024-11-10-at-2.08.14-PM-1-1063x800.jpeg"
                  alt="Senior Teacher Training"
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>

              <div className="md:col-span-7">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
                  <tbody>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">COURSE NAME:</td>
                      <td className="px-4 py-2">
                        Васhelor in Physiotherapy (BPT)
                      </td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                      <td className="px-4 py-2">
                        Bachelor in Physiotherapy
                        <br />
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        COURSE DURATION:
                      </td>
                      <td className="px-4 py-2">4 years, 6 Months</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        BOARD AND RECOGNITION:
                      </td>
                      <td className="px-4 py-2">
                        1) ISO Certified Global Technical Institute
                        <br />
                        2) UGC Approved Universities
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">SESSION:</td>
                      <td className="px-4 py-2">1 Session (Aug-Sept)</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO.OF CLASSES:
                      </td>
                      <td className="px-4 py-2">4 classes per weeks</td>
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
                        2) Attested Copies of Last Passed Marksheet
                        <br />
                        3) Madhyamik Admit Card
                        <br />
                        4) Any Photo ID Proof
                        <br />
                        5) Migration Certificate (Original)
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

      <section
        id="physiotherapy-training"
        className="bg-gray-50 py-12 px-4 text-gray-800"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <p>
            Welcome to <strong>Global Technical Institute</strong>, the best{" "}
            <a
              href="https://globaltechnicalinstitute.com/"
              className="text-blue-600 hover:underline"
            >
              Physiotherapy Training Institute in Kolkata
            </a>
            ! We are dedicated to providing comprehensive and high-quality
            training in physiotherapy. The Government of India recognizes and
            promotes our courses through the Board of Secondary Education
            Society (BSS). Additionally, we are proud to hold an ISO
            certification, ensuring our commitment to global standards, and we
            are affiliated with the National Skill Development Corporation
            (NSDC).
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            Our Physiotherapy Training Institute In Kolkata program offers two
            levels of certification:
          </h2>

          <p>
            <strong>Certificate in Physiotherapy</strong> and{" "}
            <strong>Diploma in Physiotherapy</strong>. The duration of the
            course can be completed within 1 or 2 years, depending on your
            preference and availability. We offer three sessions throughout the
            year, starting in
            <strong> March, July, and November</strong>, allowing you the
            flexibility to choose the best time to begin your training.
          </p>

          <p>
            Classes are held twice a week to accommodate your schedule,
            providing a balance between theory and practical sessions. Our
            experienced faculty members ensure a comprehensive learning
            experience covering all physiotherapy aspects, from fundamental
            principles to advanced techniques.
          </p>

          <p>
            To enroll in our{" "}
            <a
              href="https://globaltechnicalinstitute.com/physiotherapy-training-institute-in-kolkata"
              className="text-blue-600 hover:underline"
            >
              Physiotherapy Training Institute in Kolkata
            </a>
            , the minimum qualification required is <strong>Madhyamik</strong>.
            We require a few documents for the admission process, including six
            copies of your recent photograph, attested copies of your last
            pass-out mark sheet, Madhyamik’s admit card, and any valid photo
            identification proof.
          </p>

          <div className="flex justify-center">
            <img
              src="/image/physiotherapy/phy2-400x300.jpg"
              alt="Physiotherapy training session"
              className="rounded-lg shadow-md w-full max-w-md"
              loading="lazy"
            />
          </div>

          <p>
            At Global Technical Institute, we believe in holistic development,
            so we offer special modules for skill development. Our{" "}
            <strong>Personality Development and Grooming</strong> sessions aim
            to enhance your interpersonal skills, communication abilities, and
            overall professional demeanor. These sessions will equip you with
            the necessary skills to excel in your career as a physiotherapist.
          </p>

          <p>
            By choosing <strong>Global Technical Institute</strong> for your{" "}
            <div className="text-gray-600">
              Physiotherapy Training Institute in Kolkata
            </div>
            , you are making a wise decision to receive quality education and
            training from a reputable institution. Join us today and embark on a
            rewarding journey towards a successful career in physiotherapy.
            Contact us now to learn more about our courses and admission process
            and to book your seat in the upcoming session.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
