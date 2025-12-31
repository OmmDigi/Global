"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { message } from "antd";
import useSWR from "swr";
import { getFetcher } from "@/lib/fetcher";

export default function AdmissionPopup({ isOpen, setIsOpem }) {
  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    category: "Student",
  });
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [enquiryData, setEnquiryData] = useState({
    name: "",
    address: "",
    age: "",
    gender: "",
    education_qualification: "",
    phone: "",
    email: "",
  });

  const router = useRouter();

  const {
    data: courseList,
    loading: courseLoading,
    error: courseError,
  } = useSWR("api/v1/course/dropdown", getFetcher);
  if (courseLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  console.log("selectedCourses", selectedCourses);

  const handleNewAdmission = () => {
    const params = new URLSearchParams(searchParams);
    router.push(`/admission?${params.toString()}`);
  };

  const handleExistiongAdmission = () => {
    setFormOpen((prev) => !prev);
    setEnquiryOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/login`,
        formData
      );
      messageApi.open({
        type: "success",
        content: response.data?.message,
      });

      localStorage.setItem("token", response.data?.data?.token);
      localStorage.setItem("category", response.data?.data?.category);

      const params = new URLSearchParams(searchParams);
      router.push(`/existingAdmission?${params.toString()}`);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      console.error("aaaa", error);
    }
  };

  const handleNewEnquiry = () => {
    setFormOpen(false);
    setEnquiryOpen((prev) => !prev);
  };
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCourse = (e) => {
    const value = e.target.value;

    const courseName = courseList?.data.find(
      (item) => item.id == value
    )?.course_name;

    if (value && !selectedCourses.includes(value)) {
      setSelectedCourses([...selectedCourses, { value, title: courseName }]);
    }
    e.target.value = ""; // reset select
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter((c) => c.value !== id));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    const arrayId = [];
    selectedCourses.forEach((item) => {
      arrayId.push(parseInt(item.value));
    });
    enquiryData.course_ids = arrayId;
    enquiryData.message = "";
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/enquiry`,
        enquiryData
      );

      messageApi.open({
        type: "success",
        content: res.data?.message || "Enquiry submitted successfully",
      });

      setEnquiryData({});
      setSelectedCourses([]);
      setEnquiryOpen(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to submit enquiry",
      });
    }
  };

  return isOpen ? (
    <>
      {contextHolder}
      <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 ">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
          onClick={() => (
            setIsOpem(), setFormOpen(false), setEnquiryOpen(false)
          )}
        >
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>

        <popup
          className="
                        mx-auto p-6 bg-white rounded-lg shadow-lg 
                        w-11/12 md:w-8/12
                        max-h-[90vh] overflow-y-auto
                      "
        >
          <div className="text-center mb-6">
            <img
              src="/image/global-logo2.png"
              alt="Global Technical Institute Logo"
              className="mx-auto w-[432px] h-auto"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <office className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className=" space-x-4">
                <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                  <Button
                    onClick={handleNewEnquiry}
                    className="bg-green-200 p-4 hover:bg-green-400 hover:text-white text-lg rounded-4xl"
                  >
                    {enquiryOpen ? " Back" : "For Enquiry"}
                  </Button>
                  {!enquiryOpen ? (
                    <>
                      {formOpen ? (
                        ""
                      ) : (
                        <Button
                          onClick={handleNewAdmission}
                          variant="contained"
                          className="bg-blue-200 p-4  hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                        >
                          New Admission
                        </Button>
                      )}
                      <Button
                        onClick={handleExistiongAdmission}
                        variant="contained"
                        className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                      >
                        {formOpen ? " back" : "Existing Student"}
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* existinf form */}
              {formOpen && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <div>
                      <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                        Set User Name
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="User Name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                        Set Your password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Set Your password"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-blue-400 h-8 w-20 rounded items-center text-white"
                      type="primary"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}

              {/* enquiry form */}
              {enquiryOpen && (
                <form
                  onSubmit={handleEnquirySubmit}
                  className="mt-10 space-y-4  "
                >
                  <div>
                    <label>Full Name</label>
                    <input
                      name="name"
                      value={enquiryData.name}
                      onChange={handleEnquiryChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={enquiryData.address}
                      onChange={handleEnquiryChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>Age</label>
                      <input
                        name="age"
                        value={enquiryData.age}
                        onChange={handleEnquiryChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label>Sex</label>
                      <select
                        name="gender"
                        value={enquiryData.gender}
                        onChange={handleEnquiryChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Educational Qualification</label>
                    <input
                      name="education_qualification"
                      value={enquiryData.education_qualification}
                      onChange={handleEnquiryChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label>Contact / WhatsApp No</label>
                    <input
                      name="phone"
                      value={enquiryData.phone}
                      onChange={handleEnquiryChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label>Email ID</label>
                    <input
                      name="email"
                      value={enquiryData.email}
                      onChange={handleEnquiryChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium">
                      Course Search For
                    </label>

                    {/* Selected Items */}
                    <div className="flex flex-wrap gap-2">
                      {selectedCourses.map((course, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {course.title}
                          <button
                            type="button"
                            onClick={() => removeCourse(course.value)}
                            className="text-blue-600 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Select Dropdown */}
                    <select
                      className="w-full p-2 border rounded"
                      onChange={handleSelectCourse}
                    >
                      <option value="">Select a course</option>
                      {courseList.data.map((course, i) => (
                        <option
                          onChange={() => {
                            alert();
                          }}
                          key={i}
                          value={course.id}
                          title={course.course_name}
                        >
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-orange-400 px-6 py-2 rounded text-white">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </office>
          </div>
        </popup>
      </div>
    </>
  ) : null;
}
