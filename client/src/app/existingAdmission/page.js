"use client";
import React, { useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button, message, Steps, theme } from "antd";
import { Route, Upload, X } from "lucide-react";
import { useScrollChecker } from "@/components/useScrollChecker";
import { ToWords } from "to-words";
import useSWR from "swr";

import { getFetcher, postFetcher } from "@/lib/fetcher";
import { uploadFiles } from "@/utils/uploadFile";
import useSWRMutation from "swr/mutation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

const toWords = new ToWords();

let words = toWords.convert(123);
console.log("Words:", words);

const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
  // {
    //   title: "Payment",
    //   content: "Payment",
    // },
  ];
  
  const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_BASE_URL;
  console.log("uploadUrl333", uploadUrl);
  
  function page() {
  const route = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isadmissionPopup, setIsadmissionPopup] = useState(false);
  const [feesStructure, setFeesStructure] = useState("");
  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [formData2, setFormData2] = useState({
    form_id: "",
    fee_structure_info: [],
  });

  const { token } = theme.useToken();

  const [formData, setFormData] = useState({
    course_id: "",
    session_id: "",
    batch_id: "",
  });

  // create axistiong admission
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/admission/create", (url, { arg }) =>
    postFetcher(url, arg)
  );

  // payment page
  const {
    trigger: create2,
    data: paymentCreate,
    error: paymentError,
    isMutating: paymentIsloading,
  } = useSWRMutation("api/v1/payment/create-order", (url, { arg }) =>
    postFetcher(url, arg)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAdmission = async (src) => {
    setIsadmissionPopup(true);
  };
  const closeModal = () => {
    setIsadmissionPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await create(formData);
      setFeesStructure(response);
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        course_id: "",
        session_id: "",
        batch_id: "",
      });

      setFormData2({
        form_id: response?.data?.form_id,
        fee_structure_info: response?.data?.fee_structure
          .filter((fs) => fs.required == true)
          .map((item) => ({
            fee_head_id: item.fee_head_id,
            custom_min_amount: item.min_amount,
          })),
      });

      openAdmission();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      console.log("Upload Error:", error);
    }
  };

  const handleChangePayment = (e, item) => {
    const { checked } = e.target;
    const id = item.fee_head_id;
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));

    if (checked) {
      setFormData2((prev) => {
        const updatedFeeStructure = prev.fee_structure_info.filter(
          (fee) => fee.fee_head_id !== id
        );

        const amount = enteredAmounts[id] ?? item.amount;

        return {
          ...prev,
          fee_structure_info: [
            ...updatedFeeStructure,
            {
              fee_head_id: id,
              custom_min_amount: amount,
            },
          ],
        };
      });
    } else {
      // Remove from fee_structure_info if unchecked
      setFormData2((prev) => ({
        ...prev,
        fee_structure_info: prev.fee_structure_info.filter(
          (fee) => fee.fee_head_id !== id
        ),
      }));
    }
  };

  const handleAmountChange = (e, item) => {
    const value = Number(e.target.value);
    const id = item.fee_head_id;

    setEnteredAmounts((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (checkedItems[id] ?? item.required) {
      setFormData2((prev) => {
        const updatedFeeStructure = prev?.fee_structure_info?.filter(
          (fee) => fee.fee_head_id !== id
        );

        return {
          ...prev,
          fee_structure_info: [
            ...updatedFeeStructure,
            {
              fee_head_id: id,
              custom_min_amount: value,
            },
          ],
        };
      });
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log("formData2:", formData2);
    setFormData2({
      form_id: `${feesStructure?.data?.form_id}`,
      fee_structure_info: [],
    });

    try {
      const response2 = await create2(formData2);
      console.log("response2", response2);

      messageApi.open({
        type: "success",
        content: response2.message,
      });

      route.push(`${response2?.data?.payment_page_url}`);

      // setFormData2({});
      // setEnteredAmounts({});
      // setCheckedItems({});
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response2?.data?.message
          ? error.response2?.data?.message
          : "Try Again",
      });
      console.log("Upload Error:", error);
    }
  };

  const contentStyle = {
    // lineHeight: "260px",
    textAlign: "center",
    // color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const {
    data: courseList,
    loading: courseLoading,
    error: courseError,
  } = useSWR("api/v1/course/dropdown", getFetcher);
  if (courseLoading) {
    return <div>Loading ...</div>;
  }
  console.log("courseList", courseList);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId);
  };

  const selectedCourse = Array.isArray(courseList?.data)
    ? courseList?.data?.find((course) => course.id === selectedCourseId)
    : null;

  return (
    <>
      {contextHolder}
      <Navbar />

      {/* form body  */}
      <div style={contentStyle}>
        <div className="max-w-4xl mx-auto p-6 bg-white">
          {/* Header Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="w-12/12  mb-4">
                <label className="block text-lg font-bold text-gray-700 mb-1">
                  Choose your Courses
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  // onChange={handleInputChange}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Option</option>
                  {courseList?.data?.map((data, index) => (
                    <div key={index}>
                      <option value={`${data?.id}`}>{data?.course_name}</option>
                    </div>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Choose your Session
                  </label>
                  <select
                    disabled={!selectedCourse || !selectedCourse.session.length}
                    name="session_id"
                    value={formData.session_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Option</option>
                    {selectedCourse &&
                      selectedCourse?.session?.map((session, index) => (
                        <div key={index}>
                          <option value={`${session?.session_id}`}>
                            {session.session_name}
                          </option>
                        </div>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Choose your Batch
                  </label>
                  <select
                    name="batch_id"
                    value={formData.batch_id}
                    disabled={!selectedCourse || !selectedCourse.batch.length}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Option</option>
                    {selectedCourse &&
                      selectedCourse?.batch?.map((batch, index) => (
                        <div key={index}>
                          <option value={`${batch?.batch_id}`}>
                            {batch.month_name}
                          </option>
                        </div>
                      ))}
                  </select>
                </div>
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
        </div>
      </div>

      {isadmissionPopup && (
        <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 ">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition duration-300"
            onClick={closeModal}
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
            <div className="flex justify-center items-center">
              <p className="text-2xl text-white p-2 bg-red-500">Note*</p>
              <p className="text-2xl text-white p-2 bg-red-400">
                Don't Close or Refreash this page
              </p>{" "}
            </div>

            <form onSubmit={handleSubmit2} className="space-y-6">
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-center items-center">
                <div className="space-y-6">
                  {/* <div className="text-lg font-bold">
                    Total Selected Amount: ₹{totalAmount}
                  </div> */}
                  {feesStructure?.data?.fee_structure.map((item) => {
                    const isAmountEditable = item?.min_amount < item?.amount;
                    return (
                      <div
                        key={item.fee_head_id}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={
                              checkedItems[item.fee_head_id] ?? item.required
                            }
                            onChange={(e) => {
                              if (item.required == true) {
                                message.warning("This");
                                return;
                              }
                              handleChangePayment(e, item);
                            }}
                          />

                          <label className="flex-1">
                            {item.fee_head_name} : ₹{item.amount}
                          </label>

                          {isAmountEditable && (
                            <input
                              type="number"
                              min={item?.min_amount}
                              value={enteredAmounts[item.fee_head_id] || ""}
                              onChange={(e) => handleAmountChange(e, item)}
                              className="w-32 px-2 py-1 border rounded"
                            />
                          )}
                        </div>

                        {isAmountEditable &&
                          enteredAmounts[item.fee_head_id] <
                            item.min_amount && (
                            <span className="text-red-600 text-sm ml-6">
                              The minimum amount is ₹{item?.min_amount}
                            </span>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="space-x-4">
                    <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                      <button className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl">
                        <Link href="/login">Cash Payment</Link>
                      </button>

                      <button
                        type="submit"
                        className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                      >
                        Online Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </popup>
        </div>
      )}

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
