"use client";
import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "react-multi-carousel/lib/styles.css";

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
          <h1 className="text-5xl font-bold"> News & Events</h1>
        </div>
      </div>

      <section  className="w-full bg-white py-10">
        <div  className="max-w-4xl mx-auto px-4 text-center">
          <h2  className="text-center text-2xl md:text-3xl  font-bold text-gray-800 border-b-2 border-gray-300 inline-block mb-8">
            Academic Session Calendar
          </h2>

          <div  className="overflow-x-auto">
            <table  className="min-w-full border border-gray-300 text-center text-gray-800">
              <thead  className="bg-blue-100 text-gray-900">
                <tr>
                  <th  className="px-4 py-2 text-lg font-semibold border border-gray-300">
                    Course Name
                  </th>
                  <th  className="px-4 py-2 text-lg font-semibold border border-gray-300">
                    Session
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">
                    Teachers training
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">
                    March, July, November
                  </td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">
                    Nursing training
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">
                    January, May, September
                  </td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">
                    Physiotherapy training
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">
                    March, July, November
                  </td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">
                    Lab technician training
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">
                    January, May, September
                  </td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">
                    ECG technician training
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">
                    April, August, December
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section  className="w-full py-10 bg-white">
        <div  className="max-w-6xl mx-auto px-4 text-center">
          <h2  className="text-center text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-gray-300 inline-block mb-8">
            List of Holidays 2023
          </h2>

          <div  className="overflow-x-auto">
            <table  className="min-w-full border border-gray-300 text-center text-sm md:text-base text-gray-800">
              <thead  className="bg-blue-100 text-gray-900">
                <tr>
                  <th  className="px-4 py-2 border border-gray-300">DATE</th>
                  <th  className="px-4 py-2 border border-gray-300">
                    NAME OF HOLIDAYS
                  </th>
                  <th  className="px-4 py-2 border border-gray-300">DAYS</th>
                  <th  className="px-4 py-2 border border-gray-300">NO OF DAYS</th>
                </tr>
              </thead>
              <tbody>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">23.01.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Netaji Birthday
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Monday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">26.01.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Republic Day</td>
                  <td  className="px-4 py-2 border border-gray-300">Thursday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">07.03.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Dol Jatra</td>
                  <td  className="px-4 py-2 border border-gray-300">Tuesday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">07.04.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Good Friday</td>
                  <td  className="px-4 py-2 border border-gray-300">Friday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">15.04.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Bengali New Year
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Saturday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">22.04.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Id-Ul-Fitter</td>
                  <td  className="px-4 py-2 border border-gray-300">Saturday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">01.05.23</td>
                  <td  className="px-4 py-2 border border-gray-300">May Day</td>
                  <td  className="px-4 py-2 border border-gray-300">Monday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">14.05.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Foundation Day
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Sunday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">29.06.23</td>
                  <td  className="px-4 py-2 border border-gray-300">IdduZoha</td>
                  <td  className="px-4 py-2 border border-gray-300">Thursday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">29.07.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Muharam</td>
                  <td  className="px-4 py-2 border border-gray-300">Saturday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">15.08.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Independence Day
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Tuesday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">06.09.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Janmastami</td>
                  <td  className="px-4 py-2 border border-gray-300">Wednesday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">28.09.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Fateha Dohaz Daham
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Thursday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">02.10.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Gandhi Jayanti
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Monday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">14.10.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Mahalaya</td>
                  <td  className="px-4 py-2 border border-gray-300">Saturday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">
                    20.10.23 - 28.10.23
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Durgapuja</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Friday - Saturday
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">9</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">
                    12.11.23 - 15.11.23
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Kalipuja</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Sunday - Wednesday
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">4</td>
                </tr>
                <tr  className="bg-gray-50 hover:bg-gray-100">
                  <td  className="px-4 py-2 border border-gray-300">27.11.23</td>
                  <td  className="px-4 py-2 border border-gray-300">
                    Gurunanak Birthday
                  </td>
                  <td  className="px-4 py-2 border border-gray-300">Monday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
                <tr  className="bg-white hover:bg-gray-50">
                  <td  className="px-4 py-2 border border-gray-300">25.12.23</td>
                  <td  className="px-4 py-2 border border-gray-300">Christmas</td>
                  <td  className="px-4 py-2 border border-gray-300">Monday</td>
                  <td  className="px-4 py-2 border border-gray-300">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
