"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { message } from "antd";

export default function AdmissionPopup({ isOpen, setIsOpem }) {
  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    category: "Student",
  });
  const router = useRouter();

  const handleNewAdmission = () => {
    const params = new URLSearchParams(searchParams);
    router.push(`/admission?${params.toString()}`);
  };

  const handleExistiongAdmission = () => {
    setFormOpen((prev) => !prev);
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/login`, formData);
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

  return isOpen ? (
    <>
      {contextHolder}
      <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 ">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
          onClick={setIsOpem}
        >
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>

        <popup className="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-lg w-11/12 md:w-8/12">
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
                    Existing Student
                  </Button>
                </div>
              </div>
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
            </office>
          </div>
        </popup>
      </div>
    </>
  ) : null;
}
