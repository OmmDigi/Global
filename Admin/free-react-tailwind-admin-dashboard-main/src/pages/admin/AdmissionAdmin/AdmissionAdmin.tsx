import { ChangeEvent, FormEvent, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableAdmission from "../../../components/tables/BasicTables/BasicTableAdmission";
import { FaEye } from "react-icons/fa";

import { Button, message, theme } from "antd";
import { Minus, Plus, Upload, X } from "lucide-react";
import useSWR from "swr";
import {
  getFetcher,
  patchFetcher,
  postFetcher,
  putFetcher,
  uploadUrl,
} from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import { uploadFiles } from "../../../utils/uploadFile";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

const initialFormData = {
  courseName: "",
  sessionName: "",
  batchName: "",
  image: "",
  candidateName: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  address: "",
  phone: "",
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
  guardianPhone: "",
  guardianSignature: "",
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
  admissionFeeAmount: ``,
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

  username: "",
  password: "",
};

export default function AdmissionAdmin() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [montessoriTeachers, setMontessoriTeachers] = useState(false);
  const [id, setId] = useState<number>();
  const [editedFormId, setEditedFormId] = useState<number>(-1);
  const [formData, setFormData] = useState(initialFormData);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [course, setCourse] = useState<number>(0);
  const [batch, setBatch] = useState<any>(0);
  const [searchData, setSearchData] = useState<any>({});
  const [formSearch, setFormSearch] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  // get course list
  // const steps = [
  //   {
  //     title: "First",
  //     content: "First-content",
  //   },
  //   {
  //     title: "Second",
  //     content: "Second-content",
  //   },
  //   {
  //     title: "Last",
  //     content: "Last-content",
  //   },
  // ]

  // get Course list
  const {
    data: courseList,
    // isLoading: courseLoading,
  } = useSWR(`api/v1/course/dropdown`, getFetcher);
  // if (courseLoading) {
  //   return <div>Loading ...</div>;
  // }
  const handleChildData = (data: any) => {
    setPageCount(data);
  };
  // get Admission list
  const { data: admissionlist, mutate } = useSWR(
    `api/v1/admission?page=${pageCount}`,
    getFetcher
  );

  const handleSearch = async () => {
    if (dateRange[0] && dateRange[0] && course && batch) {
      const response = await getFetcher(
        `api/v1/admission?from_date=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&to_date=${dayjs(dateRange[1]).format(
          "YYYY-MM-DD"
        )}&course=${course}&batch=${batch}`
      );
      if (response) {
        setSearchData(response);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Please Select all Input Fields",
      });
    }
  };

  const handleFormSearch = async () => {
    if (formSearch) {
      const response = await getFetcher(
        `api/v1/admission?form_no=${formSearch}`
      );
      if (response) {
        setSearchData(response);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Please Select all Input Fields",
      });
    }
  };

  const { trigger: create } = useSWRMutation(
    "api/v1/admission/create",
    (url, { arg }) => postFetcher(url, arg)
  );

  // update course
  const { trigger: update } = useSWRMutation(
    "api/v1/admission/form",
    (url, { arg }) => putFetcher(url, arg)
  );
  const { trigger: update2 } = useSWRMutation(
    "api/v1/admission",
    (url, { arg }) => patchFetcher(url, arg)
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBatch(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any, name: string) => {
    const files = e.target.files;

    // Array.from(files).forEach((files) => {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     console.log("Preview:",files);
    //   };
    //   reader.readAsDataURL(files);
    // });
    // setFiles(Array.from(files).map(item => ({})));
    uploadFiles({
      url: `${uploadUrl}api/v1/upload/multiple`,
      files: Array.from(files),
      folder: "admission_doc",

      onUploaded(result) {
        const response = result?.map((item, index) => ({
          name: files[index]?.name,
          url: item.downloadUrl,
        }));
        setFormData((prev) => ({
          ...prev,
          [name]: response,
        }));
        // setFiles(response as any);
      },
      onError(error) {
        console.log("file error", error);
      },
    });
  };

  const handleEducationChange = (
    level: string,
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
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

  const handleFileUpload = (e: any, type: string) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (type === "photo") {
          setPhoto(result as any);
        }
      };
      reader.readAsDataURL(file);

      uploadFiles({
        url: `${uploadUrl}api/v1/upload/multiple`,
        files: [file],
        folder: "profile_image",
        onUploaded(result) {
          setFormData((prev) => ({
            ...prev,
            image: result[0]?.downloadUrl,
          }));
        },
      });
    }
  };

  const removeFile = (type: "photo") => {
    if (type === "photo") {
      setPhoto(null);
    }
  };

  const removeFile2 = (fieldName: string, index: number) => {
    if (!confirm("Are you sure want to remove")) return;
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_: any, i: number) => i !== index),
    }));
  };

  const admissionForm = {
    course_id: formData.courseName,
    batch_id: formData.batchName,
    session_id: formData.sessionName,
    declaration_status: 1,
    admission_data: JSON.stringify(formData),
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create(admissionForm as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      if (response.success === true) {
        setFormData(initialFormData);
      }
      mutate();
      setCurrent(0);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      // alert("Form submitted successfully!");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      jumpToTop();
      setMontessoriTeachers(true);
      const response = await getFetcher(`api/v1/admission/form/${id}`);
      const userData = JSON.parse(response?.data?.admission_details ?? "{}");
      console.log("userData", userData);

      const tempObj: any = {};

      Object.entries(userData).forEach(([key, value]) => {
        tempObj[key] = value;
      });

      //  setCurrent(0);
      setFormData(tempObj);
      setEditedFormId(response?.data?.form_id);
      setSelectedCourseId(userData?.courseName);
      setPhoto(userData?.image);
      // alert(typeof userData?.courseName);
      // alert(userData?.courseName);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const admissionFormUpdate = {
    form_id: id,
    admission_data: JSON.stringify(formData),
  };
  const handleUpdate = async () => {
    try {
      const response = await update(admissionFormUpdate as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate();
      setId(0);
      setMontessoriTeachers(false);
      setCurrent(0);

      setFormData(initialFormData);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
    }
  };

  const handleActive = async (isActive: boolean, id: number) => {
    type UpdateFormPayload = {
      form_id: number; // depends on your API, choose one
      form_status: boolean;
    };
    const UpdateFormPayload: UpdateFormPayload = {
      form_id: id,
      form_status: isActive,
    };
    try {
      const response = await update2(UpdateFormPayload as any);

      mutate();
      messageApi.open({
        type: "success",
        content: response.message,
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleTeacherShow = () => {
    jumpToTop();
    setMontessoriTeachers(false);
  };
  const handleTeacherClose = () => {
    setMontessoriTeachers(true);
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

  const contentStyle = {
    // textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleCourseChange = (e: any) => {
    const { name, value } = e.target;
    setCourse(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const courseId = parseInt(e.target.value);
    console.log("courseId", courseId);

    setSelectedCourseId(courseId as any);
  };

  const FormSearch = (e: any) => {
    const { value } = e.target;
    setFormSearch(value);
  };

  const selectedCourse = Array.isArray(courseList?.data)
    ? courseList?.data?.find((course: any) => course.id == selectedCourseId)
    : null;
  console.log("selectedCourse", selectedCourse?.admission_fee);

  return (
    <div>
      <div className="z-50 fixed top-50">{contextHolder}</div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Admission" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Admission">
            {/* form body  */}

            <div
              onClick={
                montessoriTeachers ? handleTeacherShow : handleTeacherClose
              }
              className="cursor-pointer text-gray-500 hover:text-gray-500 dark:text-gray-300  flex items-center justify-center"
            >
              {montessoriTeachers ? (
                <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
                  <Minus className="text-red-500" size={50} />
                  <div className="text-2xl"> Student Admission</div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
                  <Plus size={50} />
                  <div className="text-2xl"> Student Admission</div>
                </div>
              )}
            </div>
            {montessoriTeachers && (
              <div>
                <div className="p-7 pl-30 pr-30  flex items-center sticky top-20 bg-gray-100  dark:bg-gray-800 dark:text-gray-100   text-gray-800  z-20 justify-center">
                  {/* <Steps
                    style={{ fontSize: "20px", width: "" }}
                    current={current}
                    items={items}
                  /> */}
                </div>

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
                              Choose your Courses
                            </label>
                            <select
                              key={editedFormId + "courseName"}
                              name="courseName"
                              disabled={id ? true : false}
                              defaultValue={formData?.courseName}
                              // value={formData.courseName}
                              onChange={handleCourseChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Option</option>
                              {courseList?.data?.map(
                                (data: any, index: number) => (
                                  <option key={index} value={`${data?.id}`}>
                                    {data?.course_name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-10">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">
                                Choose your Session
                              </label>
                              <select
                                key={editedFormId + "sessionName"}
                                name="sessionName"
                                disabled={id ? true : false}
                                defaultValue={formData.sessionName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Option</option>

                                {selectedCourse?.session?.map(
                                  (session: any, index: number) => (
                                    <option
                                      key={index}
                                      value={`${session?.session_id}`}
                                    >
                                      {session.session_name}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">
                                Choose your Batch
                              </label>
                              <select
                                key={editedFormId + "batchName"}
                                name="batchName"
                                disabled={id ? true : false}
                                defaultValue={formData.batchName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Option</option>
                                {selectedCourse?.batch?.map(
                                  (batch: any, index: number) => (
                                    <option
                                      key={index}
                                      value={`${batch?.batch_id}`}
                                    >
                                      {batch.month_name}
                                    </option>
                                  )
                                )}
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
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handleFileUpload(e, "photo")
                                            }
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
                                    Candidate's Name
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
                                    Father's Name
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
                                    Mother's Name
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
                                    Guardian's Name
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
                                    Address
                                  </label>
                                  <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    // rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-1">
                                    Whatsapp No
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
                                    Mobile
                                  </label>
                                  <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-1">
                                    Sex
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
                                    Date of Birth
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
                                    Category
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
                                    Person with Disability
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
                                    Monthly Income (in Rupees)
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
                              I hereby declare that the information provided by
                              me is true and subject to verification by G.T.I. I
                              hereby acknowledge that I have read and understood
                              the rules and regulations, fee structure, syllabus
                              decided by G.T.I. And I agree to abide by the
                              same.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <label className="block text-sm text-start text-gray-700 mb-1">
                                  Place
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
                                  Name
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
                                  Date
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

                      {/* Office Use Only */}

                      {/* Submit Button */}
                      {/* <div className="text-center">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Submit Application
                            </button>
                          </div> */}
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
                                    Self attested copies of last result
                                  </label>
                                  <input
                                    type="file"
                                    name="selfAttestedLastResult"
                                    onChange={(e) =>
                                      handleFileChange(
                                        e,
                                        "selfAttestedLastResult"
                                      )
                                    }
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  {formData?.selfAttestedLastResult?.length >
                                    0 && (
                                    <div className="mt-2 space-y-1">
                                      {formData?.selfAttestedLastResult?.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                                          >
                                            <span className="truncate">
                                              {file?.name}
                                            </span>
                                            <div className="flex justify-end">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  window.open(file?.url)
                                                }
                                                className="text-blue-500 hover:text-blue-700 ml-2 "
                                              >
                                                <FaEye />
                                              </button>
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
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-2">
                                    Age Proof (Madhyamik certificate / PAN Card)
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
                                      {formData?.ageProofAdmitCard?.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                                          >
                                            <span className="truncate">
                                              {file?.name}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeFile2(
                                                  "ageProofAdmitCard",
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
                                    Address Proof (Aadhar Card )
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
                                      {formData?.addressProof?.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                                          >
                                            <span className="truncate">
                                              {file.name}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeFile2(
                                                  "addressProof",
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
                              </div>
                            </div>

                            {/* Declaration Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                              <h2 className="text-lg font-semibold mb-4">
                                Declaration
                              </h2>

                              <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                                I hereby declare that all the particulars stated
                                in this application form are true to the host of
                                my knowledge and belief. Also agree to able by
                                all the Rules & Regulation of the Institute. I
                                further understand that admission fees once paid
                                can not be refund. I clearly understand that
                                fees structure of the choise may be changed at
                                any time according to circulation from council/
                                University/ Institute College. I also understand
                                that my Admission is purely provisional subject
                                to that verification of the eligibility
                                condition as per perscribed by the board. I
                                acknowledge that the institute has full right to
                                add/delete/ change the class schedule. Fees
                                structure. Rule and Regulation as and when
                                required. All legal clause Concerning GLOBAL
                                TECHNICAL INSTITUTE shall lie within
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
                              <h2 className="text-lg font-semibold mb-4">
                                Details
                              </h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-2">
                                    Name of Applicant
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
                                    Name of Parent/Guardian
                                  </label>
                                  <input
                                    type="text"
                                    name="guardianSignature"
                                    value={formData.guardianSignature}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Parent/Guardian's signature"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-2">
                                    Phono No of Parent/Guardian
                                  </label>
                                  <input
                                    type="text"
                                    name="guardianPhone"
                                    value={formData.guardianPhone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Phono No of Parent/Guardian"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm text-start text-gray-700 mb-2">
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

                            {/* Office Use Only Section */}
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
                                      <option value="D/o">
                                        D/o (Daughter of)
                                      </option>
                                      <option value="W/o">W/o (Wife of)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                                      Father's/Husband's Name
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
                                    <strong>Declaration:</strong> I hereby
                                    declare that I will have to pay a sum of Rs.
                                    <input
                                      type="number"
                                      readOnly
                                      name="admissionFeeAmount"
                                      value={selectedCourse?.admission_fee}
                                      onChange={handleInputChange}
                                      className="mx-2 w-30 p-1 border border-gray-300 rounded text-center"
                                    />
                                    {/* /- (Rupees{" "}
                                    <span className="test-lg font-bold">
                                      Five Thousand
                                    </span>
                                    ) */}
                                    only towards Admission Fee for Montessori
                                    Teachers' Training course (6 Months) of
                                  </p>

                                  <p className="text-sm text-gray-700 mt-2">
                                    within 3 (three) months from the date of
                                    getting Admission in the aforesaid Course.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Second Declaration Section */}
                            {selectedCourse?.bss_fee ? (
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
                                        <option value="S/o">
                                          S/o (Son of)
                                        </option>
                                        <option value="D/o">
                                          D/o (Daughter of)
                                        </option>
                                        <option value="W/o">
                                          W/o (Wife of)
                                        </option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                                        Father's/Husband's Name
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
                                      <strong>Declaration:</strong> I hereby
                                      declare that I will also have to pay a sum
                                      of Rs.
                                      <input
                                        type="number"
                                        readOnly
                                        name="bssRegistrationFee"
                                        value={
                                          selectedCourse?.bss_fee
                                            ? selectedCourse?.bss_fee
                                            : "0"
                                        }
                                        onChange={handleInputChange}
                                        className="mx-2 w-30 p-1 border border-gray-300 rounded text-center"
                                      />
                                      {/* /- (Rupees{" "}
                                    <span className="test-lg font-bold">
                                      Five Thousand
                                    </span>
                                    ) */}
                                      only towards BSS Registration Fee within 3
                                      (Three) months after 6 (Six) months of
                                      getting Admission for Montessori Teachers'
                                      Training Course.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}

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
                        </div>
                      )}
                      <div className="mt-[20px] mb-[20px] flex justify-center">
                        {current > 0 && (
                          <Button
                            style={{ margin: "0 8px" }}
                            onClick={() => prev()}
                          >
                            Previous
                          </Button>
                        )}
                        {current === 2 ? (
                          <div>
                            {id ? (
                              <div
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                              >
                                Update
                              </div>
                            ) : (
                              <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                              >
                                Submit
                              </button>
                            )}
                          </div>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => {
                              next();
                            }}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-6">
              <h3 className="text-gray-500 dark:text-gray-400 ">
                Admission List
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">
                  Select date range
                </label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/MM/yyyy - dd/MM/yyyy"
                  className="border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                  calendarClassName="!bg-white dark:!bg-gray-200"
                />
              </div>
              <div className="  mb-4">
                <label className="block text-sm font-bold text-gray-500 mb-1">
                  Choose your Courses
                </label>
                <select
                  key={editedFormId + "courseName"}
                  name="courseName"
                  disabled={id ? true : false}
                  defaultValue={formData?.courseName}
                  // value={formData.courseName}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  <option value="">Option</option>
                  {courseList?.data?.map((data: any, index: number) => (
                    <option key={index} value={`${data?.id}`}>
                      {data?.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">
                  Choose your Batch
                </label>
                <select
                  key={editedFormId + "batchName"}
                  name="batchName"
                  disabled={id ? true : false}
                  defaultValue={formData.batchName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Option</option>
                  {selectedCourse?.batch?.map((batch: any, index: number) => (
                    <option key={index} value={`${batch?.batch_id}`}>
                      {batch.month_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-5">
                <Button type="primary" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
            <div>
              <div>
                <label className="block text-sm text-start text-gray-500 mb-1">
                  Search by Form No
                </label>
                <input
                  type="text"
                  name="form_no"
                  onChange={FormSearch}
                  className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md"
                />
              </div>
              <div className="flex justify-end mt-5">
                <Button type="primary" onClick={handleFormSearch}>
                  Search
                </Button>
              </div>
            </div>
            <BasicTableAdmission
              admissionlist={searchData?.data ? searchData : admissionlist}
              onEdit={handleEdit}
              onActive={handleActive}
              onSendData={handleChildData}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
