import BackToTopButton from "@/components/BackToTopButton";
import BookNowCourseButton from "@/components/BookNowCourseButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { Suspense } from "react";

export default async function OurCoursesList() {
  const courses = [];
  const ADMISSION_FEE_HEAD_ID = 4;

  const response = await fetch(`${process.env.API_BASE_URL}api/v1/course`);
  if (!response.ok)
    return (
      <p className="text-center font-semibold pt-6 text-2xl">
        Unable to get response from server!! try again
      </p>
    );

  const bodyData = await response.json();

  bodyData?.data
    ?.sort((a, b) => a.id - b.id)
    .forEach((course) => {
      courses.push({
        id: course.id,
        name: course.name,
        duration: `${course.duration} Months`,
        fee: `₹${
          course.fee_structure.find(
            (item) => item.fee_head_id == ADMISSION_FEE_HEAD_ID
          )?.amount || 0.0
        }`,
      });
    });

  return (
    <>
      <Navbar />

      {/* Courses Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Admission Fee
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {course.fee}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Suspense>
                        <BookNowCourseButton courseId={course.id} />
                      </Suspense>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 hover:bg-blue-50 transition-colors"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="text-gray-900 font-semibold">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      Admission Fee:
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      {course.fee}
                    </span>
                  </div>
                  <Suspense>
                    <BookNowCourseButton courseId={course.id} />
                  </Suspense>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-blue-900">
            <strong>Note:</strong> Admission fees are subject to change. For
            more details about course curriculum, eligibility criteria, and
            payment plans, please contact our admission office.
          </p>
        </div>
      </div>

      <Footer />

      <BackToTopButton />
    </>
  );
}
