"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ourBranch from "../components/ourBranch";
// import Image from "../../public/image/booking.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useScrollChecker } from "./useScrollChecker";

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openImage = (src) => {
    setImgSrc(src);
    setIsOpenPopup(true);
  };

  const closeModal = () => {
    setIsOpenPopup(false);
    setTimeout(() => setImgSrc(""), 300); // Delay clearing src until after animation
  };

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       const currentScrollY = window.scrollY;
  // console.log("Current Scroll Y:", currentScrollY);

  //       setShowNavbar(currentScrollY <= 300);
  //       setLastScrollY(currentScrollY);
  //     };

  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, [lastScrollY]);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      console.log("Scroll Y:", window.scrollY);

      if (window.scrollY > 200) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
    });
  });

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
    {
      name: "Find US",
      href: "#",
      image: "/image/map.png",
      detail: "Our Branch",
    },
    {
      name: "Log in",
      href: "#",
      image: "/image/log-in.png",
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
      router.push("/admission");
    }
    if (index === 4) {
      router.push("/login");
    }
    // news-events
  };
  const { isScrolling, scrollingDirection } = useScrollChecker();

  return (
    <div className="sticky  top-0 z-50">
      <div className="bg-gray-300">
        <header className="inset-x-0 top-0 relative ">
          <div
            className={`${
              isScrolling ? "max-h-0 overflow-hidden" : "max-h-full"
            } transition-transform duration-300 `}
          >
            <div className="hidden lg:flex justify-between pb-7 pt-3 pl-8 pr-8">
              {navigation3.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => open(e, item, index)}
                  className="flex text-sm/4 font-semibold text-gray-900 transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    height={512}
                    width={512}
                    alt=""
                    // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    src={item.image}
                    className="h-8 w-auto"
                  />
                  <div className="ml-2">
                    <div>{item.name}</div>
                    <div className="text-blue-500 *:">{item.detail}</div>
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
                isScrolling ? "md:mt-7" : " mt-0"
              } shadow justify-between  p-2 lg:px-8 w-12/12 h-15  bg-white`}
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
                <div>
                  <Link href="/" className="-m-1.5 p-1.5 z-10">
                    <Image
                      height={512}
                      width={512}
                      alt=""
                      src="/image/global-logo2.png"
                      // src={"/image/booking.png"}
                      className=" w-50 h-15"
                    />
                  </Link>
                </div>
                <div> </div>
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

                <div className="cursor-pointer " ref={dropdownRef}>
                  <div
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full text-xs font-semibold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent "
                  >
                    OUR COURSES{" "}
                    <svg
                      className="w-2.5 h-2.5 ml-2.5"
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
                <div className="text-xs font-semibold text-gray-900">
                  <Link
                    href="/our-speciality"
                    className="relative inline-block after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-.5"
                  >
                    OUR SPECIALITY
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center  ">
                <Link href="/" className="-m-1.5 p-1.5 z-10">
                  <span className="sr-only">Your Company</span>
                  <Image
                    height={512}
                    width={512}
                    alt=""
                    src="/image/global-logo.png"
                    // src={"/image/booking.png"}
                    className=" w-27 h-25"
                  />
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
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white p-6  sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="/image/global-logo.png"
                    className="h-8 w-auto"
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
                        <Link href="#">OUR COURSES</Link>
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
          <div
            className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 "
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
              onClick={closeModal}
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>

            <popup class="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-lg w-11/12">
              <div class="text-center mb-6">
                <img
                  src="/image/global-logo2.png"
                  alt="Global Technical Institute Logo"
                  class="mx-auto w-[432px] h-auto"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <office class="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div class="flex items-start space-x-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/location-40x40.png"
                      alt="Location Icon"
                      class="w-10 h-10"
                    />
                    <div>
                      <h4 class="text-lg font-semibold text-blue-700">
                        Head Office
                      </h4>
                      <p class="text-gray-700">
                        Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085
                        <br />
                        Landmark: Near Surah Kanya Vidyalaya.
                      </p>
                      <p class="mt-2 text-blue-800 font-medium">
                        <i class="fas fa-phone-square-alt mr-2"></i>8961008489,
                        9231551285, 9230113485
                      </p>
                    </div>
                  </div>
                </office>
                <office class="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div class="flex items-start space-x-4">
                    <img
                      src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/03/location-40x40.png"
                      alt="Location Icon"
                      class="w-10 h-10"
                    />
                    <div>
                      <h4 class="text-lg font-semibold text-blue-700">
                        Garia Branch
                      </h4>
                      <p class="text-gray-700">
                        251/A/6 N.S.C bose road, Naktala, Kolkata-700047
                        <br />
                        Near : Geetanjali metro station and Naktala Sib mandir.
                      </p>
                      <p class="mt-2 text-blue-800 font-medium">
                        <i class="fas fa-phone-square-alt mr-2"></i>90516 29028
                      </p>
                    </div>
                  </div>
                </office>
              </div>
            </popup>
          </div>
        )}

        {/* <ourBranch /> */}
      </div>
    </div>
  );
}
