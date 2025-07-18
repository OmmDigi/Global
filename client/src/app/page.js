"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import ourBranch from "../components/ourBranch";
// import Image from "../../public/image/booking.png";
import Image from "next/image";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BackToTopButton from "@/components/BackToTopButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Marquee from "react-fast-marquee";
import AOSProvider from "@/components/AOSProvider";
import { Gallery } from "@/components/Gallery";

const navigation1 = [
  { name: "HOME", href: "#" },
  { name: "ABOUT US", href: "#" },
  { name: "OUR COURSES", href: "#" },
  { name: "OUR SPECIALITY", href: "#" },
];
const navigation2 = [
  { name: "OUR PLACEMENTS", href: "#" },
  { name: "OUR BLOG", href: "#" },
  { name: "OUR GALLERY", href: "#" },
  { name: "CONTACT US", href: "#" },
];
const navigation3 = [
  {
    name: "Call for Query",
    href: "#",
    image: "/image/booking.png",
    detail: "(+91)9231551285",
  },
  {
    name: "OUR Schedle",
    href: "#",
    image: "/image/clock.png",
    detail: "News & Events",
  },
  {
    name: "Join Our Courses",
    href: "#",
    image: "/image/registration.png",
    detail: "Admission Form",
  },
  { name: "Find US", href: "#", image: "/image/map.png", detail: "Our Branch" },
];

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1200 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1200, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
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

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200"
    >
      <MdKeyboardArrowLeft size={24} />
    </button>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200"
    >
      <MdOutlineKeyboardArrowRight size={24} />
    </button>
  );
};

