"use client";
import React, { useState } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button, message, Steps, theme } from "antd";
import { Upload, X } from "lucide-react";
import { useScrollChecker } from "@/components/useScrollChecker";
import { ToWords } from "to-words";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher, getFetcher, postFetcher } from "@/lib/fetcher";
import { uploadFiles } from "@/utils/uploadFile";
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
  // {
  //   title: "Last",
  //   content: "Last-content",
  // },
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
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const [formData, setFormData] = useState({
    courseName: "",
    sessionName: "",
    batchName: "",
    date: "",
    image: "",
    candidateName: "",
    fatherName: "",
    motherName: "",
    guardianName: "",
    address: "",
    phone: "",
    email: "",
    mobile: "",
    sex: "",
    dateOfBirth: "",
    bloodGroup: "",
    category: "",
    disability: "",
    monthlyIncome: "",
    languages: "",
    education: {
      madhyamik: { subjects: "", board: "", year: "", marks: "" },
      hsH2: { subjects: "", board: "", year: "", marks: "" },
      degree: { subjects: "", board: "", year: "", marks: "" },
      pg: { subjects: "", board: "", year: "", marks: "" },
      others: { subjects: "", board: "", year: "", marks: "" },
    },
    place: "",
    name: "",
    date: "",

    // Next page
    selfAttestedLastResult: [],
    ageProofAdmitCard: [],
    stampSizePhotos: [],
    addressProof: [],

    // Declaration section
    declarationAccepted: false,

    // Signature section
    applicantSignature: "",
    applicantDate: "",
    guardianSignature: "",
    guardianPhone: "",
    // guardianDate: "",

    // Office use section
    admitRejectedReason: "",
    admissionNo: "",
    remarks: "",
    authoritySignature: "",
    authorityDate: "",
    principalSignature: "",
    principalDate: "",

    // First Declaration
    applicantTitle1: "",
    applicantName1: "",
    relationshipType1: "",
    relationName1: "",
    admissionFeeAmount: "5000",
    admissionFeeWords: "Five thousand",
    courseDetails: "",
    batchNumber: "",

    // Second Declaration
    applicantTitle2: "",
    applicantName2: "",
    relationshipType2: "",
    relationName2: "",
    bssRegistrationFee: "5000",
    bssRegistrationFeeWords: "Five thousand",

    // Signatures and Dates
    parentGuardianSignature: "",
    parentGuardianDate: "",
    applicantSignature: "",
    applicantDate: "",

    username: "",
    password: "",
  });

  const [formData2, setFormData2] = useState({
    form_id: "",
    fee_structure_info: [],
  });

  const [photo, setPhoto] = useState(null);
  const [isadmissionPopup, setIsadmissionPopup] = useState(false);
  const [feesStructure, setFeesStructure] = useState("");
  const [enteredAmounts, setEnteredAmounts] = useState({});

  // get Course list
  const {
    data: courseList,
    loading: courseLoading,
    error: courseError,
  } = useSWR("api/v1/course/dropdown", getFetcher);
  if (courseLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }
  console.log("courseList", courseList);

  // create Admission

  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/admission/create", (url, { arg }) =>
    postFetcher(url, arg)
  );
  const {
    trigger: create2,
    // data: dataCreate,
    // error: dataError,
    // isMutating: feesIsloading,
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

  const handleFileChange = (e, name) => {
    const files = e.target.files;

    console.log("handleFileChange", files);

    uploadFiles({
      url: `${uploadUrl}api/v1/upload/multiple`,
      files: [files],
      folder: "admission_doc",
      onUploading(percent) {},
      onUploaded(result) {
        setFormData((prev) => ({
          ...prev,
          [name]: Array.from(files),
        }));
      },
    });
  };

  const handleEducationChange = (level, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: {
          ...prev.education[level],
          [field]: value,
        },
      },
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    console.log("file", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type == "photo") {
          console.log("e.target.result", e.target.result);
          setPhoto(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }

    uploadFiles({
      url: `${uploadUrl}api/v1/upload/multiple`,
      files: [file],
      folder: "profile_image",
      onUploading(percent) {},
      onUploaded(result) {
        setFormData((prev) => ({
          ...prev,
          image: result[0],
        }));
      },
    });
  };

  const removeFile = (type) => {
    if (type === "photo") {
      setPhoto(null);
    }
  };
  const removeFile2 = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };
  const openAdmission = async (src) => {
    setIsadmissionPopup(true);
  };
  const closeModal = () => {
    setIsadmissionPopup(false);
  };

  const admissionForm = {
    course_id: formData.courseName,
    batch_id: formData.batchName,
    session_id: formData.sessionName,
    admission_data: JSON.stringify(formData),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await create(admissionForm);
      setFeesStructure(response ? response : "");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setFormData({
        education: {},
        selfAttestedLastResult: [],
        ageProofAdmitCard: [],
        stampSizePhotos: [],
        addressProof: [],
      });
      setFormData2({
        form_id: response?.data?.form_id,
        fee_structure_info: response?.data?.fee_structure.map((item) => ({
          fee_head_id: item.fee_head_id,
          custom_min_amount: item.min_amount,
        })),
      });
      openAdmission();
      setCurrent(0);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      console.log("Upload Error:", error);
      // alert("Form submitted successfully!");
    }
  };

  const handleAmountChange = (e, item) => {
    const value = Number(e.target.value);
    const id = item.fee_head_id;

    setEnteredAmounts((prev) => ({
      ...prev,
      [id]: value,
    }));

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
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log("formData2:", formData2);
    setFormData2({
      form_id: `${feesStructure?.data?.form_id}`,
      fee_structure_info: formData2.fee_structure_info,
    });

    try {
      const response2 = await create2(formData2);
      console.log("response2", response2);

      messageApi.open({
        type: "success",
        content: response2.message,
      });

      // route.push(`${response2?.data?.payment_page_url}`);
      window.open(`${response2?.data?.payment_page_url}`, "__blank");
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

  const jumpToTop = () => {
    window.scrollTo({
      top: 50,
      behavior: "smooth",
    });
  };

  const next = () => {
    jumpToTop();
    setCurrent(current + 1);
  };
  const prev = () => {
    jumpToTop();
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle = {
    // lineHeight: "260px",
    textAlign: "center",
    // color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

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

  console.log("feesStructure", feesStructure);

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="hidden pl-30 pr-30  md:pl-30 md:pr-30 md:p-7  md:flex items-center sticky top-25 bg-amber-50 z-20 justify-center">
        <Steps
          style={{ fontSize: "20px", width: "" }}
          current={current}
          items={items}
          direction="horizontal"
        />
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
                Don&apos;t Close or Refreash this page
              </p>{" "}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-center items-center mb-3">
              {/* ghfghf */}
              {feesStructure?.data?.course_name}
            </div>
            <form onSubmit={handleSubmit2} className="space-y-6">
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-center items-center">
                <div className="space-y-6">
                  {/* <div className="text-lg font-bold">
                    Total Selected Amount: ₹{totalAmount}
                  </div> */}
                  {feesStructure?.data?.fee_structure?.map((item) => {
                    const isAmountEditable = item?.min_amount < item?.amount;
                    return (
                      <div
                        key={item.fee_head_id}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-4">
                          {/* <input
                            type="checkbox"
                            checked={
                              checkedItems[item?.fee_head_id] ?? item?.required
                            }
                            onChange={(e) => {
                              if (item.required == true) {
                                message.warning("This");
                                return;
                              }
                              handleChangePayment(e, item);
                            }}
                          /> */}

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

                        <span className="text-red-600 text-sm ml-6">
                          The minimum amount is ₹{item?.min_amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end">
                <div className=" text-red-400">
                  {feesStructure?.data?.fee_structure[1]?.fee_head_name} fees is
                  non refundable <span className="text-red-500">**</span>
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

      {/* form body  */}
      <div style={contentStyle}>
        <div className="max-w-4xl mx-auto p-6 bg-white">
          {/* Header Section */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Serial No and Date */}
            {current === 0 && (
              <div>
                <div className="w-12/12  mb-4">
                  <label className="block text-lg font-bold text-gray-700 mb-1">
                    Choose your Courses <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="courseName"
                    // value={formData.courseName}
                    onChange={handleCourseChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Option</option>
                    {courseList?.data?.map((data, index) => (
                      <option key={index} value={`${data?.id}`}>
                        {data?.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-10">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Choose your Session{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      disabled={
                        !selectedCourse || !selectedCourse.session.length
                      }
                      name="sessionName"
                      value={formData.sessionName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Option</option>

                      {selectedCourse &&
                        selectedCourse?.session?.map((session, index) => (
                          <option key={index} value={`${session?.session_id}`}>
                            {session.session_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Choose your Batch <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="batchName"
                      value={formData.batchName}
                      disabled={!selectedCourse || !selectedCourse.batch.length}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Option</option>
                      {selectedCourse?.batch
                        ?.filter(
                          (batch) => batch.session_id == formData.sessionName
                        )
                        .map((batch, index) => (
                          <option key={index} value={`${batch.batch_id}`}>
                            {batch.month_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Personal Details */}
                <div className=" border-gray-300 p-4">
                  <h2 className="text-lg font-semibold mb-4 bg-gray-100 p-2">
                    Personal Details
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                      <div></div>
                      <div></div>
                      <div className="ml-4 flex  justify-center">
                        <div className="w-32 h-40 border-2 border-gray-400 flex flex-col items-center justify-center bg-gray-50">
                          {photo ? (
                            <div className="relative w-full h-full">
                              <img
                                src={photo}
                                alt="Candidate"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeFile("photo")}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload
                                size={24}
                                className="mx-auto mb-2 text-gray-400"
                              />
                              <p className="text-xs text-gray-500">
                                Paste Your Photo
                              </p>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, "photo")}
                                  className="hidden"
                                />
                                <span className="text-xs text-blue-500 hover:text-blue-700">
                                  Upload
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Candidate&apos;s Name{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          name="candidateName"
                          value={formData.candidateName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Father&apos;s Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Mother&apos;s Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Guardian&apos;s Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianName"
                          value={formData.guardianName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Whatsapp No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Sex <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="sex"
                          value={formData.sex}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Blood Group
                        </label>
                        <input
                          type="text"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="General">General</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="OBC">OBC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Person with Disability{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="disability"
                          value={formData.disability}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-1">
                          Monthly Income (in Rupees){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-start text-gray-700 mb-1">
                        Languages Known
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Education Qualification */}
                <div className="border-2 border-gray-300 p-4">
                  <h2 className="text-lg font-semibold mb-4 bg-gray-100 p-2">
                    Education Qualification
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">
                            Name of Examination
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Subjects
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Board/University
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Year of Passing
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            % of Marks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object?.entries(formData?.education)?.map(
                          ([level, data]) => (
                            <tr key={level}>
                              <td className="border border-gray-300 p-2 font-start">
                                {level === "madhyamik"
                                  ? "Madhyamik"
                                  : level === "hsH2"
                                  ? "H.S/H-2"
                                  : level === "degree"
                                  ? "Degree"
                                  : level === "pg"
                                  ? "PG"
                                  : "Others (Specify)"}
                              </td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={data.subjects}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      level,
                                      "subjects",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={data.board}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      level,
                                      "board",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={data.year}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      level,
                                      "year",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={data.marks}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      level,
                                      "marks",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Declaration and Signature */}
                <div className="border-2 border-gray-300 p-4 text-center">
                  <h2 className="text-lg font-semibold mb-4 bg-gray-100 p-2">
                    Declaration
                  </h2>
                  <p className="text-sm text-gray-700 mb-4">
                    I hereby declare that the information provided by me is true
                    and subject to verification by G.T.I. I hereby acknowledge
                    that I have read and understood the rules and regulations,
                    fee structure, syllabus decided by G.T.I. And I agree to
                    abide by the same.
                  </p>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm text-start text-gray-700 mb-1">
                        Place <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-start text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="mt-4">
                      <label className="block text-sm text-start text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {current === 1 && (
              <div className="max-w-4xl mx-auto   min-h-screen">
                <div className="space-y-6">
                  {/* Header - Placeholder for logo */}

                  {/* Documents Section */}
                  <div className="bg-white p-6 rounded-lg ">
                    <h2 className="text-lg font-semibold mb-4">
                      Documents to be enclosed with the application
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Self attested copies of last result{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="selfAttestedLastResult"
                          onChange={(e) =>
                            handleFileChange(e, "selfAttestedLastResult")
                          }
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData?.selfAttestedLastResult?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {formData?.selfAttestedLastResult?.map(
                              (file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                                >
                                  <span className="truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFile2(
                                        "selfAttestedLastResult",
                                        index
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Age Proof (Madhyamik certificate / PAN Card){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="ageProofAdmitCard"
                          onChange={(e) =>
                            handleFileChange(e, "ageProofAdmitCard")
                          }
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData?.ageProofAdmitCard?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {formData?.ageProofAdmitCard?.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                              >
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFile2("ageProofAdmitCard", index)
                                  }
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Address Proof (Aadhar Card ){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="addressProof"
                          onChange={(e) =>
                            handleFileChange(e, "ageProofAdmitCard")
                          }
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData?.addressProof?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {formData?.addressProof?.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                              >
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFile2("addressProof", index)
                                  }
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Declaration Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Declaration</h2>

                    <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                      I hereby declare that all the particulars stated in this
                      application form are true to the host of my knowledge and
                      belief. Also agree to able by all the Rules & Regulation
                      of the Institute. I further understand that admission fees
                      once paid can not be refund. I clearly understand that
                      fees structure of the choise may be changed at any time
                      according to circulation from council/ University/
                      Institute College. I also understand that my Admission is
                      purely provisional subject to that verification of the
                      eligibility condition as per perscribed by the board. I
                      acknowledge that the institute has full right to
                      add/delete/ change the class schedule. Fees structure.
                      Rule and Regulation as and when required. All legal clause
                      Concerning GLOBAL TECHNICAL INSTITUTE shall lie within
                      jurisdiction at Beleghata, Phool Bagan, Kolkata.
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="declarationAccepted"
                        checked={formData.declarationAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">
                        I accept the above declaration
                      </label>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Name of Applicant{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="applicantSignature"
                          value={formData.applicantSignature}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Applicant's signature"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Name of Parent/Guardian{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianSignature"
                          value={formData.guardianSignature}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Parent/Guardian's Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Phone No of Parent/Guardian{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Parent/Guardian's Phone No"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="applicantDate"
                          value={formData.applicantDate}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm text-start text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          name="guardianDate"
                          value={formData.guardianDate}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className=" mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                      Set User Name (Mobile No / Gmail){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder=" Set User Name (Mobile No / Gmail)"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                      Set password (Set Own password){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder=" Set password (Set Own password)"
                    />
                  </div>
                </div>
              </div>
            )}

            {current === 2 && (
              <div className="max-w-4xl mx-auto  bg-white min-h-screen">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 underline mb-8">
                      DECLARATION
                    </h1>
                  </div>

                  {/* First Declaration Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                      First Declaration - Admission Fee
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Title
                          </label>
                          <select
                            name="applicantTitle1"
                            value={formData.applicantTitle1}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Sri">Sri</option>
                            <option value="Smt">Smt</option>
                            <option value="Miss">Miss</option>
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="applicantName1"
                            value={formData.applicantName1}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter full name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Relationship Type
                          </label>
                          <select
                            name="relationshipType1"
                            value={formData.relationshipType1}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="S/o">S/o (Son of)</option>
                            <option value="D/o">D/o (Daughter of)</option>
                            <option value="W/o">W/o (Wife of)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Father&apos;s/Husband&apos;s Name
                          </label>
                          <input
                            type="text"
                            name="relationName1"
                            value={formData.relationName1}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter name"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700 mb-4">
                          <strong>Declaration:</strong> I hereby declare that I
                          will have to pay a sum of Rs.
                          <input
                            type="number"
                            readOnly
                            name="admissionFeeAmount"
                            value={formData.admissionFeeAmount}
                            onChange={handleInputChange}
                            className="mx-2 w-20 p-1 border border-gray-300 rounded text-center"
                          />
                          /- (Rupees{" "}
                          <span className="test-lg font-bold">
                            Five Thousand
                          </span>
                          ) only towards Admission Fee for Montessori
                          Teachers&apos; Training course (6 Months) of
                        </p>

                        <p className="text-sm text-gray-700 mt-2">
                          within 3 (three) months from the date of getting
                          Admission in the aforesaid Course.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second Declaration Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                      Second Declaration - BSS Registration Fee
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Title
                          </label>
                          <select
                            name="applicantTitle2"
                            value={formData.applicantTitle2}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Sri">Sri</option>
                            <option value="Smt">Smt</option>
                            <option value="Miss">Miss</option>
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="applicantName2"
                            value={formData.applicantName2}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter full name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Relationship Type
                          </label>
                          <select
                            name="relationshipType2"
                            value={formData.relationshipType2}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="S/o">S/o (Son of)</option>
                            <option value="D/o">D/o (Daughter of)</option>
                            <option value="W/o">W/o (Wife of)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Father&apos;s/Husband&apos;s Name
                          </label>
                          <input
                            type="text"
                            name="relationName2"
                            value={formData.relationName2}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter name"
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700">
                          <strong>Declaration:</strong> I hereby declare that I
                          will also have to pay a sum of Rs.
                          <input
                            type="number"
                            readOnly
                            name="bssRegistrationFee"
                            value={formData.bssRegistrationFee}
                            onChange={handleInputChange}
                            className="mx-2 w-20 p-1 border border-gray-300 rounded text-center"
                          />
                          /- (Rupees{" "}
                          <span className="test-lg font-bold">
                            Five Thousand
                          </span>
                          ) only towards BSS Registration Fee within 3 (Three)
                          months after 6 (Six) months of getting Admission for
                          Montessori Teachers&apos; Training Course.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                      Signatures
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="border-b-2 border-dashed border-gray-300 pb-4">
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Signature of Parent/Guardian
                          </label>
                          <input
                            type="text"
                            name="parentGuardianSignature"
                            value={formData.parentGuardianSignature}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Parent/Guardian signature"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            name="parentGuardianDate"
                            value={formData.parentGuardianDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border-b-2 border-dashed border-gray-300 pb-4">
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Signature of the Applicant/Candidate
                          </label>
                          <input
                            type="text"
                            name="applicantSignature"
                            value={formData.applicantSignature}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Applicant signature"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            name="applicantDate"
                            value={formData.applicantDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
              </div>
            )}
            <div className=" flex justify-center">
              {current > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
              {current === steps.length - 1 && (
                <button
                  className="bg-blue-400 h-8 w-20 rounded text-white"
                  type="primary"
                >
                  Submit
                </button>
              )}
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* pre Admission  */}

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
