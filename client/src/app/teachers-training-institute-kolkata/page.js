"use client";
import React, { useState } from "react";
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
      <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
        <h1 className="text-5xl font-bold"> Teachers Training</h1>
      </div>

      <div className="space-y-6">
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
            Montessori Teachers Training (Pre Primary & Primary)
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
                      <td className="px-4 py-2">
                        Primary Teacher’s Training (Based on Montessori Method)
                      </td>
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
                      <td className="px-4 py-2 font-semibold">
                        NATURE OF CERTIFICATE:
                      </td>
                      <td className="px-4 py-2">
                        Diploma in Primary Teacher’s Training
                      </td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        MINIMUM QUALIFICATION:
                      </td>
                      <td className="px-4 py-2">Madhyamik / H.S</td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        COURSE DURATION:
                      </td>
                      <td className="px-4 py-2">1 Year</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO.OF CLASSES:
                      </td>
                      <td className="px-4 py-2">
                        3 Classes/Week or Sat–Sun (Online & Offline)
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">SESSION:</td>
                      <td className="px-4 py-2">
                        3 Sessions (March, July & November)
                      </td>
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
            Senior Teachers Training
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
                      <td className="px-4 py-2">Senior Teacher’s Training</td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                      <td className="px-4 py-2">
                        Diploma in Elementary Education
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
                        BOARD & RECOGNITION:
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
                        2 Sessions (April, November)
                      </td>
                    </tr>
                    <tr className="bg-orange-100">
                      <td className="px-4 py-2 font-semibold">
                        NO. OF CLASSES:
                      </td>
                      <td className="px-4 py-2">
                        2 Days a Week (Online & Offline)
                      </td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="px-4 py-2 font-semibold">
                        MINIMUM QUALIFICATION:
                      </td>
                      <td className="px-4 py-2">
                        12th Pass + Completion of Pre & Primary Teacher Training
                      </td>
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

      <section className="container mx-auto px-4 py-8 text-gray-800">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">
            Welcome to Global Technical Institute
          </h1>
          <p className="text-lg text-center">
            Your Premier Destination for{" "}
            <strong>
              <Link href="/" className="text-blue-600 hover:underline">
                Teachers Training Institute in Kolkata
              </Link>
            </strong>
            !
          </p>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            Are you passionate about shaping the minds of young children and
            creating a positive impact on their lives? Look no further! Global
            Technical Institute offers a comprehensive Primary{" "}
            <a
              href="https://en.wikipedia.org/wiki/Teacher"
              className="text-blue-600 hover:underline"
            >
              Teacher’s
            </a>{" "}
            Training program based on the renowned Montessori Method to equip
            you with the skills and knowledge necessary for a successful career
            in primary education.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Board and Recognition:
          </h2>
          <p>
            At Global Technical Institute, we take pride in our affiliation with
            esteemed organizations. Our course is promoted by the Government of
            India through the BSS board. We are ISO Certified and an affiliated
            partner of NSDC.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Nature of Certificate and Minimum Qualification:
          </h2>
          <img
            src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/06/Techers-training-institute-in-kolkata-400x300.jpeg"
            alt="Teachers training institute in Kolkata"
            className="rounded shadow-lg mb-4 w-full max-w-md mx-auto"
          />
          <p>
            Upon completing our{" "}
            <strong>
              <a
                href="https://globaltechnicalinstitute.com/best-teachers-training-institute-in-kolkata/"
                className="text-blue-600 hover:underline"
              >
                Primary Teacher’s Training program in Kolkata
              </a>
            </strong>
            , you will be awarded a Diploma in Primary Teacher’s Training.
            Minimum qualification required is Madhyamik or H.S.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Course Duration and Schedule:
          </h2>
          <p>
            The program spans 1 year with flexible options: three classes per
            week or weekend classes. Both online and offline modes are
            available.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Session Details:
          </h2>
          <img
            src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/06/best-teachers-training-institute-in-kolkata-300x300.jpeg"
            alt="Session"
            className="rounded shadow-lg mb-4 w-72 mx-auto"
          />
          <p>
            Sessions start in March, July, and November, offering flexibility to
            students.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Documents Required:
          </h2>
          <ul className="list-disc pl-6">
            <li>Six passport-sized photographs</li>
            <li>Attested copies of last pass-out mark sheet</li>
            <li>Madhyamik admit card</li>
            <li>Valid photo ID proof</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Special Modules for Skill Development:
          </h2>
          <ul className="list-decimal pl-6">
            <li>
              <strong>Personality Development and Grooming Session:</strong>{" "}
              Develop communication and interpersonal skills.
            </li>
            <li>
              <strong>Senior Teachers Training:</strong> Learn advanced
              methodologies from experienced educators.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">
                What career opportunities can I pursue after completing the
                Primary Teacher’s Training program?
              </h3>
              <p>
                You can teach in primary schools, preschools, or educational
                NGOs in both public and private sectors.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Is the program recognized globally?</h3>
              <p>
                While it's nationally recognized, the Montessori Method has
                global relevance.
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                Can I pursue the course while working or studying?
              </h3>
              <p>
                Yes. Flexible online/offline options make it easier to balance
                commitments.
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                What support is provided during the course?
              </h3>
              <p>
                Mentorship, study materials, and access to online learning
                platforms are provided.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Is financial assistance available?</h3>
              <p>
                Yes, scholarships and assistance are available. Contact
                admissions for details.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-blue-900">Conclusion</h2>
          <p className="mt-4 text-lg">
            Enrol in our Primary Teacher’s Training program and build a
            rewarding career shaping young minds. Contact us today!
          </p>
          <Link
            href="/contact-us"
            className="inline-block mt-4 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full transition"
          >
            Contact us
          </Link>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
