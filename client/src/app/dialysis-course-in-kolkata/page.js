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
          <h1 className="text-5xl font-bold">Dialysis Course</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/dialysis/Diploma.png"
            alt="Dialysis training image 1"
            className="shadow-lg w-full object-cover"
          />
          {/* <img
            src="/image/x-ray/WhatsApp-Image-2025-02-13-at-2.21.06-PM-1-1536x1156-1-400x300.webp"
            alt="Dialysis training image 2"
            className="shadow-lg w-full object-cover"
          /> */}
        </div>

        <div className="md:col-span-7">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="bg-blue-100 font-semibold text-gray-900">
                  <td className="px-4 py-3 w-1/3">COURSE NAME:</td>
                  <td className="px-4 py-3">
                    Certificate & Diploma in Dialysis Technology
                  </td>
                </tr>
                <tr className="bg-orange-100">
                  <td className="px-4 py-3 font-medium">CERTIFICATE:</td>
                  <td className="px-4 py-3">
                    Govt registered certificate on dialysis technology
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">COURSE DURATION:</td>
                  <td className="px-4 py-3">1 Year/ 2 Years</td>
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
                  <td className="px-4 py-3">2 classes per week (Sat & Sun)</td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="px-4 py-3 font-medium">
                    MINIMUM QUALIFICATION:
                  </td>
                  <td className="px-4 py-3">10 th / 12 th</td>
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
                  <td className="px-4 py-3">6 Months / 1 Year</td>
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
            Dialysis Course in Kolkata
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
            <p className="font-semibold text-gray-800 text-lg">
              Build Your Future in Healthcare with Professional Dialysis
              Technology Training
            </p>

            <p>
              Are you interested in building a career in the healthcare and
              medical technology sector? Join the Dialysis Course in Kolkata at
              Global Technical Institute (GTI) and develop foundational
              knowledge and practical skills in dialysis technology.
            </p>

            <p>
              Our training programmes are designed for students who want to
              learn about kidney care, dialysis procedures, dialysis equipment
              and the fundamentals of patient care.
            </p>

            <p>
              If you are searching for a professional Dialysis Training
              Institute in Kolkata, Global Technical Institute offers structured
              training programmes with practical-oriented learning, experienced
              faculty and career guidance.
            </p>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Available Courses:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Certificate in Dialysis Technology – 1 Year</li>
                <li>Diploma in Dialysis Technology – 2 Years</li>
              </ul>
              <p className="mt-2">
                <strong>Admissions Open</strong> |{" "}
                <strong>Two Course Options</strong>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Course Highlights:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Practical-Oriented Training</li>
                <li>Experienced Faculty</li>
                <li>Career Guidance</li>
                <li>Placement Support</li>
                <li>Skill Development</li>
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
                Your Destination for Dialysis Training Institute in Kolkata
              </p>
              <p className="mb-3">
                Choosing the right Dialysis Technology Institute in Kolkata is
                an important step towards developing knowledge and skills in the
                healthcare sector.
              </p>
              <p className="mb-3">
                Global Technical Institute provides structured dialysis
                technology training programmes for individuals interested in
                learning about kidney care, dialysis procedures and healthcare
                support services.
              </p>
              <p className="mb-3">
                Our training approach focuses on theoretical understanding,
                practical-oriented learning and guidance from experienced
                faculty to help students develop familiarity with dialysis
                technology and its applications in healthcare settings.
              </p>
              <p className="mb-3">
                The programmes are designed to introduce students to dialysis
                equipment, basic renal care concepts, patient monitoring
                fundamentals and essential healthcare practices.
              </p>
              <p>
                If you are looking for a reputed Dialysis Training Institute in
                Kolkata, explore the certificate and diploma programmes
                available at Global Technical Institute.
              </p>
            </div>

            {/* 4. Our Dialysis Technology Courses */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                4. Our Dialysis Technology Courses
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Our Dialysis Technology Course in Kolkata
              </p>
              <p className="mb-4">
                Global Technical Institute offers two programme options for
                students interested in dialysis technology. Choose the course
                that suits your educational background and learning objectives.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Certificate in Dialysis Technology – 1 Year
                  </h4>
                  <p>
                    <strong>Course Duration:</strong> 1 Year
                  </p>
                  <p className="mt-1">
                    The Certificate in Dialysis Technology is designed for
                    individuals interested in developing foundational knowledge
                    of dialysis technology and kidney care.
                  </p>
                  <p className="mt-1">
                    The programme introduces students to the fundamentals of
                    dialysis, medical equipment and basic patient care concepts.
                  </p>
                  <p className="font-semibold text-gray-800 mt-2 mb-1">
                    Key Learning Areas:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Introduction to dialysis technology</li>
                    <li>Fundamentals of kidney function</li>
                    <li>Basic understanding of renal diseases</li>
                    <li>Introduction to haemodialysis</li>
                    <li>Dialysis equipment and machine familiarisation</li>
                    <li>Basic patient care principles</li>
                    <li>Infection prevention and control</li>
                    <li>Patient monitoring fundamentals</li>
                  </ul>
                  <p className="mt-2">
                    <strong>CTA:</strong>{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Enquire About Certificate Course
                    </Link>
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="text-xl font-bold text-gray-800">
                    Diploma in Dialysis Technology – 2 Years
                  </h4>
                  <p>
                    <strong>Course Duration:</strong> 2 Years
                  </p>
                  <p className="mt-1">
                    The Diploma in Dialysis Technology is designed for students
                    who want to develop a broader understanding of dialysis
                    procedures, renal healthcare and medical technology.
                  </p>
                  <p className="mt-1">
                    The programme aims to build foundational theoretical
                    knowledge and practical familiarity with dialysis-related
                    healthcare practices.
                  </p>
                  <p className="font-semibold text-gray-800 mt-2 mb-1">
                    Key Learning Areas:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Introduction to renal anatomy and physiology</li>
                    <li>Understanding kidney-related disorders</li>
                    <li>Principles of dialysis treatment</li>
                    <li>Introduction to haemodialysis procedures</li>
                    <li>Dialysis machines and equipment</li>
                    <li>Patient preparation and monitoring</li>
                    <li>Infection control and safety practices</li>
                    <li>Fundamentals of renal patient care</li>
                    <li>Introduction to dialysis unit operations</li>
                  </ul>
                  <p className="mt-2">
                    <strong>CTA:</strong>{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Enquire About Diploma Course
                    </Link>
                  </p>
                </div>

                <p className="italic text-gray-600 mt-2">
                  Note: The above learning topics are suggested content areas.
                  Confirm the final syllabus, practical modules and course
                  eligibility with GTI before publishing.
                </p>
              </div>
            </div>

            {/* 5. Why Choose Global Technical Institute? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                5. Why Choose Global Technical Institute?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Why Choose the Best Dialysis Training Institute in Kolkata?
              </p>
              <p className="mb-3">
                Selecting the right institute is essential when starting your
                journey in the healthcare sector. Global Technical Institute
                focuses on providing structured education, practical-oriented
                training and student guidance.
              </p>
              <p className="mb-3">
                Here are some reasons to consider GTI for your dialysis
                technology training:
              </p>

              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Practical-Oriented Training:</strong> Develop
                  familiarity with dialysis technology and healthcare practices
                  through practical-oriented learning.
                </li>
                <li>
                  <strong>Experienced Faculty:</strong> Learn with guidance from
                  experienced teaching professionals who support your academic
                  development.
                </li>
                <li>
                  <strong>Two Course Options:</strong> Choose between a one-year
                  Certificate Course and a two-year Diploma Course in Dialysis
                  Technology.
                </li>
                <li>
                  <strong>Career Guidance:</strong> Receive guidance to
                  understand potential career opportunities in the healthcare
                  and medical technology sectors.
                </li>
                <li>
                  <strong>Skill Development:</strong> Develop foundational
                  knowledge of dialysis equipment, patient care concepts and
                  renal healthcare.
                </li>
                <li>
                  <strong>Placement Support:</strong> GTI provides placement
                  support to help eligible students explore relevant career
                  opportunities.
                </li>
              </ol>

              <p className="mt-3">
                If you are searching for the Best Dialysis Training Institute in
                Kolkata, explore the programmes offered by Global Technical
                Institute.
              </p>
            </div>

            {/* 6. What Will You Learn During Dialysis Technology Training? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                6. What Will You Learn During Dialysis Technology Training?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Develop Your Skills Through Dialysis Technician Training in
                Kolkata
              </p>
              <p className="mb-3">
                A structured Dialysis Technician Course in Kolkata should help
                students understand the fundamentals of dialysis technology,
                renal healthcare and patient care.
              </p>
              <p className="mb-3">
                The following learning areas can help students build
                foundational knowledge of the subject.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Understanding Kidney Function:</strong> Learn about
                  the basic structure and functions of the kidneys and their
                  importance in maintaining overall health.
                </li>
                <li>
                  <strong>Introduction to Dialysis:</strong> Understand the
                  fundamentals of dialysis and how it supports patients with
                  impaired kidney function.
                </li>
                <li>
                  <strong>Haemodialysis Fundamentals:</strong> Develop an
                  introductory understanding of haemodialysis procedures,
                  equipment and treatment principles.
                </li>
                <li>
                  <strong>Dialysis Equipment:</strong> Learn about dialysis
                  machines, their basic components and their role in dialysis
                  treatment.
                </li>
                <li>
                  <strong>Patient Care and Monitoring:</strong> Understand basic
                  patient care principles and the importance of monitoring
                  patients during dialysis procedures.
                </li>
                <li>
                  <strong>Infection Control:</strong> Learn about hygiene,
                  infection prevention and safety practices in healthcare
                  environments.
                </li>
                <li>
                  <strong>Renal Healthcare:</strong> Develop foundational
                  knowledge of kidney-related disorders and renal patient care.
                </li>
              </ul>
            </div>

            {/* 7. Career Opportunities After Dialysis Technology Training */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                7. Career Opportunities After Dialysis Technology Training
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Career Opportunities After Completing a Dialysis
                Technician Course
              </p>
              <p className="mb-3">
                Dialysis technology education can help students develop
                foundational knowledge and skills relevant to renal healthcare
                and medical support services.
              </p>
              <p className="mb-2">
                Depending on their qualifications, skills, additional
                certifications and applicable professional requirements,
                learners may explore opportunities such as:
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Dialysis Technician Assistant</li>
                <li>Dialysis Unit Assistant</li>
                <li>Renal Care Assistant</li>
                <li>Dialysis Equipment Support Assistant</li>
                <li>Healthcare Support Assistant</li>
                <li>Patient Care Assistant</li>
                <li>Hospital Support Staff</li>
                <li>Dialysis Centre Support Staff</li>
              </ul>

              <p className="mt-3">
                Career opportunities depend on employer requirements, clinical
                competencies and applicable healthcare regulations.
              </p>
              <p className="mt-1">
                Build your healthcare knowledge today and explore opportunities
                in the field of dialysis technology.
              </p>
            </div>

            {/* 8. Who Can Join Our Dialysis Technology Course? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                8. Who Can Join Our Dialysis Technology Course?
              </h3>
              <p className="mb-2">
                Our Dialysis Course in Kolkata may be suitable for:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Students interested in healthcare education.</li>
                <li>
                  Individuals interested in kidney care and renal healthcare.
                </li>
                <li>Students looking to develop medical technology skills.</li>
                <li>
                  Individuals interested in hospital and dialysis unit
                  operations.
                </li>
                <li>Candidates interested in healthcare support roles.</li>
                <li>
                  People looking to develop knowledge in dialysis technology.
                </li>
              </ul>
              <p className="mt-3">
                For information about minimum educational qualifications,
                eligibility and admission requirements, contact Global Technical
                Institute.
              </p>
            </div>

            {/* 9. Practical Training and Student Development */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                9. Practical Training and Student Development
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Develop Practical Knowledge Through Dialysis Technician Training
                in Kolkata
              </p>
              <p className="mb-3">
                Practical learning plays an important role in understanding
                dialysis technology and healthcare procedures.
              </p>
              <p className="mb-3">
                At Global Technical Institute, practical-oriented training is an
                important feature of the advertised dialysis technology
                programmes.
              </p>
              <p className="mb-3">
                Students can develop familiarity with relevant equipment,
                healthcare practices and the fundamentals of renal patient care
                as specified in the course syllabus.
              </p>

              <p className="font-semibold text-gray-800 mb-1">
                Training Highlights:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Practical-oriented learning</li>
                <li>Guidance from experienced faculty</li>
                <li>Introduction to dialysis equipment</li>
                <li>Healthcare safety awareness</li>
                <li>Patient care fundamentals</li>
                <li>Career guidance and placement support</li>
              </ul>

              <p className="mt-3">
                Contact GTI to understand the practical training arrangements
                and any associated clinical or hospital exposure.
              </p>
            </div>

            {/* 10. Admission Process */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                10. Admission Process
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                How to Apply for a Dialysis Course in Kolkata?
              </p>
              <p className="mb-3">
                Starting your dialysis technology training journey at Global
                Technical Institute is simple.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Contact Us:</strong> Call our admission team to
                  enquire about the available courses.
                </li>
                <li>
                  <strong>Choose Your Course:</strong> Select the one-year
                  Certificate or two-year Diploma programme.
                </li>
                <li>
                  <strong>Get Course Details:</strong> Confirm eligibility,
                  fees, syllabus and admission requirements.
                </li>
                <li>
                  <strong>Complete Registration:</strong> Submit the required
                  documents and complete the admission process.
                </li>
                <li>
                  <strong>Begin Your Training:</strong> Join the programme
                  according to the available batch schedule.
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
                    1. Which is a good Dialysis Training Institute in Kolkata?
                  </p>
                  <p>
                    Global Technical Institute offers Certificate and Diploma
                    programmes in Dialysis Technology with practical-oriented
                    training, experienced faculty and career guidance.{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Contact GTI
                    </Link>{" "}
                    for complete admission details.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    2. What is the duration of the Dialysis Course in Kolkata at
                    GTI?
                  </p>
                  <p>GTI offers two options:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Certificate in Dialysis Technology – 1 Year</li>
                    <li>Diploma in Dialysis Technology – 2 Years</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    3. Does Global Technical Institute offer a Dialysis
                    Technician Course in Kolkata?
                  </p>
                  <p>
                    Yes. Global Technical Institute offers dialysis technology
                    training programmes for students interested in developing
                    foundational knowledge and skills in this healthcare field.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    4. What is covered in a Dialysis Technology Course in
                    Kolkata?
                  </p>
                  <p>
                    The course may cover kidney function, dialysis fundamentals,
                    haemodialysis, dialysis equipment, patient care, infection
                    control and renal healthcare, according to the confirmed
                    syllabus.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    5. Is practical training available at GTI?
                  </p>
                  <p>
                    GTI highlights practical-oriented training as a feature of
                    its dialysis technology programmes. Contact the institute
                    for details about practical sessions and clinical exposure.
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
                    7. What are the career opportunities after dialysis
                    technology training?
                  </p>
                  <p>
                    Students may explore opportunities in dialysis units, renal
                    healthcare facilities and hospital support services,
                    depending on their qualifications and employer requirements.
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
                    9. How can I apply for admission to GTI?
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
                Start Your Career Journey in Dialysis Technology Today!
              </h3>
              <p className="mb-3">
                Join Global Technical Institute, Kolkata and take the next step
                towards building your future in the healthcare sector.
              </p>
              <p className="mb-3">
                Enrol in our Dialysis Course in Kolkata and develop essential
                knowledge and practical skills through our structured training
                programmes.
              </p>

              <p className="font-semibold text-gray-800 mb-1">
                Choose Your Course:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Certificate in Dialysis Technology – 1 Year</li>
                <li>Diploma in Dialysis Technology – 2 Years</li>
              </ul>

              <p className="font-semibold text-gray-800 mb-1">
                Why Choose GTI?
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Practical-Oriented Training</li>
                <li>Experienced Faculty</li>
                <li>Career Guidance</li>
                <li>Placement Support</li>
              </ul>

              <p className="font-semibold text-gray-800 mb-1">
                Admissions Open – Limited Seats!
              </p>
              <p className="mb-2">
                Take the First Step Towards Your Future. Enquire Today!
              </p>

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
                Build Your Skills Today. Explore Your Future in Dialysis
                Technology!
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
