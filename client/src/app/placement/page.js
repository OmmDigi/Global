"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
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

function page() {
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
          <h1 className="text-5xl font-bold">Our Placements</h1>
        </div>
      </div>

      {/* Teachers carousal  */}
      <section className="py-10 bg-gray-50">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-semibold ">
            Teachers - Placed at Reputed School and Office
          </h4>
          <div className="flex justify-center">
            <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className=" gap-6">
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
              className="px-6 py-6 "
            >
              <div className="bg-white  rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/RIMITA-CHATTERJEE-180x180.png"
                  alt="RIMITA CHATTERJEE"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">RIMITA CHATTERJEE</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ANINDITA-PAUL-CHOWDHURY-180x180.png"
                  alt="ANINDITA PAUL CHOWDHURY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ANINDITA PAUL CHOWDHURY</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ROSEMARY-MAITY-180x180.png"
                  alt="ROSEMARY MAITY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ROSEMARY MAITY</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/PUJA-PAL-180x180.png"
                  alt="PUJA PAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">PUJA PAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-DUTTA-180x180.png"
                  alt="SUDIPTA DUTTA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA DUTTA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/DEEPMALA-MONDAL-180x180.png"
                  alt="DEEPMALA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">DEEPMALA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ADITI-GHOSH-180x180.png"
                  alt="ADITI GHOSH"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ADITI GHOSH</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/IVA-SAHA-180x180.png"
                  alt="IVA SAHA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">IVA SAHA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SEFALI-MONDAL-180x180.png"
                  alt="SEFALI MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SEFALI MONDAL</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-MONDAL-180x180.png"
                  alt="SUDIPTA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/JHILAM-KARMOKAR-180x180.png"
                  alt="JHILAM KARMOKAR"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">JHILAM KARMOKAR</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/MIMI-MANNA-180x180.png"
                  alt="MIMI MANNA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">MIMI MANNA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Official at Reputed Institute
                </p>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Nurse carousal  */}
      <section className="py-10 bg-gray-50">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-semibold ">
            Nurse - Placed at Reputed Nursingh Home , Hospital and Polyclinic
          </h4>
          <div className="flex justify-center">
            <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className=" gap-6">
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
              className="px-6 py-6 "
            >
              <div className="bg-white  rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/RIMITA-CHATTERJEE-180x180.png"
                  alt="RIMITA CHATTERJEE"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">RIMITA CHATTERJEE</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ANINDITA-PAUL-CHOWDHURY-180x180.png"
                  alt="ANINDITA PAUL CHOWDHURY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ANINDITA PAUL CHOWDHURY</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ROSEMARY-MAITY-180x180.png"
                  alt="ROSEMARY MAITY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ROSEMARY MAITY</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/PUJA-PAL-180x180.png"
                  alt="PUJA PAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">PUJA PAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-DUTTA-180x180.png"
                  alt="SUDIPTA DUTTA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA DUTTA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/DEEPMALA-MONDAL-180x180.png"
                  alt="DEEPMALA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">DEEPMALA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ADITI-GHOSH-180x180.png"
                  alt="ADITI GHOSH"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ADITI GHOSH</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/IVA-SAHA-180x180.png"
                  alt="IVA SAHA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">IVA SAHA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SEFALI-MONDAL-180x180.png"
                  alt="SEFALI MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SEFALI MONDAL</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-MONDAL-180x180.png"
                  alt="SUDIPTA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/JHILAM-KARMOKAR-180x180.png"
                  alt="JHILAM KARMOKAR"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">JHILAM KARMOKAR</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/MIMI-MANNA-180x180.png"
                  alt="MIMI MANNA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">MIMI MANNA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Official at Reputed Institute
                </p>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Physiotherapist  carousal  */}
      <section className="py-10 bg-gray-50">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-semibold ">
            Physiotherapist - Placed at Reputed Clinic
          </h4>
          <div className="flex justify-center">
            <hr className="mt-5 border-t-2 border-gray-400 w-11/12" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className=" gap-6">
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
            >
              <div className="bg-white  rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/RIMITA-CHATTERJEE-180x180.png"
                  alt="RIMITA CHATTERJEE"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">RIMITA CHATTERJEE</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ANINDITA-PAUL-CHOWDHURY-180x180.png"
                  alt="ANINDITA PAUL CHOWDHURY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ANINDITA PAUL CHOWDHURY</h4>
                <p className="text-sm text-gray-600">
                  March Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ROSEMARY-MAITY-180x180.png"
                  alt="ROSEMARY MAITY"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ROSEMARY MAITY</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/PUJA-PAL-180x180.png"
                  alt="PUJA PAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">PUJA PAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-DUTTA-180x180.png"
                  alt="SUDIPTA DUTTA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA DUTTA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/DEEPMALA-MONDAL-180x180.png"
                  alt="DEEPMALA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">DEEPMALA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/ADITI-GHOSH-180x180.png"
                  alt="ADITI GHOSH"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">ADITI GHOSH</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/IVA-SAHA-180x180.png"
                  alt="IVA SAHA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">IVA SAHA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SEFALI-MONDAL-180x180.png"
                  alt="SEFALI MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SEFALI MONDAL</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/SUDIPTA-MONDAL-180x180.png"
                  alt="SUDIPTA MONDAL"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">SUDIPTA MONDAL</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/JHILAM-KARMOKAR-180x180.png"
                  alt="JHILAM KARMOKAR"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">JHILAM KARMOKAR</h4>
                <p className="text-sm text-gray-600">
                  November Batch
                  <br />
                  Teacher at Reputed School
                </p>
              </div>

              <div className="bg-white rounded-lg shadow text-center p-4">
                <img
                  src="https://globaltechnicalinstitute.com/wp-content/uploads/2023/04/MIMI-MANNA-180x180.png"
                  alt="MIMI MANNA"
                  className="mx-auto rounded-full w-36 h-36 object-cover mb-4"
                />
                <h4 className="text-lg font-bold">MIMI MANNA</h4>
                <p className="text-sm text-gray-600">
                  July Batch
                  <br />
                  Official at Reputed Institute
                </p>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      <div className="wpb_wrapper  flex justify-center text-start mb-5 ">
        <div className="wpb_text_column wpb_content_element w-11/12 ">
          <div className="wpb_wrapper">
            <div className="text-2xl font-bold mb-4">
              OUR PLACEMENT – SUCCESS STORIES
            </div>
            <div className="text-base text-gray-700 leading-relaxed">
              Global Technical Institute Kolkata provides various medical
              courses in Kolkata. or visit our
              <Link
                href="https://www.facebook.com/gtitrainingcourse/"
                className="  font-semibold"
              >
                {" "}
                &nbsp;Facebook&nbsp;{" "}
              </Link>
              page for more information about our placement. Our specialty
              offers an outstanding choice for students seeking high-quality
              technical education and training, equipping them for success in
              their chosen fields. Get successful campus placement at our
              training institute.
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
