import React from "react";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { IoLogoWhatsapp } from "react-icons/io";

function SocialMedia() {
  const socialLinks = [
    {
      href: "https://wa.me/919231551285",
      icon: "/image/whatsapp.png",
      label: "WhatsApp",
      alt: "teachers training institute Kolkata",
    },
    {
      href: "https://www.facebook.com/gtitrainingcourse",
      icon: "/image/facebook.png",
      label: "Facebook",
      alt: "teachers training institute Kolkata",
    },
    {
      href: "https://www.instagram.com/globaltechnicalinstitute/",
      icon: "/image/instagram.png",
      label: "Instagram",
      alt: "teachers training in Kolkata",
    },
  ];

  return (
    <>
      <div className=" hidden  fixed top-1/3 right-0 z-20 md:flex flex-col w-[200px] space-y-2">
        <a
          href="https://www.instagram.com/globaltechnicalinstitute/"
          className="flex items-center transform translate-x-35 hover:translate-x-0 transition-all duration-700 ease-in-out text-white bg-[#FD1D1D] rounded-l-full px-3 py-2 uppercase text-lg font-semibold font-sans"
        >
          <i className="fab fa-instagram text-[#FD1D1D] bg-white rounded-full  h-10 w-10 flex items-center justify-center mr-4">
            <RiInstagramFill />
          </i>
          Instagram
        </a>

        <a
          href="https://www.facebook.com/gtitrainingcourse"
          className="flex items-center transform translate-x-35 hover:translate-x-0 transition-all duration-700 ease-in-out text-white bg-[#2C80D3] rounded-l-full px-3 py-2 uppercase text-lg font-semibold font-sans"
        >
          <i className="fab fa-facebook-f text-[#2C80D3] bg-white rounded-full  h-10 w-10 flex items-center justify-center mr-4">
            {" "}
            <FaFacebook />
          </i>
          Facebook
        </a>
        <a
          href="https://wa.me/919231551285"
          className="flex items-center transform translate-x-35 hover:translate-x-0 transition-all duration-700 ease-in-out text-white bg-[#47a35b] rounded-l-full px-3 py-2 uppercase text-lg font-semibold font-sans"
        >
          <i className="fab fa-youtube text-green-400 bg-white rounded-full  h-10 w-10 flex items-center justify-center mr-4"><IoLogoWhatsapp/>
</i>
          WHATSAPP
        </a>
      </div>

      <div className="flex fixed bottom-0 z-20 w-full justify-around shadow-lg items-center gap-4 p-2 bg-white  md:hidden">
        {socialLinks.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,.50)] rounded-4xl"
            >
              <img
                src={item.icon}
                alt={item.alt}
                width={30}
                height={30}
                className="rounded-full"
                priority
              />
              {/* <span className="text-sm mt-1">{item.label}</span> */}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default SocialMedia;
