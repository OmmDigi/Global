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
          <h1 className="text-5xl font-bold"> X-Ray & Imaging Technology</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/x-ray/WhatsApp-Image-2025-02-13-at-2.21.07-PM-1-1-1063x800.webp"
            alt="X-ray training image 1"
            class=" shadow-lg w-full object-cover"
          />
          <img
            src="/image/x-ray/WhatsApp-Image-2025-02-13-at-2.21.06-PM-1-1536x1156-1-400x300.webp"
            alt="X-ray training image 2"
            class=" shadow-lg w-full object-cover"
          />
        </div>

        <div className="md:col-span-7">
          <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table class="w-full text-sm text-left">
              <tbody>
                <tr class="bg-blue-100 font-semibold text-gray-900">
                  <td class="px-4 py-3 w-1/3">COURSE NAME:</td>
                  <td class="px-4 py-3">X-RAY & IMAGING TECHNOLOGY</td>
                </tr>
                <tr class="bg-orange-100">
                  <td class="px-4 py-3 font-medium">CERTIFICATE:</td>
                  <td class="px-4 py-3">
                    1. Certificate in X-Ray & Imaging Technology
                    <br />
                    2. Diploma in X-Ray & Imaging Technology
                  </td>
                </tr>
                <tr class="bg-blue-100">
                  <td class="px-4 py-3 font-medium">COURSE DURATION:</td>
                  <td class="px-4 py-3">1 / 2 year</td>
                </tr>
                <tr class="bg-orange-100">
                  <td class="px-4 py-3 font-medium">BOARD AND RECOGNITION:</td>
                  <td class="px-4 py-3">
                    1) BSS Promoted by Govt. of India
                    <br />
                    2) ISO Certified Global Technical Institute
                  </td>
                </tr>
                <tr class="bg-blue-100">
                  <td class="px-4 py-3 font-medium">SESSION:</td>
                  <td class="px-4 py-3">
                    3 sessions (April, August, December)
                  </td>
                </tr>
                <tr class="bg-orange-100">
                  <td class="px-4 py-3 font-medium">NO. OF CLASSES:</td>
                  <td class="px-4 py-3">2 classes per week</td>
                </tr>
                <tr class="bg-blue-100">
                  <td class="px-4 py-3 font-medium">MINIMUM QUALIFICATION:</td>
                  <td class="px-4 py-3">H.S Pass</td>
                </tr>
                <tr class="bg-orange-100">
                  <td class="px-4 py-3 font-medium">DOCUMENTS REQUIRED:</td>
                  <td class="px-4 py-3">
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

          <div class="mt-8">
            <h4 class="text-xl font-semibold text-blue-800 mb-2">
              Special Modules for Skill Development:
            </h4>
            <div class="bg-blue-100 border border-blue-300 rounded-md p-4">
              <p>
                <strong>MODULE:</strong> Personality development and grooming
                session.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 py-10">
        <div class="bg-white  p-6 md:p-10 max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">
            X-ray & Imaging Course Overview
          </h2>

          <div class="space-y-6 text-gray-700 leading-relaxed text-justify">
            <p>
              At{" "}
              <span class="font-semibold text-gray-800">
                Global Technical Institute in Kolkata
              </span>
              , our
              <span class="text-blue-800 font-medium">
                X-ray and Imaging Course
              </span>{" "}
              is designed to provide comprehensive training for aspiring
              radiologic technologists. Our specialty includes radiographic
              techniques, imaging principles, patient positioning, radiation
              safety, and equipment handling. With a curriculum that blends{" "}
              <span class="font-medium">theoretical knowledge</span> and{" "}
              <span class="font-medium">hands-on practice</span>, students gain
              the skills needed to excel in medical imaging.
            </p>

            <p>
              Our experienced instructors, who are{" "}
              <span class="font-medium text-gray-700">industry experts</span>,
              ensure that each student receives personalized attention and
              guidance. State-of-the-art labs and modern equipment prepare
              students for real-world clinical settings. Graduates of our course
              are equipped to work in{" "}
              <span class="italic">
                hospitals, diagnostic centers, and clinics
              </span>
              , contributing to both patient care and medical diagnostics.
            </p>

            <p>
              Join{" "}
              <span class="font-semibold text-gray-800">
                Global Technical Institute
              </span>{" "}
              to kickstart your career in the dynamic field of X-ray and
              Imaging.
              <Link
                href="/contact-us"
                class="text-blue-600 underline font-semibold hover:text-blue-800 transition duration-200"
              >
                Contact us
              </Link>{" "}
              today or visit our
              <Link
                href="https://www.facebook.com/gtitrainingcourse/"
                class="text-blue-600 underline font-semibold hover:text-blue-800 transition duration-200"
              >
                Facebook
              </Link>{" "}
              page for more information on becoming a skilled radiologic
              technologist in Kolkata.
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
