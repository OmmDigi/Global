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
          <h1 className="text-5xl font-bold">Yoga Course</h1>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-10 bg-white text-gray-800">
        <div className="md:col-span-5 space-y-6">
          <img
            src="/image/yoga/Hatha Yoga.png"
            alt="Yoga training session image 1"
            className="shadow-lg w-full object-cover"
          />
          {/* <img
            src="/image/x-ray/WhatsApp-Image-2025-02-13-at-2.21.06-PM-1-1536x1156-1-400x300.webp"
            alt="Yoga training session image 2"
            className="shadow-lg w-full object-cover"
          /> */}
        </div>

        <div className="md:col-span-7">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
            <tbody>
              <tr className="bg-blue-100">
                <td className="px-4 py-2 font-semibold">COURSE NAME:</td>
                <td className="px-4 py-2">Yoga Training</td>
              </tr>
              <tr className="bg-orange-100">
                <td className="px-4 py-2 font-semibold">CERTIFICATE:</td>
                <td className="px-4 py-2">
                  1) Diploma in Yoga
                  <br />
                  2) Diploma in Yoga and Naturopathy
                </td>
              </tr>
              <tr className="bg-blue-100">
                <td className="px-4 py-2 font-semibold">COURSE DURATION:</td>
                <td className="px-4 py-2">1 or 2 Years</td>
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
                  3) World Skill Council (WSC)
                </td>
              </tr>
              <tr className="bg-blue-100">
                <td className="px-4 py-2 font-semibold">SESSION:</td>
                <td className="px-4 py-2">3 Sessions (Jan, May, Sept)</td>
              </tr>
              <tr className="bg-orange-100">
                <td className="px-4 py-2 font-semibold">NO.OF CLASSES:</td>
                <td className="px-4 py-2">2 Classes per week</td>
              </tr>
              <tr className="bg-blue-100">
                <td className="px-4 py-2 font-semibold">
                  MINIMUM QUALIFICATION:
                </td>
                <td className="px-4 py-2">10th/H.S Pass</td>
              </tr>
              <tr className="bg-orange-100">
                <td className="px-4 py-2 font-semibold">DOCUMENTS REQUIRED:</td>
                <td className="px-4 py-2">
                  1) Photo (6 Copies)
                  <br />
                  2) Attested Copies of Last Passed Marksheet
                  <br />
                  3) H.S Admit Card
                  <br />
                  4) Any Photo ID Proof
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gray-100 p-4 rounded-md mt-6">
            <h4 className="text-blue-800 font-semibold mb-2">
              Special Modules for Skill Development:
            </h4>
            <p>
              1) Personality Development & Grooming Session
              <br />
              2) Hands-on Practical & Demonstration Classes
              <br />
              3) Workshop
              <br />
              4) Clinical Assessment
              <br />
              5) Patient Assistance Live Session
            </p>
          </div>
        </div>
      </section>

      {/* body content */}
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white p-6 md:p-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Yoga Training Course in Kolkata
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
            <p className="font-semibold text-gray-800 text-lg">
              Build Your Knowledge of Yoga, Meditation & Naturopathy with Global
              Technical Institute
            </p>

            <p>
              Are you passionate about yoga, health and wellness? Turn your
              passion into professional skills with the{" "}
              <strong>Yoga Training Course in Kolkata</strong> at{" "}
              <strong>Global Technical Institute (GTI)</strong>.
            </p>

            <p>
              Our diploma programmes are designed for individuals who want to
              understand yoga practices, meditation techniques, pranayama and
              the fundamentals of naturopathy through structured learning and
              practical-oriented training.
            </p>

            <p>
              If you are searching for a trusted{" "}
              <strong>Yoga Institute in Kolkata</strong>, GTI provides
              diploma-level learning opportunities to help you develop knowledge
              and skills in the field of yoga and wellness.
            </p>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Available Courses:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Diploma in Yoga – 1 Year</li>
                <li>Diploma in Yoga and Naturopathy – 2 Years</li>
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

            {/* 2. About Global Technical Institute */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                2. About Global Technical Institute
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Your Destination for a Yoga Training Institute in Kolkata
              </p>
              <p className="mb-3">
                Choosing the right <strong>Yoga Institute in Kolkata</strong> is
                an important step towards building knowledge and skills in the
                field of yoga and wellness.
              </p>
              <p className="mb-3">
                Global Technical Institute provides structured training
                programmes with an emphasis on theoretical understanding,
                practical learning and faculty guidance.
              </p>
              <p className="mb-3">
                Our objective is to help students develop a better understanding
                of traditional yoga practices and their applications in everyday
                life and wellness education.
              </p>
              <p className="mb-3">
                At GTI, students can explore yoga as a discipline that combines
                physical practices, breathing techniques, meditation and a
                holistic approach to well-being.
              </p>
              <p>
                If you are looking for a professional{" "}
                <strong>Yoga Training Institute in Kolkata</strong> where you
                can pursue structured diploma-level learning, explore the
                programmes available at Global Technical Institute.
              </p>
            </div>

            {/* 3. Our Yoga Diploma Courses */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                3. Our Yoga Diploma Courses
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Our Yoga Course in Kolkata
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Diploma in Yoga – 1 Year
                  </h4>
                  <p className="mt-1">
                    The <strong>Diploma in Yoga in Kolkata</strong> at Global
                    Technical Institute is designed for individuals interested
                    in learning yoga fundamentals, physical postures, breathing
                    exercises and meditation practices.
                  </p>
                  <p className="font-semibold text-gray-800 mt-2 mb-1">
                    What You Can Learn:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Introduction to yoga and its principles</li>
                    <li>Basic yoga asanas and postures</li>
                    <li>Pranayama and breathing techniques</li>
                    <li>Meditation and relaxation practices</li>
                    <li>Yoga practice and teaching fundamentals</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Course Duration:</strong> 1 Year
                  </p>
                  <p className="mt-1">
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Enquire About Diploma in Yoga
                    </Link>
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="text-xl font-bold text-gray-800">
                    Diploma in Yoga and Naturopathy – 2 Years
                  </h4>
                  <p className="mt-1">
                    The <strong>Diploma in Yoga and Naturopathy</strong>{" "}
                    programme is intended for students who want to explore yoga
                    alongside the fundamentals of naturopathy and holistic
                    wellness.
                  </p>
                  <p className="font-semibold text-gray-800 mt-2 mb-1">
                    Learning Areas:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Foundations of yoga</li>
                    <li>Yoga asanas and pranayama</li>
                    <li>Meditation and relaxation</li>
                    <li>Introduction to naturopathy</li>
                    <li>Natural wellness principles</li>
                    <li>Holistic health awareness</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Course Duration:</strong> 2 Years
                  </p>
                  <p className="mt-1">
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Enquire About Diploma in Yoga and Naturopathy
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Why Choose Global Technical Institute? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                4. Why Choose Global Technical Institute?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Why Choose the Best Yoga Training Institute in Kolkata?
              </p>
              <p className="mb-3">
                Choosing the right institute can make a meaningful difference in
                your learning journey. Global Technical Institute focuses on
                student development through structured education and faculty
                guidance.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Experienced Faculty:</strong> Learn with guidance from
                  experienced teaching professionals.
                </li>
                <li>
                  <strong>Practical-Oriented Learning:</strong> Develop
                  familiarity with yoga practices and techniques through
                  practical learning.
                </li>
                <li>
                  <strong>Structured Diploma Programmes:</strong> Choose between
                  two diploma programmes according to your learning goals.
                </li>
                <li>
                  <strong>Student Guidance:</strong> Receive academic support
                  and guidance throughout your learning journey.
                </li>
                <li>
                  <strong>Skill Development:</strong> Build knowledge and
                  confidence in yoga, meditation and wellness practices.
                </li>
                <li>
                  <strong>Career-Oriented Learning:</strong> Explore potential
                  opportunities in the yoga and wellness sector.
                </li>
              </ul>

              <p className="mt-3">
                If you are searching for the{" "}
                <strong>Best Yoga Training Institute in Kolkata</strong>,
                explore the diploma programmes offered by Global Technical
                Institute.
              </p>
            </div>

            {/* 5. What Will You Learn During Yoga Training? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                5. What Will You Learn During Yoga Training?
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Develop Your Understanding of Yoga and Wellness
              </p>
              <p className="mb-3">
                A structured <strong>Yoga Training Course in Kolkata</strong>{" "}
                should help students understand both the theoretical and
                practical aspects of yoga.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Yoga Fundamentals:</strong> Understand the history,
                  philosophy, principles and importance of yoga.
                </li>
                <li>
                  <strong>Yoga Asanas:</strong> Learn about different yoga
                  postures, body alignment and the fundamentals of yoga
                  practice.
                </li>
                <li>
                  <strong>Pranayama:</strong> Understand breathing techniques
                  and their role in yoga practice.
                </li>
                <li>
                  <strong>Meditation:</strong> Explore meditation,
                  concentration, relaxation and mindfulness practices.
                </li>
                <li>
                  <strong>Naturopathy Fundamentals:</strong> Learn introductory
                  concepts of natural wellness and holistic health through the
                  two-year diploma programme.
                </li>
                <li>
                  <strong>Yoga Teaching Skills:</strong> Develop an
                  understanding of instruction, demonstration and guidance for
                  yoga practice.
                </li>
              </ul>
            </div>

            {/* 6. Career Opportunities After Yoga Training */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                6. Career Opportunities After Yoga Training
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                Explore Career Opportunities After Completing a Yoga Course in
                Kolkata
              </p>
              <p className="mb-3">
                Professional yoga education can help students explore different
                opportunities in the health, fitness and wellness sector.
              </p>
              <p className="mb-2">
                Depending on their qualifications, skills, additional
                certifications and applicable professional requirements,
                learners may explore opportunities such as:
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Yoga Instructor</li>
                <li>Yoga Trainer</li>
                <li>Assistant Yoga Teacher</li>
                <li>Meditation Instructor</li>
                <li>Wellness Centre Assistant</li>
                <li>Yoga Studio Instructor</li>
                <li>Personal Yoga Trainer</li>
                <li>Yoga and Wellness Programme Assistant</li>
              </ul>

              <p className="mt-3">
                Build your knowledge today and explore the possibilities of a
                future in yoga and wellness.
              </p>
            </div>

            {/* 7. Who Can Join Our Yoga Training Course? */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                7. Who Can Join Our Yoga Training Course?
              </h3>
              <p className="mb-2">
                Our Yoga Training Course in Kolkata may be suitable for:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Students interested in yoga and wellness education.</li>
                <li>Individuals passionate about yoga and meditation.</li>
                <li>Aspiring yoga instructors and trainers.</li>
                <li>Fitness and wellness enthusiasts.</li>
                <li>Individuals interested in naturopathy.</li>
                <li>
                  People looking to develop additional professional skills.
                </li>
              </ul>
              <p className="mt-3">
                For the exact minimum educational qualification and admission
                requirements, contact the institute.
              </p>
            </div>

            {/* 8. Admission Process */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                8. Admission Process
              </h3>
              <p className="font-semibold text-gray-800 mb-3">
                How to Apply for a Yoga Training Course in Kolkata?
              </p>
              <p className="mb-3">
                Starting your yoga education journey is simple.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Contact Us:</strong> Call our admission team to
                  enquire about the available programmes.
                </li>
                <li>
                  <strong>Choose Your Course:</strong> Select Diploma in Yoga or
                  Diploma in Yoga and Naturopathy.
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
                  <strong>Begin Your Learning Journey:</strong> Join the
                  programme according to the available batch schedule.
                </li>
              </ul>
            </div>

            {/* 9. FAQs */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">9. FAQs</h3>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    1. Which is a good Yoga Institute in Kolkata for diploma
                    courses?
                  </p>
                  <p>
                    Global Technical Institute offers two yoga diploma
                    programmes: Diploma in Yoga (1 Year) and Diploma in Yoga and
                    Naturopathy (2 Years).{" "}
                    <Link
                      href="/contact-us"
                      className="text-blue-600 underline font-semibold hover:text-blue-800"
                    >
                      Contact GTI
                    </Link>{" "}
                    for complete admission information.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    2. What is the duration of the Yoga Training Course in
                    Kolkata?
                  </p>
                  <p>
                    GTI offers a one-year Diploma in Yoga and a two-year Diploma
                    in Yoga and Naturopathy.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    3. Does Global Technical Institute offer a Diploma in Yoga
                    in Kolkata?
                  </p>
                  <p>
                    Yes. Global Technical Institute offers a Diploma in Yoga
                    with a duration of one year.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    4. Is a Diploma in Yoga and Naturopathy available at GTI?
                  </p>
                  <p>
                    Yes. GTI offers a Diploma in Yoga and Naturopathy programme
                    with a duration of two years.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    5. What topics are covered in a Yoga Course in Kolkata?
                  </p>
                  <p>
                    Yoga courses may cover yoga fundamentals, asanas, pranayama,
                    meditation, relaxation techniques and related wellness
                    concepts. The exact syllabus depends on the programme.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    6. Can I pursue yoga training to become a yoga instructor?
                  </p>
                  <p>
                    Yoga training can help develop foundational knowledge and
                    practical skills for exploring teaching opportunities.
                    Professional eligibility may depend on additional
                    qualifications and certification requirements.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    7. Where is Global Technical Institute located?
                  </p>
                  <p>
                    Global Technical Institute is located at 17A Haromohan Ghosh
                    Lane, Kolkata – 700085, near Surah Kanya Vidyalaya.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    8. How can I enquire about admission?
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
                Start Your Yoga Learning Journey Today!
              </h3>
              <p className="mb-3">
                Join Global Technical Institute, Kolkata and explore our Yoga
                Training Course in Kolkata.
              </p>

              <p className="font-semibold text-gray-800 mb-1">
                Choose your preferred programme:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Diploma in Yoga – 1 Year</li>
                <li>Diploma in Yoga and Naturopathy – 2 Years</li>
              </ul>

              <p className="space-y-1">
                <span>
                  📞 Admission Enquiry:{" "}
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
                  📍 Address: 17A Haromohan Ghosh Lane, Kolkata – 700085
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

              <div className="pt-4 flex gap-4">
                <Link
                  href="/contact-us"
                  className="text-blue-600 underline font-semibold hover:text-blue-800"
                >
                  Enquire Now
                </Link>
                <span>|</span>
                <a
                  href="tel:9231551285"
                  className="text-blue-600 underline font-semibold hover:text-blue-800"
                >
                  Call Now
                </a>
              </div>
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
