"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

function page() {
  return (
    <>
      <Navbar />
      <div className="relative bg-gray-300 overflow-hidden top-0 z-0">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/image/instit.jpg')" }}
        ></div>
        <div className="flex justify-center text-center text-[#023b81] align-middle items-center h-30">
          <h1 className="text-5xl font-bold">Pharmacy Assistant Course</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/pharmasist/pharms.jpg"
            alt="Pharmacy Assistant"
            className="shadow-lg w-full object-cover"
          />
          {/* <img
            src="/image/x-ray/WhatsApp-Image-2025-02-13-at-2.21.06-PM-1-1536x1156-1-400x300.webp"
            alt="Pharmacy Assistant Training Image 2"
            className="shadow-lg w-full object-cover"
          /> */}
        </div>

        <div className="md:col-span-7">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="bg-blue-100 font-semibold text-gray-900">
                  <td className="px-4 py-3 w-1/3">COURSE NAME:</td>
                  <td className="px-4 py-3">Pharmacy Assistant</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">CERTIFICATE:</td>
                  <td className="px-4 py-3">Govt. Registered Certificate</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">COURSE DURATION:</td>
                  <td className="px-4 py-3">1 Year</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">
                    BOARD AND RECOGNITION:
                  </td>
                  <td className="px-4 py-3">
                    1. BSS Promoted by Govt. of India
                    <br />
                    2. ISO Certified Global Technical Institute
                    <br />
                    3. Certification from World Skill Council (WSC)
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">SESSION:</td>
                  <td className="px-4 py-3">3 Sessions (Jan, May, Sep)</td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">NO. OF CLASSES:</td>
                  <td className="px-4 py-3">1 classes per week</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">
                    MINIMUM QUALIFICATION:
                  </td>
                  <td className="px-4 py-3">10th Pass</td>
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
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">INTERNSHIP:</td>
                  <td className="px-4 py-3">6 Months</td>
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
                1. Personality Development & Grooming Session
                <br />
                2) Interview Related Session
                <br />
                3) Hands-on Practical Training
                <br />
                4) Workshop
                <br />
                5) Emergency & Assessment Session
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* body content */}
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white p-6 md:p-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Pharmacy Assistant Course in Kolkata
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
            <p className="font-semibold text-gray-800 text-lg">
              Gain Practical Knowledge of Medicines and Build Your Future in the
              Healthcare Sector
            </p>

            <p>
              Are you interested in building a career in the healthcare and
              pharmaceutical sector? Join the{" "}
              <strong>Pharmacy Assistant Course in Kolkata</strong> at{" "}
              <strong>Global Technical Institute (GTI)</strong> and develop
              foundational knowledge and practical skills related to pharmacy
              operations.
            </p>

            <p>
              Our 1-year Pharmacy Assistant Training Programme is designed for
              individuals who want to understand medicines, pharmacy operations,
              basic pharmaceutical concepts and the responsibilities of pharmacy
              assistants.
            </p>

            <p>
              If you are searching for a reliable{" "}
              <strong>Pharmacy Assistant Institute in Kolkata</strong>, Global
              Technical Institute provides a structured training programme with
              practical-oriented learning and guidance from experienced faculty.
            </p>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                <strong>Admissions Open</strong> |{" "}
                <strong>1-Year Training Programme</strong>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Course Highlights:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Course Name: Pharmacy Assistant</li>
                <li>Duration: 1 Year</li>
                <li>Practical-Oriented Training</li>
                <li>Experienced Faculty</li>
                <li>Skill Development</li>
                <li>Career Guidance</li>
              </ul>
            </div>

            <p>
              <strong>Call for Admission:</strong>{" "}
              <a
                href="tel:9231551285"
                className="text-blue-600 underline hover:text-blue-800"
              >
                9231551285
              </a>{" "}
              /{" "}
              <a
                href="tel:9230113485"
                className="text-blue-600 underline hover:text-blue-800"
              >
                9230113485
              </a>
            </p>

            <p>
              <strong>CTA Buttons:</strong>{" "}
              <Link
                href="/contact-us"
                className="text-blue-600 underline font-semibold hover:text-blue-800"
              >
                Enquire Now
              </Link>{" "}
              |{" "}
              <a
                href="tel:9231551285"
                className="text-blue-600 underline font-semibold hover:text-blue-800"
              >
                Call Now
              </a>
            </p>

            {/* 3. About Global Technical Institute */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                3. About Global Technical Institute
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Your Destination for Pharmacy Assistant Training in Kolkata
              </p>
              <p className="mb-3">
                Choosing the right{" "}
                <strong>Pharmacy Training Institute in Kolkata</strong> is an
                important step towards developing knowledge and skills in the
                pharmaceutical and healthcare sector.
              </p>
              <p className="mb-3">
                Global Technical Institute offers a 1-year Pharmacy Assistant
                Training Programme designed to introduce students to the
                fundamentals of pharmacy operations, medicine handling and
                pharmaceutical practices.
              </p>
              <p className="mb-3">
                Our training approach focuses on theoretical understanding,
                practical-oriented learning and guidance from experienced
                faculty to help students build confidence and develop relevant
                skills.
              </p>
              <p className="mb-3">
                At GTI, we aim to provide students with a learning environment
                where they can understand the responsibilities of pharmacy
                assistants and become familiar with the basic operations of a
                pharmacy setting.
              </p>
              <p>
                If you are looking for a{" "}
                <strong>Pharmacy Assistant Institute in Kolkata</strong> to
                begin your training journey, explore the programme offered by
                Global Technical Institute.
              </p>
            </div>

            {/* 4. About Our Pharmacy Assistant Course */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                4. About Our Pharmacy Assistant Course
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Our Pharmacy Course in Kolkata
              </p>
              <p className="mb-3">
                The Pharmacy Assistant Training Programme at Global Technical
                Institute is a 1-year course designed for students interested in
                learning about pharmaceutical products, medicine handling and
                pharmacy-related activities.
              </p>
              <p className="mb-3">
                This programme aims to develop foundational knowledge and
                practical awareness that can help learners understand the
                working environment of pharmacies and healthcare establishments.
              </p>

              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Pharmacy Assistant Training Programme
                </h4>
                <p>
                  <strong>Course Duration:</strong> 1 Year
                </p>
                <p className="font-semibold text-gray-800 mt-2 mb-1">
                  Key Learning Areas:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Introduction to pharmacy and pharmaceutical science</li>
                  <li>Basic knowledge of medicines and their uses</li>
                  <li>Identification and classification of medicines</li>
                  <li>Medicine storage and handling principles</li>
                  <li>Prescription reading fundamentals</li>
                  <li>Pharmacy inventory and stock management</li>
                  <li>Basic pharmacy operations</li>
                  <li>Customer communication and pharmacy assistance</li>
                  <li>Healthcare and pharmaceutical safety awareness</li>
                </ul>
              </div>

              <p className="italic text-gray-600 mt-3">
                The final syllabus and practical modules should be confirmed by
                GTI before publication.
              </p>
            </div>

            {/* 5. Why Choose Global Technical Institute? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                5. Why Choose Global Technical Institute?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Why Choose the Best Pharmacy Assistant Training Institute in
                Kolkata?
              </p>
              <p className="mb-3">
                Selecting the right institute is essential when starting your
                journey in pharmacy education. Global Technical Institute
                focuses on providing structured training, faculty guidance and
                practical-oriented learning.
              </p>
              <p className="mb-3">
                Here are some reasons to consider GTI for your pharmacy
                training:
              </p>

              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Practical-Oriented Training:</strong> Develop
                  familiarity with pharmacy-related activities through
                  practical-oriented learning.
                </li>
                <li>
                  <strong>Experienced Faculty:</strong> Learn with guidance from
                  experienced teaching professionals who support your academic
                  development.
                </li>
                <li>
                  <strong>One-Year Training Programme:</strong> Complete the
                  Pharmacy Assistant Training Programme with a structured
                  duration of one year.
                </li>
                <li>
                  <strong>Skill Development:</strong> Build foundational
                  knowledge of pharmaceutical products, medicine handling and
                  pharmacy operations.
                </li>
                <li>
                  <strong>Career Guidance:</strong> Receive guidance to
                  understand potential opportunities in the healthcare and
                  pharmaceutical sectors.
                </li>
                <li>
                  <strong>Placement Support:</strong> GTI provides placement
                  support to help eligible students explore relevant career
                  opportunities.
                </li>
              </ol>

              <p className="mt-3">
                If you are searching for the{" "}
                <strong>
                  Best Pharmacy Assistant Training Institute in Kolkata
                </strong>
                , explore the training programme at Global Technical Institute.
              </p>
            </div>

            {/* 6. What Will You Learn During Pharmacy Assistant Training? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                6. What Will You Learn During Pharmacy Assistant Training?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Develop Your Knowledge Through Pharmacy Education in Kolkata
              </p>
              <p className="mb-3">
                A good <strong>Pharmacy Assistant Course in Kolkata</strong>{" "}
                should introduce students to the fundamental concepts and
                responsibilities involved in pharmacy operations.
              </p>
              <p className="mb-3">
                The programme can cover the following learning areas, subject to
                the institute&apos;s confirmed syllabus:
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Basic Pharmaceutical Knowledge:</strong> Understand
                  the fundamentals of pharmaceutical science and commonly used
                  medicine categories.
                </li>
                <li>
                  <strong>Medicine Identification:</strong> Learn about
                  different types of medicines, their classification and basic
                  identification.
                </li>
                <li>
                  <strong>Medicine Storage and Handling:</strong> Understand the
                  importance of proper storage, handling and organisation of
                  pharmaceutical products.
                </li>
                <li>
                  <strong>Prescription Fundamentals:</strong> Develop an
                  introductory understanding of prescriptions and common
                  prescription terminology.
                </li>
                <li>
                  <strong>Inventory Management:</strong> Learn about stock
                  organisation, inventory maintenance and basic pharmacy record
                  management.
                </li>
                <li>
                  <strong>Pharmacy Operations:</strong> Understand the everyday
                  activities and responsibilities involved in assisting pharmacy
                  professionals.
                </li>
                <li>
                  <strong>Healthcare Communication:</strong> Develop
                  communication skills for interacting professionally with
                  customers and healthcare personnel.
                </li>
              </ul>
            </div>

            {/* 7. Career Opportunities After Pharmacy Assistant Training */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                7. Career Opportunities After Pharmacy Assistant Training
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Career Opportunities After Completing a Pharmacy
                Assistant Course
              </p>
              <p className="mb-3">
                Pharmacy Assistant training can help learners develop
                foundational knowledge and skills relevant to pharmacy
                operations and healthcare support.
              </p>
              <p className="mb-2">
                Depending on their qualifications, skills and applicable
                regulatory requirements, students may explore opportunities such
                as:
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Pharmacy Assistant</li>
                <li>Medical Store Assistant</li>
                <li>Pharmacy Inventory Assistant</li>
                <li>Pharmaceutical Store Assistant</li>
                <li>Healthcare Support Assistant</li>
                <li>Pharmacy Billing Assistant</li>
                <li>Medicine Store Support Staff</li>
                <li>Pharmacy Operations Assistant</li>
              </ul>

              <p className="mt-3">
                The opportunities available to each student may depend on
                employer requirements and applicable professional regulations.
              </p>
              <p className="mt-1">
                Start developing your skills today and explore opportunities in
                the pharmaceutical and healthcare sector.
              </p>
            </div>

            {/* 8. Who Can Join Our Pharmacy Assistant Course? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                8. Who Can Join Our Pharmacy Assistant Course?
              </h3>
              <p className="mb-2">
                Our Pharmacy Assistant Training in Kolkata may be suitable for:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Students interested in the pharmaceutical sector.</li>
                <li>Individuals interested in healthcare education.</li>
                <li>Students looking to develop pharmacy-related skills.</li>
                <li>Individuals interested in medical store operations.</li>
                <li>Candidates seeking foundational knowledge of medicines.</li>
                <li>People looking to explore healthcare support roles.</li>
              </ul>
              <p className="mt-3">
                For information about minimum educational qualifications,
                eligibility and admission requirements, contact Global Technical
                Institute.
              </p>
            </div>

            {/* 9. Certification and Training */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                9. Certification and Training
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Build Your Knowledge with Structured Pharmacy Training
              </p>
              <p className="mb-3">
                Global Technical Institute highlights its institutional
                certification associations and training credentials in its
                promotional materials.
              </p>
              <p className="mb-3">
                The Pharmacy Assistant programme is designed to provide students
                with foundational pharmaceutical knowledge and
                practical-oriented training over one year.
              </p>
              <p>
                Students should contact the institute to confirm the specific
                certificate awarded after successful completion, the awarding
                organisation and the applicable course recognition details.
              </p>
            </div>

            {/* 10. Admission Process */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                10. Admission Process
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                How to Apply for a Pharmacy Assistant Course in Kolkata?
              </p>
              <p className="mb-3">
                Starting your pharmacy training journey at Global Technical
                Institute is simple.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Contact Us:</strong> Call our admission team to
                  enquire about the Pharmacy Assistant programme.
                </li>
                <li>
                  <strong>Get Course Details:</strong> Understand the course
                  duration, syllabus, eligibility and fees.
                </li>
                <li>
                  <strong>Complete Registration:</strong> Submit the required
                  documents and complete the admission process.
                </li>
                <li>
                  <strong>Begin Your Training:</strong> Join the programme
                  according to the available batch schedule.
                </li>
                <li>
                  <strong>Develop Your Skills:</strong> Participate in the
                  training and learning activities.
                </li>
              </ul>

              <p className="mt-3 font-semibold text-gray-800">
                Admissions Open – Limited Seats
              </p>
            </div>

            {/* 11. FAQs */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                11. FAQs
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    1. Which is a good Pharmacy Assistant Institute in Kolkata?
                  </p>
                  <p>
                    Global Technical Institute offers a 1-year Pharmacy
                    Assistant Training Programme with practical-oriented
                    learning and faculty guidance.{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Contact GTI
                    </Link>{" "}
                    for complete course and admission details.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    2. What is the duration of the Pharmacy Assistant Course in
                    Kolkata?
                  </p>
                  <p>
                    The Pharmacy Assistant Training Programme at Global
                    Technical Institute has a duration of one year.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    3. Does Global Technical Institute offer a Pharmacy Course
                    in Kolkata?
                  </p>
                  <p>
                    Yes. GTI offers a one-year Pharmacy Assistant Training
                    Programme for students interested in learning about pharmacy
                    operations and pharmaceutical fundamentals.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    4. What will I learn in Pharmacy Assistant Training?
                  </p>
                  <p>
                    Students can learn about basic pharmaceutical knowledge,
                    medicine identification, medicine storage, prescription
                    fundamentals, pharmacy operations and inventory management,
                    according to the confirmed course syllabus.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    5. Is practical training available?
                  </p>
                  <p>
                    Global Technical Institute highlights practical-oriented
                    training as part of its Pharmacy Assistant programme.
                    Contact the institute for details about the practical
                    training structure.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    6. Does GTI provide placement support?
                  </p>
                  <p>
                    GTI advertises placement support for eligible students.
                    Contact the admission team to understand the available
                    support and placement process.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    7. What are the career opportunities after completing the
                    course?
                  </p>
                  <p>
                    Students may explore opportunities in pharmacy assistance,
                    medical store operations, pharmacy inventory and healthcare
                    support, subject to relevant qualifications and employer
                    requirements.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    8. Where is Global Technical Institute located?
                  </p>
                  <p>
                    Global Technical Institute is located at:
                    <br />
                    17A Haromohan Ghosh Lane, Kolkata – 700085, near Surah Kanya
                    School.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    9. How can I apply for admission?
                  </p>
                  <p>
                    You can contact{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Global Technical Institute
                    </Link>{" "}
                    at{" "}
                    <a
                      href="tel:9231551285"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      9231551285
                    </a>{" "}
                    or{" "}
                    <a
                      href="tel:9230113485"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      9230113485
                    </a>{" "}
                    for admission enquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Closing Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Start Your Pharmacy Assistant Training Journey Today!
              </h3>
              <p className="mb-3">
                Join Global Technical Institute, Kolkata and take the first step
                towards building your future in the healthcare and
                pharmaceutical sector.
              </p>
              <p className="mb-3">
                Enrol in our 1-Year Pharmacy Assistant Course in Kolkata and
                develop essential knowledge and practical skills with guidance
                from experienced faculty.
              </p>

              <p className="font-semibold text-gray-800 mb-1">
                Admissions Open – Limited Seats!
              </p>
              <p className="mb-2">Why Wait? Enquire Today!</p>

              <p className="space-y-1">
                <span>
                  📞 Call for Admission:{" "}
                  <a
                    href="tel:9231551285"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    9231551285
                  </a>{" "}
                  /{" "}
                  <a
                    href="tel:9230113485"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    9230113485
                  </a>
                </span>
                <br />
                <span>
                  📍 Address: 17A Haromohan Ghosh Lane, Kolkata – 700085 (Near
                  Surah Kanya School)
                </span>
                <br />
                <span>
                  🌐 Website:{" "}
                  <Link
                    href="/"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    www.globaltechnicalinstitute.com
                  </Link>
                </span>
              </p>

              <p className="font-semibold text-gray-800 pt-3">
                Your Career in Healthcare Starts with the Right Training!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
