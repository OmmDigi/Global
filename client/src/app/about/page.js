"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AOSProvider from "@/components/AOSProvider";

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
      <AOSProvider>
        <Navbar />
        <div   className="relative bg-gray-300 overflow-hidden top-0 z-0">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: "url('/image/instit.jpg')" }} // replace with your image path
          ></div>
          <div className="flex justify-center text-center text-[#023b81] align-middle items-center z-0 h-30">
            <h1 className="text-5xl font-bold">About us</h1>
          </div>
        </div>
        <section data-aos="fade-left">
          <div id="about" className="w-full bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* small About carousal  */}

              <Carousel
                responsive={responsive2}
                infinite={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                transitionDuration={500}
                itemClass="carousel-item-padding-40-px"
              >
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/hom-01.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/hom-02.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/hom-03.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/hom-04.jpg"
                    alt="teachers training institute in Kolkata"
                  />
                </div>
              </Carousel>

              <div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
                    Our Vision
                  </h2>
                </div>
                <div className="mt-6 text-gray-700 text-base space-y-4">
                  <p>
                    We empower individuals in engineering and technology through
                    industry-aligned education, fostering success in a
                    competitive marketplace. Committed to academic excellence,
                    our institute maintains rigorous standards and quality.
                    Contact us to learn more about us.
                  </p>
                  <p>
                    Our vision is to be a premier institution in India for
                    technical education, renowned for outstanding faculty,
                    advanced facilities, and innovative programs. We aim to
                    create an enriching learning environment that empowers
                    students to excel. With a focus on social responsibility, we
                    cultivate graduates who are proficient in their field and
                    contribute positively to society, fostering a community
                    dedicated to societal change.
                  </p>
                  <p>
                    Based in India, Global Technical Institute (GTI) is a
                    leading technical education hub offering diverse courses and
                    training programs. Our focus is on empowering individuals
                    with practical skills and knowledge essential for workforce
                    success. Specializing in areas like Teacher Training,
                    Nursing, and Lab Technician Training, GTI distinguishes
                    itself with hands-on learning in state-of-the-art labs.
                    Learn more about us and our specialty
                  </p>
                  <p className=" text-gray-700 mt-4">
                    GITA CHOWDHURY EDUCATION SOCIETY was formed and registered
                    under the West Bengal Society Registration Act of 1961 vide
                    Registration No. S/IL/95693 and registered with The
                    Directorate of Micro & Small Scale Industry Enterprises,
                    Government of West Bengal vide Registration No.
                    3459/DIC/KOL.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-gray-700">
              <p>
                Our faculty comprises experienced professionals providing
                personalized guidance and soft skills training alongside
                technical expertise. Recognized by industry bodies, our programs
                feature partnerships with companies for internship
                opportunities.
              </p>
              <p>
                Choose GTI for top-notch technical education in India. Our
                emphasis on practical training, seasoned faculty, and industry
                connections ensures students are well-prepared for successful
                careers. Explore our offerings and track record of job
                placements.
              </p>
            </div>
          </div>
        </section>
      </AOSProvider>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
