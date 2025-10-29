"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

function page() {
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
          <h1 className="text-5xl font-bold"> OT Technician Training</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/ot/ot1.jpg"
            alt="OT Training"
            className=" shadow-lg w-full object-cover"
          />
          <img
            src="/image/ot/ot_tehnician-400x300.webp"
            alt="OT Technician"
            className=" shadow-lg w-full object-cover"
          />
        </div>

        <div className="md:col-span-7">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="bg-blue-100 text-gray-900 font-semibold">
                  <td className="px-4 py-3 w-1/3">COURSE NAME:</td>
                  <td className="px-4 py-3">OT Technician Training</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">CERTIFICATE:</td>
                  <td className="px-4 py-3">
                    1) Certificate in OT Technician
                    <br />
                    2) Diploma in OT Technician
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">COURSE DURATION:</td>
                  <td className="px-4 py-3">1 year</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">
                    BOARD AND RECOGNITION:
                  </td>
                  <td className="px-4 py-3">
                    1) BSS Promoted by Govt. of India
                    <br />
                    2) ISO Certified Global Technical Institute
                    <br />
                    3) Affiliated Partner NSDC
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">SESSION:</td>
                  <td className="px-4 py-3">
                    3 sessions (April, August, December)
                  </td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">NO. OF CLASSES:</td>
                  <td className="px-4 py-3">2 classes per week</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">
                    MINIMUM QUALIFICATION:
                  </td>
                  <td className="px-4 py-3">H.S Pass</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">DOCUMENTS REQUIRED:</td>
                  <td className="px-4 py-3">
                    1) Photo (6 Copies)
                    <br />
                    2) Attested Copies of Last Pass out Mark Sheet
                    <br />
                    3) Madhyamik Admit Card
                    <br />
                    4) Any Photo I.D Proof
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold text-blue-800 mb-2">
              Special Modules for Skill Development:
            </h4>
            <div className="bg-blue-100 border border-blue-300 rounded-md p-4">
              <p>
                <strong>MODULE:</strong> Personality development and grooming
                session.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 bg-white">
        <div className="bg-white  p-6 md:p-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
            Specialized OT Technician Training
          </h2>

          <div className="space-y-5 text-gray-700 leading-relaxed text-justify">
            <p>
              Step into the dynamic world of operating theatres with
              <span className="font-semibold">
                Global Technical Institute’s specialized OT Technician Training
              </span>
              . Our comprehensive program blends theoretical knowledge with
              hands-on experience, preparing you for a rewarding career
              assisting surgeons in critical procedures.
            </p>

            <p>
              Throughout the course, you’ll delve into essential skills such as
              <span className="font-medium text-gray-800">
                sterilization techniques, surgical equipment management
              </span>
              , and{" "}
              <span className="font-medium text-gray-800">
                patient care protocols
              </span>
              . Our expert instructors provide personalized guidance and
              mentorship, ensuring you develop the confidence and proficiency
              necessary to excel in this crucial role.
            </p>

            <p>
              With cutting-edge facilities and immersive simulations, you’ll
              gain practical experience in a supportive learning environment.
              Upon completion, you’ll be equipped to contribute to{" "}
              <span className="font-semibold text-gray-700">
                patient safety
              </span>{" "}
              and surgical success as a skilled OT technician.
            </p>

            <p>
              Don’t miss this opportunity to unlock your potential in
              healthcare. Take the first step towards a fulfilling career by
              enrolling in
              <span className="font-semibold">
                OT Technician Training at Global Technical Institute
              </span>{" "}
              today.
              <Link
                href="/contact-us"
                className="text-blue-600 font-semibold underline hover:text-blue-800 transition"
              >
                Contact us
              </Link>
              to learn more and secure your spot in our upcoming cohort. Your
              future in the operating theatre awaits.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
