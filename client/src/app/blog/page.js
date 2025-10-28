import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
// import { XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { wordpressApi } from "@/lib/fetcher";
import Image from "next/image";
// import Image from "next/image";

// const responsive2 = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 1,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 1,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

async function page({ searchParams }) {
  const currentPage = parseInt((await searchParams.page) ?? "1");
  const api = await wordpressApi();
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "Escape") closeModal();
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);

  // get blog list
  const response = await api.get(
    `wp-json/custom/v1/blogs?page=${currentPage}&per_page=12`
  );
  console.log("response", response?.data);
  const total = response?.data?.total_pages;
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
          <h1 className="text-5xl font-bold">Our Blog</h1>
        </div>
      </div>

      {/* blog card  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 m-2 items-center">
        {response?.data?.posts.map((data, index) => {
          const category = data?.categories?.map((cat) => cat.name).join(", ");
          return (
            <article
              key={index}
              className="w-full h-auto p-2 mb-10 shadow-md bg-white"
            >
              <Link
                href={`${data?.slug}`}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                <figure className="relative">
                  <Link href={`${data?.slug}`}>
                    <Image
                      height={1280}
                      width={1280}
                      src={data?.thumbnail}
                      alt={data?.thumbnail_alt}
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    <span>{data?.date}</span>
                  </div>
                </figure>
                <div className="p-4  text-center flex flex-col justify-between items-center">
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: category,
                      }}
                      className="text-sm p-1 bg-blue-500 text-gray-100"
                    ></p>
                  </div>
                  <div>
                    <h3
                      dangerouslySetInnerHTML={{
                        __html: (data?.title.substring(0, 60) || "") + "...",
                      }}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {/* <Link href={`${data?.slug}`}>{data?.title}</Link> */}
                    </h3>
                  </div>
                  <div>
                    <p
                      className="text-sm text-gray-600 mt-3"
                      dangerouslySetInnerHTML={{
                        __html:
                          (data?.short_desc?.substring(0, 60) || "") + "...",
                      }}
                    ></p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`${data?.slug}`}
                      className="text-blue-600 hover:underline font-semibold text-sm"
                    >
                      Continue reading
                    </Link>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center items-center space-x-4 mb-5">
        <Link
          href={`/blog?page=${currentPage == 1 ? 1 : currentPage - 1}`}
          // onClick={handlePrev}
          // disabled={count == 1}
          className="px-4 py-2 bg-gray-500 text-gray-50 rounded disabled:opacity-50"
        >
          Prev
        </Link>

        <span
          className="text-xl font-semibold text-gray-500 cursor-pointer"
          // onClick={() => onChange(count)}
        >
          Page No : {currentPage}
        </span>

        <Link
          href={`/blog?page=${currentPage >= total ? total : currentPage + 1}`}
          // disabled={length < 10}
          // onClick={handleNext}
          className={`px-4 py-2  bg-blue-500 text-white rounded`}
        >
          Next
        </Link>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
