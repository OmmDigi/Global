"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

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
      <div className="relative bg-gray-300 overflow-hidden top-0 z-0">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/image/instit.jpg')" }} // replace with your image path
        ></div>

        <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
          <h1 className="text-5xl font-bold"> CMS & ED Training</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/cmsed/ot1.jpeg"
            alt="CMSED Course 1"
            className=" shadow-lg w-full object-cover"
          />
          <img
            src="/image/cmsed/ot2-768x432.jpeg"
            alt="CMSED Course 2"
            className=" shadow-lg w-full object-cover"
          />
        </div>

        <div className="md:col-span-7">
          <table className="w-full text-sm text-left text-gray-700 ">
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-blue-100 ">
                <td className="py-3 pl-3 font-semibold w-1/3">Course Name:</td>
                <td className="py-3">
                  Community Medical Services & Essential Drugs (CMS & ED)
                </td>
              </tr>

              <tr className="bg-orange-100">
                <td className="py-3 pl-3 font-semibold">Certificate:</td>
                <td className="py-3">
                  Diploma in Community Medical Services & Essential Drugs (CMS
                  & ED)
                </td>
              </tr>

              <tr className="bg-blue-100">
                <td className="py-3 pl-3 font-semibold">Course Duration:</td>
                <td className="py-3">2 Years</td>
              </tr>

              <tr className="bg-orange-100">
                <td className="py-3 pl-3 font-semibold">
                  Board & Recognition:
                </td>
                <td className="py-3">UGC Recognition, Affiliated Universities</td>
              </tr>

              <tr className="bg-blue-100">
                <td className="py-3 pl-3 font-semibold">Session:</td>
                <td className="py-3">February, June, October</td>
              </tr>

              <tr className="bg-orange-100">
                <td className="py-3 pl-3 font-semibold">No. of Classes:</td>
                <td className="py-3">1 class per week</td>
              </tr>

              <tr className="bg-blue-100">
                <td className="py-3 pl-3 font-semibold">
                  Minimum Qualification:
                </td>
                <td className="py-3">Madhyamik</td>
              </tr>

              <tr className="bg-orange-100">
                <td className="py-3 pl-3 font-semibold">Documents Required:</td>
                <td className="py-3">
                  1. Photos (6 copies)
                  <br />
                  2. Result (Madhyamik / HS)
                  <br />
                  3. Certificate (Madhyamik / HS)
                  <br />
                  4. Admit Card (Madhyamik / HS)
                </td>
              </tr>

              <tr className="bg-blue-100">
                <td className="py-3 pl-3 font-semibold">Internship:</td>
                <td className="py-3">3 or 6 Months</td>
              </tr>

              <tr className="bg-orange-100">
                <td className="py-3 pl-3 font-semibold">Special Module:</td>
                <td className="py-3">
                  1. Clinical Assessment
                  <br />
                  2. Workshop
                  <br />
                  3. Hands-on Practical Classes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 bg-white">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
            Welcome to CMS &amp; ED Training!
          </h2>

          <p className="text-gray-700 text-base leading-relaxed mb-4">
            Welcome to CMS &amp; ED Training in the medical field!{" "}
            <strong>CMS</strong> or{" "}
            <strong>Community Medical Service and Essential Drugs</strong>{" "}
            Training equips healthcare professionals with essential skills and
            knowledge to effectively manage clinical workflows and emergencies.
          </p>

          <p className="text-gray-700 text-base leading-relaxed mb-4">
            This comprehensive training covers a range of topics including
            patient triage, medical documentation, electronic health record
            (EHR) utilization, resource allocation, and effective communication
            strategies within a healthcare setting. Participants learn to
            navigate complex medical scenarios with precision, ensuring timely
            and accurate patient care while optimizing operational efficiency.
          </p>

          <p className="text-gray-700 text-base leading-relaxed mb-4">
            They gain proficiency in utilizing specialized software for patient
            management and documentation, honing their ability to swiftly assess
            and prioritize patient needs during high-pressure situations.
            Through hands-on simulations and case studies, they develop critical
            thinking skills and learn to collaborate seamlessly with
            multidisciplinary teams, enhancing overall patient outcomes and
            satisfaction.
          </p>

          <div className="text-center mt-6">
            <Link
              href="/contact-us"
              className="inline-block bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-all duration-300 font-medium shadow-md"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
