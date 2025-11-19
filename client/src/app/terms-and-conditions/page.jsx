import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "react-multi-carousel/lib/styles.css";
import { LayoutDashboard, SquareArrowDown } from "lucide-react";

function TermsAndConditions() {
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
          <h1 className="text-5xl font-bold">Terms & Conditions</h1>
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
        <div
          dangerouslySetInnerHTML={{
            __html: `<h2 data-end=423 data-start=398><strong data-end=423 data-start=401>Terms & Conditions</strong></h2><p data-end=658 data-start=425><strong data-end=467 data-start=425>Welcome to Global Technical Institute.</strong><br>By enrolling in any of our courses, training programs, or related educational services, you agree to the following <strong data-end=609 data-start=585>Terms and Conditions</strong>. Please read them carefully before registration.<hr data-end=663 data-start=660><h3 data-end=701 data-start=665><strong data-end=701 data-start=669>1. Enrollment & Confirmation</strong></h3><ul data-end=1009 data-start=703><li data-end=776 data-list-item-id=ee71b5bb5903ca61590b3729a6ff2c587 data-start=703><p data-end=776 data-start=705>All enrollments must be confirmed through email, phone, or in person.<li data-end=878 data-list-item-id=e285d29890bcc44abaca70f43ac53e6d3 data-start=777><p data-end=878 data-start=779>A minimum registration fee (as specified during enrollment) is required to secure your admission.<li data-end=1009 data-list-item-id=ebfffad6d18f2b8f23250acd77d768545 data-start=879><p data-end=1009 data-start=881>The remaining balance of the course fee must be paid before the commencement of classes or as per the agreed payment schedule.</ul><hr data-end=1014 data-start=1011><h3 data-end=1050 data-start=1016><strong data-end=1050 data-start=1020>2. Cancellations & Refunds</strong></h3><p data-end=1162 data-start=1054><span data-teams=true>Refund - On cancellations ,refund will be credited to your original payment method within 4-5 business.</span><hr data-end=1539 data-start=1536><h3 data-end=1572 data-start=1541><strong data-end=1572 data-start=1545>3. Liability Disclaimer</strong></h3><ul data-end=1980 data-start=1574><li data-end=1680 data-list-item-id=e274940c3867e008066a82bdb5fdc270e data-start=1574><p data-end=1680 data-start=1576>Students must ensure they are medically fit to participate in practical training or clinical sessions.<li data-end=1857 data-list-item-id=e3a022469027f437150c454c0b3ad7399 data-start=1681><p data-end=1857 data-start=1683><strong data-end=1713 data-start=1683>Global Technical Institute</strong> is not responsible for any personal injury, loss, or damage to belongings occurring within the premises or during off-site training sessions.<li data-end=1980 data-list-item-id=e481475db90bf693462abd580c7d0a5eb data-start=1858><p data-end=1980 data-start=1860>It is recommended that students have adequate <strong data-end=1948 data-start=1906>health and accident insurance coverage</strong> during their training period.</ul><hr data-end=1985 data-start=1982><h3 data-end=2038 data-start=1987><strong data-end=2038 data-start=1991>4. Changes or Cancellation by the Institute</strong></h3><ul data-end=2388 data-start=2040><li data-end=2274 data-list-item-id=e53825ae4395cd70f4eb5009f0f0937d5 data-start=2040><p data-end=2274 data-start=2042>In certain unavoidable circumstances (e.g., faculty unavailability, administrative reasons, government regulations, or natural calamities), the institute reserves the right to <strong data-end=2251 data-start=2218>reschedule, modify, or cancel</strong> any course or batch.<li data-end=2388 data-list-item-id=edbd51a3d2725d5d6ef9ee265ffa5f756 data-start=2275><p data-end=2388 data-start=2277>In such cases, the institute will offer an <strong data-end=2341 data-start=2320>alternative batch</strong> or a <strong data-end=2357 data-start=2347>refund</strong>, depending on the situation.</ul><hr data-end=2393 data-start=2390><h3 data-end=2429 data-start=2395><strong data-end=2429 data-start=2399>5. Documents & Eligibility</strong></h3><ul data-end=2776 data-start=2431><li data-end=2554 data-list-item-id=e75049def6d98fcdacb3d8e3d35d51d0a data-start=2431><p data-end=2554 data-start=2433>Students must provide valid <strong data-end=2473 data-start=2461>ID proof</strong>, <strong data-end=2500 data-start=2475>academic certificates</strong>, and any other required documents during admission.<li data-end=2680 data-list-item-id=e453f5af4c1afecea5f8b0071ff7fe1be data-start=2555><p data-end=2680 data-start=2557>The institute reserves the right to verify documents and cancel admission if false or misleading information is provided.<li data-end=2776 data-list-item-id=e70ad016916bae477f7d2c6bcd4c00dcf data-start=2681><p data-end=2776 data-start=2683>Foreign students must hold valid <strong data-end=2736 data-start=2716>passports, visas</strong>, and necessary permissions to enroll.</ul><hr data-end=2781 data-start=2778><h3 data-end=2809 data-start=2783><strong data-end=2809 data-start=2787>6. Code of Conduct</strong></h3><ul data-end=3169 data-start=2811><li data-end=2941 data-list-item-id=e51e3ef28f2f0f2cad509368d4b56eec8 data-start=2811><p data-end=2941 data-start=2813>Students are expected to maintain <strong data-end=2888 data-start=2847>discipline, respect faculty and staff</strong>, and follow the institute’s rules and regulations.<li data-end=3076 data-list-item-id=eb7e5fda484feffb79d02a5f742d6b3c3 data-start=2942><p data-end=3076 data-start=2944>Any form of <strong data-end=3020 data-start=2956>misconduct, disrespectful behavior, or violation of policies</strong> may result in suspension or expulsion without refund.<li data-end=3169 data-list-item-id=eb09733fe7dfac6787775d80c403acf87 data-start=3077><p data-end=3169 data-start=3079>Respect for <strong data-end=3153 data-start=3091>fellow students, instructors, and the learning environment</strong> is mandatory.</ul><hr data-end=3174 data-start=3171><h3 data-end=3200 data-start=3176><strong data-end=3200 data-start=3180>7. Governing Law</strong></h3><ul data-end=3373 data-start=3202><li data-end=3264 data-list-item-id=e1d1b5d5d799be5cf7780c22f1d6f1080 data-start=3202><p data-end=3264 data-start=3204>These Terms and Conditions are governed by <strong data-end=3261 data-start=3247>Indian Law</strong>.<li data-end=3373 data-list-item-id=e816984382de598e626c85521fad6862e data-start=3265><p data-end=3373 data-start=3267>Any disputes or legal matters shall fall under the jurisdiction of the <strong data-end=3370 data-start=3338>courts in West Sikkim, India</strong>.</ul><hr data-end=3378 data-start=3375><p data-end=3516 data-start=3380>📧 <strong data-end=3419 data-start=3383>For any queries, please contact:</strong><br><strong data-end=3432 data-start=3422>Email:</strong> <a class="cursor-pointer decorated-link"data-end=3470 data-start=3433 rel=noopener>global.technical8.institute@gmail.com<span aria-hidden=true class="align-middle inline-block leading-none ms-0.5"><svg class="block h-[0.75em] stroke-[0.75] stroke-current w-[0.75em]"data-rtl-flip=""fill=currentColor height=20 viewBox="0 0 20 20"width=20 xmlns=http://www.w3.org/2000/svg><path d="M14.3349 13.3301V6.60645L5.47065 15.4707C5.21095 15.7304 4.78895 15.7304 4.52925 15.4707C4.26955 15.211 4.26955 14.789 4.52925 14.5293L13.3935 5.66504H6.66011C6.29284 5.66504 5.99507 5.36727 5.99507 5C5.99507 4.63273 6.29284 4.33496 6.66011 4.33496H14.9999L15.1337 4.34863C15.4369 4.41057 15.665 4.67857 15.665 5V13.3301C15.6649 13.6973 15.3672 13.9951 14.9999 13.9951C14.6327 13.9951 14.335 13.6973 14.3349 13.3301Z"></path></svg></span></a><br><strong data-end=3487 data-start=3473>Institute:</strong> Global Technical Institute`,
          }}
          className="space-y-4"
        ></div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default TermsAndConditions;
