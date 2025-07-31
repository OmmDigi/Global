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
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/image/bg.jpg')" }} // replace with your image path
        ></div>
        <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
          <h1 className="text-5xl font-bold"> Our Speciality</h1>
        </div>
      </div>
      <section>
        <div id="about" className="w-full bg-gray-100 py-12 px-4">
          <div>
            <p className="text-center font-semibold">
              {" "}
              <span>
                <Link href="/" className="underline">
                  Global Technical Institute{" "}
                </Link>
              </span>
              Global Technical Institute offers a variety of unique selling
              points (USPs) that set it apart from other technical education and
              training providers. Some of our speciality include:
            </p>
          </div>

          <div id="about" className="w-full bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center">
              <div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/Programs-80x80.gif"
                      alt="Industry-Driven Programs"
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                  </div>
                  <div className="max-w-md">
                    <div className="text-lg font-semibold mb-2">
                      Industry-Driven Programs
                    </div>
                    <div className="text-sm text-gray-600">
                      GTI offers programs and courses that are designed in
                      collaboration with industry experts and partners to ensure
                      that students receive relevant and up-to-date training.
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center text-center p-6">
                  {/* Icon */}
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/facility-80x80.webp"
                      alt="State-of-the-Art Facilities"
                      width={80}
                      height={80}
                      className="mx-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="max-w-md">
                    <h2 className="text-lg font-semibold mb-2">
                      State-of-the-Art Facilities
                    </h2>
                    <p className="text-sm text-gray-600">
                      GTI’s facilities are equipped with the latest technology
                      and equipment, providing students with a hands-on learning
                      experience.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center text-center p-6">
                  {/* Icon */}
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/Instructors-80x80.gif"
                      alt="State-of-the-Art Facilities"
                      width={80}
                      height={80}
                      className="mx-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="max-w-md">
                    <h2 className="text-lg font-semibold mb-2">
                      Experienced Instructors
                    </h2>
                    <p className="text-sm text-gray-600">
                      GTI instructors are highly experienced and certified
                      professionals in their respective fields. They bring their
                      real-world experience and knowledge into the classroom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center">
              <div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/Certifications-80x80.gif"
                      alt="Industry-Driven Programs"
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                  </div>
                  <div className="max-w-md">
                    <div className="text-lg font-semibold mb-2">
                      Professional Certifications
                    </div>
                    <div className="text-sm text-gray-600">
                      GTI offers a wide range of professional certification
                      programs. These certifications help students to advance
                      their careers and increase their earning potential.
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center text-center p-6">
                  {/* Icon */}
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/placement-80x80.gif"
                      alt="State-of-the-Art Facilities"
                      width={80}
                      height={80}
                      className="mx-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="max-w-md">
                    <h2 className="text-lg font-semibold mb-2">
                      Career Services
                    </h2>
                    <p className="text-sm text-gray-600">
                      GTI offers career services to help students with job
                      placement and career development. These services include
                      resume writing and interview preparation.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center text-center p-6">
                  {/* Icon */}
                  <div className="mb-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/Flexible-80x80.gif"
                      alt="State-of-the-Art Facilities"
                      width={80}
                      height={80}
                      className="mx-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="max-w-md">
                    <h2 className="text-lg font-semibold mb-2">
                      Flexible Learning Options:
                    </h2>
                    <p className="text-sm text-gray-600">
                      GTI offers flexible learning options, including online,
                      on-campus, and hybrid programs, to accommodate students’
                      schedules and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* others facility  */}
        <section className="py-10 px-4 bg-white">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold border-b-4  inline-block pb-1">
              Others Facilities
            </h2>
          </div>

          {/* Facility Grid */}
          <div className=" flex justify-center items-center">
            <div className="grid grid-cols-1 text-start sm:grid-cols-2 md:grid-cols-4  mb-8 w-11/12 ">
              {/* Column 1 */}
              <ul className="list-disc  list-inside text-gray-700 space-y-1">
                <li>Campus interview assistance</li>
                <li>Special facility for working candidates</li>
                <li>100% job oriented training</li>
              </ul>
  
              {/* Column 2 */}
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Smart className (Digital className)</li>
                <li>Special attention to the weak students</li>
                <li>C.C.T.V Surveillance</li>
              </ul>

              {/* Column 3 */}
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Smart className (Digital className)</li>
                <li>Industry experienced faculty</li>
                <li>Flexible className timing</li>
              </ul>

              {/* Column 4 */}
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Special remedial classes</li>
                <li>Computer Classes</li>
                <li>Inter Branch / Centre competition</li>
              </ul>
            </div>
          </div>

          {/* Conclusion Section */}
          <div className="max-w-4xl mx-4 text-gray-800 md:ml-15  leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
            <p>
              Our speciality makes it an excellent choice for students who want
              to receive high-quality technical education and training that will
              prepare them for success in their chosen field. Discover
              excellence at our Kolkata training institute. We excel in
              personalized guidance, industry-aligned curriculum, and hands-on
              experience. With expert instructors and state-of-the-art
              facilities, we nurture talent, empowering individuals to thrive in
              their chosen fields.
              <Link
                href="/contact-us"
                className=" underline font-semibold ml-1"
              >
                Contact us&nbsp;
              </Link>
              and unlock your potential for success in today’s competitive
              landscape. You can also visit our
              <Link
                href="https://www.facebook.com/gtitrainingcourse"
                className=" underline font-semibold ml-1"
              >
                Facebook Page&nbsp;
              </Link>
              for more information.
            </p>
          </div>
        </section>
       
        <div>
          <div className="group relative m-0 flex h-full w-full  shadow-xl   ">
            <div className="z-10   overflow-hidden  border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:opacity-70 w-full h-full flex justify-center items-center">
              <img
                src="/image/bg.jpg"
                className="animate-fade-in block  scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                alt="State-of-the-Art Facilities"
                width={1000}
                height={380}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
