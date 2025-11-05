import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "react-multi-carousel/lib/styles.css";
import { LayoutDashboard, SquareArrowDown } from "lucide-react";

function RefundPolicy() {
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
          <h1 className="text-5xl font-bold">Refund Policy</h1>
        </div>
      </div>

      <section className="space-y-6 font-primary relative bg-white text-gray-800 px-6 py-8 rounded-lg">
        {/* Mobile Buttons */}
        <div className="items-start justify-center gap-3 flex-col hidden max-sm:flex pb-2">
          <a href="#courses-list">
            <button className="flex items-center justify-center gap-2 max-sm:py-3 py-2.5 rounded-full cursor-pointer transition-all duration-300 bg-blue-600 font-semibold text-sm active:scale-90 px-4 text-white">
              <SquareArrowDown size={18} />
              Explore Our Courses
            </button>
          </a>

          <button className="z-20 text-white flex items-center gap-2 right-0 bottom-9 bg-black p-2.5 px-6 rounded-full backdrop-blur-3xl">
            <LayoutDashboard size={20} />
            <span className="font-montserrat text-sm">See All Programs</span>
          </button>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-4 leading-relaxed">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <p className="text-sm">
            <strong>Effective Date:</strong> Oct 30, 2025
          </p>

          <p className="text-sm">
            At <strong>EduVerse Training Institute</strong>, we value your
            privacy. This Privacy Policy explains how we collect, use, and
            protect your information when you interact with our website, online
            courses, or training programs.
          </p>

          <h3 className="text-lg font-semibold">1. Information We Collect</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>Your name, email address, phone number, and contact details</li>
            <li>Course preferences and enrollment history</li>
            <li>Payment details (securely processed by trusted partners)</li>
            <li>Feedback, assessments, and attendance data</li>
          </ul>

          <h3 className="text-lg font-semibold">
            2. How We Use Your Information
          </h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>To manage your course registration and progress</li>
            <li>To communicate important updates or announcements</li>
            <li>To personalize learning experiences</li>
            <li>To improve our curriculum and teaching methods</li>
          </ul>

          <h3 className="text-lg font-semibold">3. Data Protection</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>
              Your data is stored securely and accessed only by authorized
              staff.
            </li>
            <li>
              We do not sell or share your information with third parties except
              for educational or payment processing purposes.
            </li>
          </ul>

          <h3 className="text-lg font-semibold">4. Cookies & Website Usage</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>We may use cookies to enhance your browsing experience.</li>
            <li>You can control cookie settings through your browser.</li>
          </ul>

          <h3 className="text-lg font-semibold">5. Third-Party Services</h3>
          <p className="text-sm">
            Our website may include links or integrations with third-party
            platforms (like payment gateways or video platforms). We are not
            responsible for their privacy practices.
          </p>

          <h3 className="text-lg font-semibold">6. Your Rights</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>
              You can request access to, correction of, or deletion of your
              personal data by contacting us at{" "}
              <strong>global.technical8.institute@gmail.com</strong>.
            </li>
          </ul>

          <p className="text-sm">
            For any questions or concerns regarding this policy, please contact
            our Privacy Officer at{" "}
            <strong>global.technical8.institute@gmail.com</strong>.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default RefundPolicy;
