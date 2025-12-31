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
          <h1 className="text-5xl font-bold"> Lab Technician Training</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/lab/lab-tech01.jpg"
            alt="lab-tech01"
            className="w-full h-auto  shadow-xl"
          />

          <img
            src="/image/lab/lab-768x578.webp"
            alt="lab"
            className="w-full h-auto  shadow-xl"
          />
        </div>

        <div className="md:col-span-7">
          <table className="w-full text-sm border border-gray-300 divide-y divide-gray-200">
            <tbody>
              <tr className="bg-blue-100">
                <td className="font-semibold px-4 py-2">COURSE NAME:</td>
                <td className="px-4 py-2">Medical Lab Technician Training</td>
              </tr>
              <tr className="bg-orange-100">
                <td className="font-semibold px-4 py-2">CERTIFICATE:</td>
                <td className="px-4 py-2">Diploma in Medical Lab Technician</td>
              </tr>
              <tr className="bg-blue-100">
                <td className="font-semibold px-4 py-2">COURSE DURATION:</td>
                <td className="px-4 py-2">
                  For 1 year
                  <br />
                  For 2 years
                </td>
              </tr>
              <tr className="bg-orange-100">
                <td className="font-semibold px-4 py-2">
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
                <td className="font-semibold px-4 py-2">SESSION:</td>
                <td className="px-4 py-2">
                  3 sessions (January, May, September)
                </td>
              </tr>
              <tr className="bg-orange-100">
                <td className="font-semibold px-4 py-2">NO. OF CLASSES:</td>
                <td className="px-4 py-2">2 classes per week</td>
              </tr>
              <tr className="bg-blue-100">
                <td className="font-semibold px-4 py-2">
                  MINIMUM QUALIFICATION:
                </td>
                <td className="px-4 py-2">H.S pass.</td>
              </tr>
              <tr className="bg-orange-100">
                <td className="font-semibold px-4 py-2">DOCUMENTS REQUIRED:</td>
                <td className="px-4 py-2">
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

          <div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              Special Modules for Skill Development:
            </h4>
            <table className="w-full text-sm border border-gray-300">
              <tbody>
                <tr className="bg-blue-100">
                  <td className="px-4 py-2 font-medium">MODULE</td>
                  <td className="px-4 py-2">
                    Personality development and grooming Session.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10 space-y-8 bg-white text-gray-800">
        <div>
          <p className="text-lg">
            Welcome to Global Technical Institute – The Best Medical
            <Link
              href="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Lab Technician Training Institute in Kolkata
            </Link>
          </p>

          <p className="mt-4">
            At Global Technical Institute, we take pride in being Kolkata’s
            leading
            <strong>
              Medical Lab Technician Training institute in Kolkata
            </strong>
            . Our comprehensive diploma program offers a rigorous curriculum to
            equip students with the necessary skills and knowledge to excel in
            medical laboratory technology.
          </p>

          <p className="mt-2">
            Backed by BSS (Promoted by Govt. of India), ISO Certification, and
            NSDC affiliation, our training ensures top-tier learning and
            recognition.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Course Details:
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Course Name:</strong> Medical Lab Technician Training
            </li>
            <li>
              <strong>Certificate:</strong> Diploma in Medical Lab Technician
            </li>
            <li>
              <strong>Course Duration:</strong>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>1-year program</li>
                <li>2-year program</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="flex justify-start">
          <figure className="text-center">
            <img
              src="/image/lab/lab3.webp"
              alt="lab technician training institute in kolkata"
              className="rounded shadow-md w-full max-w-md"
            />
            <figcaption className="text-sm mt-1 text-gray-600">
              lab technician training institute in Kolkata
            </figcaption>
          </figure>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Course Structure:
          </h2>
          <p className="mb-2">
            Our{" "}
            <strong>
              <Link
                href="https://globaltechnicalinstitute.com/lab-technician-training-institute"
                className="text-blue-600 hover:underline"
              >
                Medical Lab Technician Training Institute in Kolkata
              </Link>
            </strong>{" "}
            program blends theory with practical knowledge, offering hands-on
            training across all medical laboratory domains.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Sessions:
          </h2>
          <p className="mb-2">We offer three sessions throughout the year:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>January session</li>
            <li>May session</li>
            <li>September session</li>
          </ul>
          <p className="mt-2">
            Number of Classes: Students attend two weekly classes, balancing
            classroom learning and self-study.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Minimum Qualification:
            </h2>
            <p>
              Applicants must have passed their Higher Secondary (H.S)
              examinations to be eligible for our Medical Lab Technician
              Training program.
            </p>
          </div>
          <div>
            <figure className="text-center">
              <img
                src="/image/lab/lab4.jpeg"
                alt="lab technician training institute in kolkata"
                className="rounded shadow-md w-full max-w-md"
              />
              <figcaption className="text-sm mt-1 text-gray-600">
                lab technician training institute in Kolkata
              </figcaption>
            </figure>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Documents Required:
          </h2>
          <p>
            To complete the admission process, the following documents are
            necessary:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Six passport-sized photographs</li>
            <li>Attested copies of the last pass-out mark sheet</li>
            <li>Madhyamik admit card</li>
            <li>Any valid photo identification proof</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Special Modules for Skill Development:
          </h2>
          <p>
            We believe in holistic student development. Our dedicated
            personality development and grooming module improves communication,
            professional presence, and confidence—ensuring success in the
            medical field.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-md shadow-sm">
          <p>
            <strong>Enroll with Global Technical Institute today</strong> and
            start your journey to becoming a skilled Medical Lab Technician.
            With experienced faculty, state-of-the-art labs, and industry-ready
            curriculum—we deliver Kolkata’s best training.
          </p>
          <p className="mt-2">
            <Link href="/contact-us" className="text-blue-600 hover:underline">
              Contact us
            </Link>{" "}
            now to learn more or schedule a visit.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
