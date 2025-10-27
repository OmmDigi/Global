"use client";
import { useState } from "react";
import { Button, Dialog, DialogPanel, Label } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ourBranch from "../components/ourBranch";
// import Image from "../../public/image/booking.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useScrollChecker } from "./useScrollChecker";
import { Flex, message, Radio } from "antd";
import axios from "@/lib/axios";

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isadmissionPopup, setIsadmissionPopup] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { isScrolling, scrollingDirection } = useScrollChecker();
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    category: "Student",
  });
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openImage = (src) => {
    setIsOpenPopup(true);
  };
  const openAdmission = (src) => {
    setIsadmissionPopup(true);
  };

  const closeModal = () => {
    setIsOpenPopup(false);
    setIsadmissionPopup(false);
  };

  const navigation3 = [
    {
      name: "Call for Query",
      href: "#",
      image: "/image/call.gif",
      detail: "9231551285",
    },
    {
      name: "OUR Schedle",
      href: "/news-events",
      image: "/image/time.gif",
      detail: "News & Events",
    },
    {
      name: "Join Our Courses",
      href: "#",
      image: "/image/form.gif",
      detail: "Admission Form",
    },
    {
      name: "Find US",
      href: "#",
      image: "/image/location.gif",
      // detail: "Our Branch",
    },
    {
      name: "Log in",
      href: "/login",
      image: "/image/login.gif",
      detail: "Account Login",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const open = (event, item, index) => {
    event.preventDefault();
    if (index === 3) {
      openImage();
      console.log("4th element clicked:", item);
    }
    if (index === 1) {
      router.push("/news-events");
    }
    if (index === 2) {
      openAdmission();
      // router.push("/admission");
    }
    if (index === 4) {
      router.push("/login");
    }
    // news-events
  };

  const handleNewAdmission = () => {
    router.push("/admission");
  };

  const handleExistiongAdmission = () => {
    setFormOpen((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // startTransition(async () => {
    // await new Promise( (resolve) => setTimeout(resolve,5000))
    try {
      const response = await axios.post("api/v1/users/login", formData);
      console.log("response_login", response);

      messageApi.open({
        type: "success",
        content: response.data?.message,
      });

      localStorage.setItem("token", response.data?.data?.token);
      localStorage.setItem("category", response.data?.data?.category);
      router.push("/existingAdmission");
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      console.error("aaaa", error);
    }
    // });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("FormData", formData);
  //   router.push("/existingAdmission");
  // };

  return (
    <>
      {contextHolder}
      <div className="sticky  top-0 z-50">
        <div className="bg-gray-300">
          <header className="inset-x-0 top-0 relative ">
            <div
              className={`${
                isScrolling ? "max-h-0 overflow-hidden " : "max-h-full transition-transform duration-500"
              } `}
            >
              <div className="hidden lg:flex justify-between pb-5 pt-3 pl-8 pr-8">
                {navigation3.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => open(e, item, index)}
                    className={`flex  font-semibold text-sm/4 text-gray-900 transition-transform duration-300 hover:scale-105  `}
                  >
                    <Image
                      height={512}
                      width={512}
                      alt=""
                      // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      src={item.image}
                      className={`h-12 w-auto  ${
                        index === 2 ? "mt-[-5]" : "mt-[-5]"
                      }`}
                    />
                    <div
                      className={`ml-2 flex flex-col justify-center items-center ${index === 2 ? "  rounded-2xl " : ""} `}
                    >
                      {index === 2 && (
                        <div className="relative inline-flex h-10 w-40 overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                          <span className="absolute  inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#7f1d1d_50%,#E2CBFF_100%)]" />
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-300   font-semibold text-[16px] text-gray-900 backdrop-blur-3xl">
                            {item.detail}
                          </span>
                        </div>
                      )}
                      <div className={`${index === 2 ? "hidden" : ""}`}>
                        {item.name}
                      </div>
                      <div
                        className={`text-blue-900 ${
                          index === 2 ? "hidden" : ""
                        } `}
                      >
                        {item.detail}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={`  w-12/12 flex align-middle  items-center justify-center  `}
            >
              <nav
                aria-label="Global"
                className={`flex items-center ${
                  isScrolling ? "md:mt-7 " : " mt-0"
                } shadow justify-between  p-2 lg:px-8 w-12/12 h-17  bg-white`}
              >
                <div className=" lg:hidden sticky top-0 justify-between contents ">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                  <div className="m-2">
                    <Link href="/" className="-m-1.5 p-1.5 z-10">
                      <Image
                        height={512}
                        width={512}
                        alt=""
                        src="/image/global-logo2.png"
                        // src={"/image/booking.png"}
                        className=" w-50 h-15 "
                      />
                    </Link>
                  </div>
                  <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div>
                </div>

                <div className="hidden lg:flex lg:gap-x-6">
                  <div className="text-xs font-semibold text-gray-900 ">
                    <Link
                      href="/"
                      className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                    >
                      HOME
                    </Link>
                  </div>
                  <div className="text-xs font-semibold text-gray-900">
                    <Link
                      href="/about"
                      className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                    >
                      ABOUT US
                    </Link>
                  </div>
                  {/* <div className="text-xs font-semibold text-gray-900">
                  <Link
                    href="#"
                    className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                  >
                    OUR COURSES
                  </Link>
                </div> */}

                  <div
                    className="cursor-pointer text-gray-900"
                    ref={dropdownRef}
                  >
                    <div
                      onMouseEnter={toggleDropdown}
                     
                      className="flex items-center justify-between w-full text-xs font-semibold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto  md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent "
                    >
                      OUR COURSES{" "}
                      <svg
                        className={`w-2.5 h-2.5 ml-2.5 transition-transform duration-300 ${
                          isOpen == true ? "rotate-180 text-blue-500" : ""
                        } `}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </div>

                    {/* list of courser  */}

                    {isOpen && (
                      <div  onMouseLeave={() => setIsOpen(false)} className=" absolute z-10 mt-2 font-normal bg-white divide-y divide-gray-100  shadow-sm w-60 dark:bg-gray-700 dark:divide-gray-600">
                        <div className="py-1">
                          <Link
                            href="/teachers-training-institute-kolkata"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Teachers Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/nursing-training-in-kolkata"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Nursing Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/lab-technician-training-institute"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Lab Technician Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/ecg-technician-training-kolkata"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            ECG Technician Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/physiotherapy-training-institute-in-kolkata"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Physiotherapy Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/ot-technician-training"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            OT Technician Training
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/x-ray"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            X-Ray & Imaging Technology
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/cmsed"
                            className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            CMS & ED Training
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-900">
                    <Link
                      href="/our-speciality"
                      className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                    >
                      OUR SPECIALITY
                    </Link>
                  </div>
                </div>
                {/* <div className="hidden lg:flex justify-center  ">
                <Link href="/" className="-m-1.5 p-1.5 z-10">
                  <span className="sr-only">Your Company</span>
                  <Image
                    height={512}
                    width={512}
                    alt=""
                    src="/image/global-logo.png"
                    // src={"/image/booking.png"}
                    className=" w-27 h-25 mt-3"
                  />
                </Link>
              </div> */}
                <div className=" relative hidden lg:flex justify-center items-center rounded-4xl">
                  <Link href="/" className="  z-10 relative group">
                    <img
                      height={5}
                      width={5}
                      alt=""
                      src="/image/global-logo.png"
                      className="w-27 h-25 mt-3 rounded-4xl "
                    />
                    {/* Animated Shine Line */}
                  </Link>
                </div>

                <div className="hidden lg:flex  lg:gap-x-6">
                  <div className="hidden lg:flex lg:gap-x-6">
                    <div className="text-xs font-semibold text-gray-900 ">
                      <Link
                        href="/placement"
                        className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                      >
                        OUR PLACEMENTS
                      </Link>
                    </div>
                    <div className="text-xs font-semibold text-gray-900">
                      <Link
                        href="/blog"
                        className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                      >
                        OUR BLOG
                      </Link>
                    </div>
                    <div className="text-xs font-semibold text-gray-900">
                      <Link
                        href="/gallery"
                        className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                      >
                        OUR GALLERY
                      </Link>
                    </div>
                    <div className="text-xs font-semibold text-gray-900">
                      <Link
                        href="/contact-us"
                        className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                      >
                        CONTACT US
                      </Link>
                    </div>
                  </div>
                </div>

                {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link href="#" className="text-sm/6 font-semibold text-gray-900">
                      Log in <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div> */}
              </nav>
            </div>
            <div
              className={`lg:hidden  w-12/12 flex align-middle  items-center justify-center  `}
            >
              <nav
                aria-label="Global"
                className={`flex items-center ${
                  isScrolling ? "md:mt-7" : " mt-0"
                } shadow justify-center  p-2 lg:px-8 w-12/12 h-12  bg-white`}
              >
                <div className="  flex justify-center pb-2 pt-2 ">
                  <div
                    // href={navigation3[2].href}
                    onClick={openAdmission}
                    className={`flex  font-semibold text-sm/4 text-gray-900 transition-transform duration-300 hover:scale-105  `}
                  >
                    <Image
                      height={512}
                      width={512}
                      alt=""
                      // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      src={navigation3[2].image}
                      className={`h-10 w-auto  ${
                        2 === 2 ? "mt-[-5]" : "mt-[-5]"
                      }`}
                    />
                    <div className={`ml-2 rounded-2xl } `}>
                      {2 === 2 && (
                        <div className="relative inline-flex h-8 w-35 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                          <span className="absolute  inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#7f1d1d_50%,#E2CBFF_100%)]" />
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-200   font-semibold text-[14px] text-gray-700 backdrop-blur-3xl">
                            {navigation3[2].detail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <Dialog
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
              className="lg:hidden"
            >
              <div className="fixed inset-0 z-50" />
              <DialogPanel className=" fixed inset-y-0 left-0 z-50 w-[70%] overflow-y-auto bg-white p-6  sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <Link href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img
                      alt=""
                      src="/image/global-logo.png"
                      className="h-16 w-auto"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-0">
                      <div className="space-y-0">
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/">HOME</Link>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/about">ABOUT US</Link>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          {/* <Link href="#">OUR COURSES</Link> */}

                          <div
                            className="cursor-pointer text-gray-900"
                            ref={dropdownRef}
                          >
                            <div
                              onClick={toggleDropdown}
                              className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto  md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent "
                            >
                              OUR COURSES{" "}
                              <svg
                                className={`w-2.5 h-2.5 ml-2.5 transition-transform duration-300 ${
                                  isOpen == true
                                    ? "rotate-180 text-blue-500"
                                    : ""
                                } `}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 4 4 4-4"
                                />
                              </svg>
                            </div>

                            {/* list of courser  */}

                            {isOpen && (
                              <div className="absolute z-10 mt-2 font-normal bg-white divide-y divide-gray-100  shadow-sm w-60 dark:bg-gray-700 dark:divide-gray-600">
                                <div className="py-1">
                                  <Link
                                    href="/teachers-training-institute-kolkata"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    Teachers Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/nursing-training-in-kolkata"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    Nursing Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/lab-technician-training-institute"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    Lab Technician Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/ecg-technician-training-kolkata"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    ECG Technician Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/physiotherapy-training-institute-in-kolkata"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    Physiotherapy Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/ot-technician-training"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    OT Technician Training
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/x-ray"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    X-Ray & Imaging Technology
                                  </Link>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/cmsed"
                                    className="block px-4 py-1 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                  >
                                    CMS & ED Training
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/our-speciality">OUR SPECIALITY</Link>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 py-6">
                      <div className="space-y-0">
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/placement">OUR PLACEMENTS</Link>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/blog">OUR BLOG</Link>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/gallery">OUR GALLERY</Link>
                        </div>
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          <Link href="/contact-us">CONTACT US</Link>
                        </div>
                      </div>
                    </div>
                    <div className="py-6">
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </Dialog>
          </header>

          {isOpenPopup && (
            <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 ">
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
                onClick={closeModal}
              >
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>

              <popup className="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-lg w-11/12">
                <div className="text-center mb-6">
                  <img
                    src="/image/global-logo2.png"
                    alt="Global Technical Institute Logo"
                    className="mx-auto w-[432px] h-auto"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <office className="p-4 bg-gray-100 flex flex-col items-center justify-center gap-10 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                      <img
                        src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/location-40x40.png"
                        alt="Location Icon"
                        className="w-10 h-10"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-blue-700">
                          Head Office
                        </h4>
                        <p className="text-gray-700">
                          Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085
                          <br />
                          Landmark: Near Surah Kanya Vidyalaya.
                        </p>
                        <p className="mt-2 text-blue-800 font-medium">
                          <i className="fas fa-phone-square-alt mr-2"></i>
                          8961008489, 9231551285, 9230113485
                        </p>
                      </div>
                    </div>
                    <contact-list>
                      <phone className="flex items-center space-x-2 text-sm text-gray-700">
                        {/* <icon className="text-green-600"></icon> */}
                        <span className="text-green-800 text-xl">
                          All{" "}
                          <span className="text-blue-800 text-xl font-bold">
                            courses
                          </span>{" "}
                          under one roof. We have no branches.
                        </span>
                      </phone>
                    </contact-list>
                  </office>
                  {/* <office className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/location-40x40.png"
                      alt="Location Icon"
                      className="w-10 h-10"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-blue-700">
                        Garia Branch
                      </h4>
                      <p className="text-gray-700">
                        251/A/6 N.S.C bose road, Naktala, Kolkata-700047
                        <br />
                        Near : Geetanjali metro station and Naktala Sib mandir.
                      </p>
                      <p className="mt-2 text-blue-800 font-medium">
                        <i className="fas fa-phone-square-alt mr-2"></i>90516
                        29028
                      </p>
                    </div>
                  </div>
                </office> */}
                </div>
              </popup>
            </div>
          )}

          {/* pre Admission  */}
          {isadmissionPopup && (
            <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 ">
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
                onClick={closeModal}
              >
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>

              <popup className="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-lg w-11/12 md:w-8/12">
                <div className="text-center mb-6">
                  <img
                    src="/image/global-logo2.png"
                    alt="Global Technical Institute Logo"
                    className="mx-auto w-[432px] h-auto"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <office className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div className=" space-x-4">
                      <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                        {formOpen ? (
                          ""
                        ) : (
                          <Button
                            onClick={handleNewAdmission}
                            variant="contained"
                            className="bg-blue-200 p-4  hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                          >
                            New Admission
                          </Button>
                        )}
                        <Button
                          onClick={handleExistiongAdmission}
                          variant="contained"
                          className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                        >
                          Existing Student
                        </Button>
                      </div>
                    </div>
                    {formOpen && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                          <div>
                            <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                              Set User Name
                            </label>
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              placeholder="User Name"
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                              Set Your password
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Set Your password"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center items-center">
                          <button
                            className="bg-blue-400 h-8 w-20 rounded items-center text-white"
                            type="primary"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </office>
                </div>
              </popup>
            </div>
          )}

          {/* <ourBranch /> */}
        </div>
      </div>
    </>
  );
}