export default function Home() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <>
      <AOSProvider>
        <Navbar />

        {/* home page description and content */}
        <div className="relative bg-gray-300 overflow-hidden top-0 z-0 ">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center "
            style={{ backgroundImage: "url('/image/instit.jpg')" }}
          ></div>
          <div className="  grid grid-cols-1  bg-gray-100 md:grid-cols-2 md:gap-10 md:items-start  ">
            <div className="w-12/12 md:ml-10  z-0 ">
              <div className="text-[#944a00] hidden ml-10 mt-5 lg:flex flex-col">
                <h1>ISO 9001:2015 CERTIFIED & AFFILATED TO BSS</h1>
              </div>
              <div className="mt-10 md:mt-15 px-4 md:px-8">
                <h5 className="font-bold text-[#1174f7]">
                  Where education meets innovation.
                </h5>
                <h1 className="font-bold text-[#b50000] text-4xl mt-5">
                  Unlock Your Potential with Global Technical Institute{" "}
                </h1>
                <div
                  ref={ref}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center py-5"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {inView && <CountUp end={15} duration={2} suffix="+" />}
                    </div>
                    <div className="mt-2 text-lg font-medium text-gray-700">
                      Years Experience
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {inView && (
                        <CountUp
                          end={3000}
                          duration={3}
                          separator=","
                          suffix="+"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-lg font-medium text-gray-700">
                      Pass out Students
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {inView && (
                        <CountUp
                          end={2500}
                          duration={3}
                          separator=","
                          suffix="+"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-lg font-medium text-gray-700">
                      Placement
                    </div>
                  </div>
                </div>
                {/* Marquee  */}
                {/* <div className="relative flex w-12/12 overflow-x-hidden">
              <div className="py-16 animate-marquee whitespace-nowrap">
                <span className="text-4xl mx-4">Marquee Item 1</span>
                <span className="text-4xl mx-4">Marquee Item 2</span>
                <span className="text-4xl mx-4">Marquee Item 3</span>
                <span className="text-4xl mx-4">Marquee Item 4</span>
                <span className="text-4xl mx-4">Marquee Item 5</span>
              </div>
            </div> */}
              </div>

              <div className="w-full bg-gray-100  flex items-center space-x-4 overflow-hidden">
                <span className="bg-[#b50000] py-2 px-4 text-white   text-sm font-semibold shrink-0">
                  Notice
                </span>
                <Marquee className="relative overflow-hidden flex-1">
                  <ul className="flex whitespace-nowrap animate-marquee gap-12">
                    <li className="text-gray-800 text-sm font-medium">
                      Physiotherapy Course: Enroll now
                    </li>
                    <li className="text-gray-800 text-sm font-medium">
                      Admission is going on: Online & Offline
                    </li>
                    <li className="text-gray-800 text-sm font-medium">
                      ANM Nursing Training is going on: Enroll Now
                    </li>
                    <li className="text-gray-800 text-sm font-medium">
                      Teacher’s Training are going on: Enroll now
                    </li>
                  </ul>
                </Marquee>
              </div>
            </div>

            <div className="w-full flex justify-start items-start px-4 md:px-8 overflow-x-hidden ">
              <div className="w-full md:w-11/12 ">
                <Carousel
                  responsive={responsive2}
                  infinite={true}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  transitionDuration={500}
                  itemClass="carousel-item-padding-40-px"
                  arrows={false}
                  fade={true}
                >
                  <div>
                    <img
                      className="w-12/12 object-cover rounded-lg"
                      src="image/carousal1.png"
                      alt="teachers training institute in Kolkata"
                    />
                  </div>
                  <div>
                    <img
                      className="w-12/12 h-auto object-cover rounded-lg"
                      src="image/carousal2.png"
                      alt="teachers training institute in Kolkata"
                    />
                  </div>
                  <div>
                    <img
                      className="w-12/12 h-auto object-cover rounded-lg"
                      src="image/carousal3.png"
                      alt="teachers training institute in Kolkata"
                    />
                  </div>
                  <div>
                    <img
                      className="w-12/12 h-auto object-cover rounded-lg"
                      src="image/carousal4.png"
                      alt="teachers training institute in Kolkata"
                    />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>

        {/* Your Phone Number */}
        <div className="flex relative justify-center sm:mt-[-140px] ml:mt-[120px] md:mt-[-140px] z-12">
          <section className="bg-blue-500 py-1 p-10 w-12/12 md:w-[96%]   ">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <p className="text-3xl font-bold text-gray-100">
                  Discover Your Ideal
                  <span className="text-gray-100 typed-text"> Career</span>
                  <span className="cursor">&nbsp;</span>
                </p>
              </div>

              <div className="w-full md:w-1/2 rounded-lg p-6 ">
                <p className="text-lg font-medium text-gray-100 mb-4">
                  <i className="fas fa-mobile-alt text-blue-500 mr-2"></i> Your
                  Phone Number
                </p>
                <form
                  method="POST"
                  action="#"
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(+91) 9800000000"
                    required
                    maxLength="15"
                    className="flex-1 w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 bg-gray-100 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="bg-gray-100 text-gray-800 px-6 py-2  transition-all"
                  >
                    CALL ME BACK
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>

        {/* carousal card section  */}
        <div className=" relative mt-[-50] bg-gray-200">
          <div className="w-full   items-start flex justify-evenly py-6">
            <div className="w-full max-w-screen-xl mt-20  items-start ">
              <Carousel
                swipeable={true}
                draggable={true}
                // autoPlay={true}
                responsive={responsive}
                infinite={true}
                autoPlaySpeed={1000}
                transitionDuration={100}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                className="px-0.5 py-6 "
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
              >
                <div className="mx-4 flex justify-center items-center h-full transition-transform duration-300 hover:scale-105">
                  <Link
                    href="/teachers-training-institute-kolkata"
                    className="min-w-[300px]  bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                  >
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2025/04/teach-tra.webp"
                      alt="Teacher Training"
                      className="   w-full h-48 object-cover p-5"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold text-red-500 mb-2">
                        Teacher Training
                      </h4>
                      <p className="text-sm text-gray-600">
                        Choose your ideal stream and subjects.
                      </p>
                      <p className="flex justify-end items-center font-bold text-blue-600">
                        For Detail
                        <img
                          src="image/right-arrow.gif"
                          className="  w-10 h-10  object-cover"
                        />
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="mx-4 flex justify-center items-center h-full transition-transform duration-300 hover:scale-105">
                  <Link
                    href="/nursing-training-in-kolkata"
                    className="min-w-[300px]  gap-10 bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                  >
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2025/04/nurse-tra02a.webp"
                      alt="Nursing Training"
                      className="   w-full h-48 object-cover p-5"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg  text-red-500 font-semibold mb-2">
                        Nursing Training
                      </h4>
                      <p className="text-sm text-gray-600">
                        Decide between a master’s and working
                      </p>
                      <p className="flex justify-end items-center font-bold text-blue-600">
                        For Detail
                        <img
                          src="image/right-arrow.gif"
                          className="  w-10 h-10  object-cover"
                        />
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="mx-4 flex justify-center items-center h-full transition-transform duration-300 hover:scale-105">
                  <Link
                    href="/lab-technician-training-institute"
                    className="min-w-[300px]  gap-10 bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                  >
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2025/04/labtrain01.webp"
                      alt="Lab Technician Training"
                      className="   w-full h-48 object-cover p-5"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg text-red-500 font-semibold mb-2">
                        Lab Technician Training
                      </h4>
                      <p className="text-sm text-gray-600">
                        Finalise your career growth trajectory.
                      </p>
                      <p className="flex justify-end items-center font-bold text-blue-600">
                        For Detail
                        <img
                          src="image/right-arrow.gif"
                          className="  w-10 h-10  object-cover"
                        />
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="mx-4 flex justify-center items-center h-full transition-transform duration-300 hover:scale-105">
                  <Link
                    href="/ecg-technician-training-kolkata"
                    className="min-w-[300px]  gap-10 bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                  >
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2025/04/ecg-train.webp"
                      alt="ECG Technician Training"
                      className="   w-full h-48 object-cover p-5"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg text-red-500 font-semibold mb-2">
                        ECG Technician Training
                      </h4>
                      <p className="text-sm text-gray-600">
                        Choose your right path to help others
                      </p>
                      <p className="flex justify-end items-center font-bold text-blue-600">
                        For Detail
                        <img
                          src="image/right-arrow.gif"
                          className="  w-10 h-10  object-cover"
                        />
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="mx-4 flex justify-center items-center h-full transition-transform duration-300 hover:scale-105">
                  <Link
                    href="/physiotherapy-training-institute-in-kolkata"
                    className="min-w-[300px]  gap-10 bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                  >
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2025/04/physio01t.webp"
                      alt="Physiotherapy Training"
                      className="   w-full h-48 object-cover p-5"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg text-red-500 font-semibold mb-2">
                        Physiotherapy Training
                      </h4>
                      <p className="text-sm text-gray-600">
                        Choose your right path to help others
                      </p>
                      <p className="flex justify-end items-center font-bold text-blue-600">
                        For Detail
                        <img
                          src="image/right-arrow.gif"
                          className="  w-10 h-10   object-cover"
                        />
                      </p>
                    </div>
                  </Link>
                </div>
              </Carousel>
            </div>
          </div>

          {/* div */}
          <div className="text-center py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-1xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
                “Reach high, for the stars lie hidden in you.
                <br />
                Dream deep, for every dream precedes the goal”
              </h4>

              <h5 className="mt-4 text-sm text-gray-500 text-center">
                – Rabindranath Tagore
              </h5>
            </div>
          </div>
        </div>

        {/* small About */}
        <section id="about" className="w-full bg-gray-100 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* small About carousal  */}

            <div data-aos="fade-right">
              <Carousel
                data-aos="fade-right"
                responsive={responsive2}
                infinite={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                transitionDuration={500}
                itemClass="carousel-item-padding-40-px"
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
              >
                <div>
             
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="/image/hom-01.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="/image/hom-02.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="/image/hom-03.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  {" "}
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="/image/hom-04.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
              </Carousel>
            </div>

            <div data-aos="fade-left">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-center text-red-500 uppercase mb-2">
                  What is Global Technical Institute?
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
                  The History and Values of Global Technical Institute
                </h2>
              </div>
              <div className="mt-6 text-gray-700 text-base space-y-4">
                <p>
                  At Global Technical Training Institute, we believe that every
                  student has unique strengths and weaknesses. That’s why we
                  offer a personalized approach to teacher training in Kolkata.
                  Our faculty takes the time to understand each student’s needs
                  and tailors the curriculum to help them achieve their goals.
                </p>
                <p>
                  We also offer specialized courses and workshops to ensure that
                  students have the skills and knowledge they need to excel in
                  their chosen fields. Focusing on practical training and
                  experiential learning, we prepare our students for the
                  challenges they will face in the real world.
                </p>
                {/* <p>
                Overall, Global Technical Training Institute provides a
                nurturing and supportive environment where students can achieve
                their full potential.
              </p> */}
                <p className="text-sm text-gray-600 mt-4">
                  GITA CHOWDHURY EDUCATION SOCIETY was formed and registered
                  under the West Bengal Society Registration Act of 1961 vide
                  Registration No. S/IL/95693 and registered with The
                  Directorate of Micro & Small Scale Industry Enterprises,
                  Government of West Bengal vide Registration No. 3459/DIC/KOL.
                </p>
                <div className="mt-6">
                  <Link
                    href="/about"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                  >
                    Read more
                    <span className="ml-1">
                      <i className="fas fa-angle-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* gallery  */}
         <div className="text-center flex flex-col items-center  bg-[#e8f0ff]  text-[#0e3481] ">
    <h1 className="text-xl md:text-2xl font-semibold mt-4 mb-0">Gallery</h1>
  </div>
        <Gallery />

        {/* Principal message  */}
        <section className="w-full py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h4 className="text-2xl md:text-2xl font-semibold text-blue-600  inline-block pb-2">
                A Message from the Principal
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 border rounded-lg shadow-md bg-gray-50">
                <div className="flex justify-center mb-4  transition-transform duration-300 hover:scale-105">
                  <img
                    src="image/principal-moumita.png"
                    className="w-40 h-40 rounded-full  object-cover"
                  />
                </div>
                <div
                  data-aos="fade-up"
                  className="text-gray-700 space-y-1 text-sm text-left"
                >
                  <p>
                    Welcome to Global Technical Institute, if you’re looking for
                    a reputable teacher training institute in Kolkata, look no
                    further than GTI. Our institution is committed to providing
                    exceptional training to aspiring educators who want to make
                    a difference in the lives of their students.
                  </p>
                  <p>
                    Our experienced faculty members bring a wealth of knowledge
                    and expertise to the classNameroom, ensuring that our
                    students receive the best possible education and training.
                    We offer a range of programs and courses designed to meet
                    the needs of educators at every level, from beginner to
                    advanced.
                  </p>
                  <p>
                    Whether you’re interested in learning the latest teaching
                    techniques or enhancing your skills in a particular subject
                    area, our teachers training institute in Kolkata can help
                    you achieve your goals. Join us today and discover the many
                    benefits of studying with GTI.
                  </p>
                  <h4 className="font-bold mt-4">
                    – Mrs. Moumita Roy Chowdhury (PRINCIPAL)
                  </h4>
                </div>
              </div>

              <div className="text-center p-6 border rounded-lg shadow-md bg-gray-50">
                <div className="flex justify-center mb-4 transition-transform duration-300 hover:scale-105">
                  <img
                    src="image/principal-poulami.png"
                    alt="Mrs. Poulami Chowdhury"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                </div>
                <div
                  data-aos="fade-up"
                  className="text-gray-700 space-y-1 text-sm text-left"
                >
                  <p>
                    If you’re passionate about teaching and looking to enhance
                    your skills and knowledge, consider enrolling in Global
                    Technical Institute, the premier teachers training institute
                    in Kolkata. Our institute offers comprehensive courses and
                    programs that are designed to equip you with the tools and
                    strategies needed to be an effective educator.
                  </p>
                  <p>
                    Our experienced instructors are dedicated to providing you
                    with personalized attention and support, and our
                    state-of-the-art facilities offer a dynamic learning
                    environment that fosters growth and development. We also
                    offer practical training and real-world experience through
                    our partnerships with schools and educational institutions.
                  </p>
                  <p>
                    At Global Technical Institute, we believe in creating a
                    community of learners and educators who support and inspire
                    each other. We are committed to providing you with the
                    resources and opportunities needed to succeed in your
                    career. Join us today and take the first step towards a
                    fulfilling and rewarding career in teaching.
                  </p>
                  <h4 className="font-bold mt-4">
                    – Mrs. Poulami Chowdhury (VICE PRINCIPAL)
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* google reviews */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h4 className="text-2xl md:text-2xl  font-semibold text-blue-800  inline-block pb-2">
              Google Reviews
            </h4>
          </div>
        </div>
        <div className="flex justify-center">
          <li className="flex text-center space-x-3">
            <img
              src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/11/Google-Reviews-1-30x31.png"
              alt="Google Reviews"
              className="w-[60px] h-[60px] object-contain"
              loading="lazy"
            />

            <div className="flex flex-col text-center">
              <div className="flex space-x-1 text-yellow-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.64 12 1 7.91l6.06-.91L10 2l2.94 5 6.06.91L14.36 12l1.518 6.09z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.64 12 1 7.91l6.06-.91L10 2l2.94 5 6.06.91L14.36 12l1.518 6.09z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.64 12 1 7.91l6.06-.91L10 2l2.94 5 6.06.91L14.36 12l1.518 6.09z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.64 12 1 7.91l6.06-.91L10 2l2.94 5 6.06.91L14.36 12l1.518 6.09z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.64 12 1 7.91l6.06-.91L10 2l2.94 5 6.06.91L14.36 12l1.518 6.09z" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold text-gray-700">4.8</span> Stars –
                Based on{" "}
                <span className="font-semibold text-gray-700">463</span> User
                Reviews
              </div>
            </div>
          </li>
        </div>

        {/* What makes us unique */}
        <section id="about-us" className="w-full py-12 mt-10 bg-[#1a3d97]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            {/* Left Column */}
            <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
              <div className="max-w-[90%] mx-auto">
                <h4 className="text-2xl  font-bold text-gray-100 ">
                  What makes us unique
                </h4>
              </div>

              <div className="max-w-[90%] mx-auto text-gray-200 text-left space-y-4">
                <p>
                  Global Technical Training Institute offers a variety of
                  specialties that set it apart from other technical education
                  and training providers. Some of the key USPs of Global
                  Technical Institute include:
                </p>
                <p>
                  Global Technical Institute makes it an excellent choice for
                  students who want to receive high-quality technical education
                  and training that will prepare them for success in their
                  chosen field.
                </p>
              </div>

              <div className="text-left">
                <Link
                  href="#"
                  className="inline-flex items-center text-gray-200 hover:text-gray-100 underline transition font-medium"
                >
                  Read More
                  <span className="ml-2 text-lg">&#8594;</span>
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-[40%] mt-10 md:mt-0 md:ml-10">
              <ul className="space-y-4 text-gray-100 font-bold">
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span>
                    Industry-Driven Programs
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span> Experienced
                    Instructors
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span>
                    State-of-the-Art Facilities
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span>
                    Flexible Learning Options
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span> Community of
                    Learners
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span>
                    Professional Certifications
                  </h4>
                </li>
                <li>
                  <h4 className="text-lg font-medium">
                    {" "}
                    <span className="mr-2 text-lg"> &#9679;</span> Career
                    Services
                  </h4>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliations & Collaborations */}
        <div className="flex justify-center ">
          <section className="py-12 bg-gray-50 text-center w-11/12  ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Affiliations & Collaborations
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                Together, we can achieve more and connecting communities through
                partnerships.
              </p>

              {/* carousal for Affiliations & Collaborations  */}
              <Carousel
                swipeable={true}
                draggable={true}
                autoPlay={true}
                responsive={responsive}
                infinite={true}
                autoPlaySpeed={1000}
                transitionDuration={100}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                className="px-6 py-6 "
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
              >
                <div>
                  {" "}
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/1.png"
                    alt="teachers training institute Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  {" "}
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/2.jpg"
                    alt="teachers training institute Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  {" "}
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/3.jpg"
                    alt="teachers training institute Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/4.jpg"
                    alt="teachers training institute Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/5.jpg"
                    alt="teachers training institute in Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>

                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/6a.jpg"
                    alt="teachers training institute in Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/7.jpg"
                    alt="teachers training institute in Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/8a.jpg"
                    alt="teachers training institute in Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/8a.jpg"
                    alt="teachers training institute in Kolkata"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  {" "}
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/yea.jpg"
                    alt="yea"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ias.jpg"
                    alt="ias"
                    className="mx-auto h-24 object-contain"
                  />
                </div>
              </Carousel>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center"></div>
            </div>
          </section>
        </div>
        {/* Footer */}
        <Footer />

        {/* Back To Top Button */}
        <BackToTopButton />

       
        {/* <Carousel
        responsive={responsive}
        infinite={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        transitionDuration={500}
        itemClass="carousel-item-padding-40-px"
      >
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Carousel> */}
      </AOSProvider>
    </>
  );
}
