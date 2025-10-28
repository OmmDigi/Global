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
          <h1 className="text-5xl font-bold">ECG Technician Training</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/ecg/ecg-tra01.jpg"
            alt="ECG Technician Training"
            className=" shadow-md w-full object-cover"
          />

          <img
            src="/image/ecg/ecg-train-400x225.jpg"
            alt="ECG training institute in Kolkata"
            className=" shadow-md w-full object-cover"
          />
        </div>

        <div className="md:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 shadow-sm">
              <tbody>
                <tr className="bg-blue-100">
                  <td className="p-3 font-semibold w-1/3">COURSE NAME:</td>
                  <td className="p-3">ECG Technician Training</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="p-3 font-semibold">CERTIFICATE:</td>
                  <td className="p-3">ECG Technician</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="p-3 font-semibold">COURSE DURATION:</td>
                  <td className="p-3">For 6 Months</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="p-3 font-semibold">SESSION:</td>
                  <td className="p-3">3 sessions (April, August, December)</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="p-3 font-semibold">NO. OF CLASSES:</td>
                  <td className="p-3">1 className per week</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="p-3 font-semibold">BOARD & RECOGNITION:</td>
                  <td className="p-3 space-y-1">
                    <div>1) BSS Promoted by Govt. of India</div>
                    <div>2) ISO Certified Global Technical Institute</div>
                    <div>3) Affiliated Partner NSDC</div>
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="p-3 font-semibold">MINIMUM QUALIFICATION:</td>
                  <td className="p-3">Madhyamik</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="p-3 font-semibold">DOCUMENTS REQUIRED:</td>
                  <td className="p-3 space-y-1">
                    <div>1) Photo (6 Copies)</div>
                    <div>2) Attested Copies of Last Pass-out Mark Sheet</div>
                    <div>3) Madhyamik Admit Card</div>
                    <div>4) Any Photo I.D Proof</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">
              Special Modules for Skill Development:
            </h4>
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-blue-100">
                  <th className="text-left p-3">MODULE</th>
                  <th className="text-left p-3">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">Personality Development</td>
                  <td className="p-3">
                    Personality development and grooming session
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-600">
            ECG Technician Training
          </h2>
          <p className="text-gray-700 mt-2 text-lg">
            Pursue a career in healthcare with specialized ECG Technician
            Training in Kolkata.
          </p>
        </div>

        <div className="grid gap-8">
          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Course Overview
            </h3>
            <p className="text-gray-600 mt-2">
              This course equips individuals to perform electrocardiograms
              efficiently. Learn ECG machine operations, reading interpretation,
              and how to identify abnormalities.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Certificate and Duration
            </h3>
            <img
              src="/image/ecg/best-ECG-technician-training-in-kolkata-400x225.jpeg"
              alt="best ECG technician training in kolkata"
              className="rounded-lg shadow-md w-full max-w-md mx-auto my-4"
            />
            <p className="text-gray-600">
              After completing the{" "}
              <Link
                href="https://globaltechnicalinstitute.com/"
                className="text-blue-500 font-medium hover:underline"
              >
                ECG Technician Training program in Kolkata
              </Link>
              , students receive a certificate. Duration:{" "}
              <strong>6 months</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Session Schedule
            </h3>
            <p className="text-gray-600">
              Classes are conducted <strong>three times a year</strong> in{" "}
              <strong>April, August, and December</strong>, offering flexibility
              for enrolment.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Number of Classes
            </h3>
            <p className="text-gray-600">
              Only <strong>one className per week</strong>, ideal for balancing
              work or personal responsibilities.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Board and Recognition
            </h3>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              <li>BSS Promoted by Govt. of India</li>
              <li>ISO Certified Global Technical Institute</li>
              <li>
                Affiliated Partner NSDC (National Skill Development Corporation)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Minimum Qualification
            </h3>
            <p className="text-gray-600">
              Applicants must have passed <strong>Madhyamik</strong> to be
              eligible for this course.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Required Documents
            </h3>
            <img
              src="/image/ecg/ECG-technician-training-in-kolkata-400x300.jpeg"
              alt="ECG technician training in kolkata"
              className="rounded-lg shadow-md w-full max-w-md mx-auto my-4"
            />
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Six recent passport-size photographs</li>
              <li>Attested copy of last pass-out mark sheet</li>
              <li>Madhyamik Admit Card</li>
              <li>Valid photo ID (Aadhar, PAN, or Driver’s License)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">
              Special Modules for Skill Development
            </h3>
            <p className="text-gray-600">
              Our institute provides extra modules to build professional and
              soft skills.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-600">
              Personality Development and Grooming Session
            </h3>
            <p className="text-gray-600">
              Workshops to improve communication, interpersonal skills, and
              professional behavior for effective patient care.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">Conclusion</h3>
            <p className="text-gray-600">
              The <strong>ECG Technician Training in Kolkata</strong> offers
              comprehensive education, certification, and placement support.
              With growing healthcare demand, this course prepares students to
              become skilled professionals.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800">FAQs</h3>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: What is the duration of the ECG Technician Training course?
                </h4>
                <p className="text-gray-600">A: 6 months.</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: When are sessions conducted?
                </h4>
                <p className="text-gray-600">A: April, August, and December.</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: What documents are required?
                </h4>
                <p className="text-gray-600">
                  A: 6 photos, mark sheet, Madhyamik admit card, and ID proof.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: Are skill development modules included?
                </h4>
                <p className="text-gray-600">
                  A: Yes, including grooming and communication skills.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: Is the training institute recognized?
                </h4>
                <p className="text-gray-600">
                  A: Yes, BSS promoted, ISO certified, NSDC affiliated.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-gray-800">
                  Q: Where is this training offered?
                </h4>
                <p className="text-gray-600">
                  A: At the renowned{" "}
                  <strong>Global Technical Institute in Kolkata</strong>.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-10">
            <p className="text-lg font-medium text-green-700">
              Ready to start your journey?
            </p>
            <Link
              href="/"
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Enroll Now
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
