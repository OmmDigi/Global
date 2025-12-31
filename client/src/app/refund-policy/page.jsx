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
       <div dangerouslySetInnerHTML={{__html : `<p><span data-teams=true><strong>Refund</strong> - On cancellations ,refund will be credited to your original payment method within 4-5 business.</span>`}}></div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default RefundPolicy;
