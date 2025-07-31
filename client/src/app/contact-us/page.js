"use client";
import React, { useEffect, useState } from "react";
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
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);

  useEffect(() => {
    setN1(Math.floor(Math.random() * 9) + 1); // 1–9
    setN2(Math.floor(Math.random() * 9) + 1);
  }, []);
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
          <h1 className="text-5xl font-bold">Contact us</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
        <container className="max-w-7xl mx-auto px-4 py-8 bg-white ">
          <branch>
            <div>
              <img
                src="image/global-logo2.png"
                alt="GTI Logo"
                className="w-120 h-auto mb-4"
              />
            </div>

            <info-box className="flex items-start space-x-4 mb-4">
              <div>
                <img
                  src="/image/map.png"
                  alt="Location Icon"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <div className="text-lg text-[#023b81] font-semibold">
                  Head Office
                </div>
                <div className="text-gray-700">
                  Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085
                  <br />
                  Landmark: Near Surah Kanya Vidyalaya.
                </div>
              </div>
            </info-box>

            <contact-list>
              <email className="flex items-center space-x-2 text-gray-700">
                <icon className="text-blue-600">&#9993;</icon>
                <span>global.technical8.institute@gmail.com</span>
              </email>
              <phone className="flex items-center space-x-2 text-gray-700 mt-2">
                <icon className="text-green-600">&#9742;</icon>
                <span>8961008489, 9231551285, 9230113485</span>
              </phone>
            </contact-list>

            <hr className="my-6 border-t-2 border-gray-400 w-11/12" />

            <info-box className="flex items-start space-x-4 mb-4">
              <div>
                <img
                  src="/image/map.png"
                  alt="Location Icon"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <div className="text-lg text-[#023b81] font-semibold">
                  Garia Branch
                </div>
                <div className="text-gray-700">
                  251/A/6 N.S.C Bose Road, Naktala, Kolkata-700047
                  <br />
                  Near: Geetanjali metro station and Naktala Sib Mandir.
                </div>
              </div>
            </info-box>

            <contact-list>
              <phone className="flex items-center space-x-2 text-gray-700">
                <icon className="text-green-600">&#9742;</icon>
                <span>90516 29028</span>
              </phone>
            </contact-list>
          </branch>
        </container>
        <contactSection className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div>
            <imageContainer className="shadow-xl rounded-md overflow-hidden">
              <img
                src="/image/hom-04.jpg"
                alt="teachers training institute in Kolkata"
                title="teachers training institute in Kolkata"
                className="w-full h-auto object-cover"
              />
            </imageContainer>
          </div>

          <div>
            <header className="mb-4">
              <h4 className="text-xl font-semibold text-[#023b81]  pt-10">
                CONTACT US FOR ANY QUESTIONS
              </h4>
            </header>

            <form action="/contact-us" method="post" className="space-y-4">
              <input
                type="text"
                name="name"
                label="Name"
                placeholder="Name:"
                required={true}
                className="w-full border border-gray-300 px-4 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="tel"
                name="phone"
                required={true}
                placeholder="Phone:"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                required={true}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="message"
                placeholder="If any query, please write to us:"
                className="w-full border border-gray-300 px-4 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <captcha className="flex flex-row gap-5">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Captcha:
                </label>
                <label className="text-lg font-bold text-gray-700 mb-1">
                  {`${n1} × ${n2} =`}
                </label>
                <input
                  type="text"
                  name="captcha"
                  required={true}
                  className="w-1/4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input type="hidden" name="n1" value="6" />
                <input type="hidden" name="n2" value="3" />
                <input type="hidden" name="operator" value="*" />
              </captcha>

              <submit>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
                >
                  Submit
                </button>
              </submit>
            </form>
          </div>
        </contactSection>
      </div>
      <section className="max-w-6xl bg-white mx-auto px-4 py-10 text-gray-800 space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-blue-600 pb-2">
            About Us:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Global Technical Institute (GTI) is a renowned technical education
              and innovation institution in Kolkata.
            </li>
            <li>
              Founded on principles of integrity and commitment, GTI aims to
              bridge the gap between academia and industry.
            </li>
            <li>
              Our campus provides a conducive learning environment for holistic
              development. Contact us to learn more.
            </li>
            <li>
              We offer a comprehensive range of programs tailored to meet the
              demands of the global market.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-blue-600 pb-2">
            Our Specialty:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              GTI emphasizes a unique blend of theoretical knowledge and
              practical application.
            </li>
            <li>
              Our faculty comprises experts who provide cutting-edge insights
              and mentorship.
            </li>
            <li>
              Hands-on learning through projects, internships, and
              collaborations is a cornerstone of our approach.
            </li>
            <li>
              We encourage innovation and creativity among students, preparing
              them for dynamic work environments.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-blue-600 pb-2">
            Past Placements:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              GTI boasts an impressive track record of
              <Link
                href="/placement"
                className="text-blue-600 underline font-semibold ml-1"
              >
                placements
              </Link>
              in top-tier organizations.
            </li>
            <li>
              Through our industry network and career development programs, we
              facilitate internships and job placements for our graduates.
            </li>
            <li>Our alumni hold key positions in leading positions.</li>
            <li>
              They are recognized for their exceptional skills, adaptability,
              and professionalism, driving innovation in their respective
              fields.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-blue-600 pb-2">
            Types of Training:
          </h3>
          <p>
            At our Training Institute, we’re more than just educators; we’re
            architects of futures. With a commitment to excellence, innovation,
            and practical learning, we prepare individuals to excel in their
            chosen fields.
          </p>
          <p>
            Our programs blend theoretical knowledge with hands-on experience,
            ensuring our students are well-informed and adept practitioners.
            From technical skills to soft skills, we provide comprehensive
            training that equips individuals with the tools they need to succeed
            in today’s competitive world.
          </p>
          <p>Contact us to know more. Our Trainings include:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Link
                href="/teachers-training-institute-kolkata"
                className="text-blue-600 underline font-semibold"
              >
                Teachers Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/nursing-training-in-kolkata/"
                className="text-blue-600 underline font-semibold"
              >
                Nursing Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/lab-technician-training-institute/"
                className="text-blue-600 underline font-semibold"
              >
                Lab Technician Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/ecg-technician-training-kolkata/"
                className="text-blue-600 underline font-semibold"
              >
                ECG Technician Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/physiotherapy-training-institute-in-kolkata/"
                className="text-blue-600 underline font-semibold"
              >
                Physiotherapy Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/ot-technician-training/"
                className="text-blue-600 underline font-semibold"
              >
                OT Technician Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/x-ray/"
                className="text-blue-600 underline font-semibold"
              >
                X-Ray Training
              </Link>
            </li>
            <li>
              <Link
                href="https://globaltechnicalinstitute.com/cmsed/"
                className="text-blue-600 underline font-semibold"
              >
                CMS &amp; ED Training
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
