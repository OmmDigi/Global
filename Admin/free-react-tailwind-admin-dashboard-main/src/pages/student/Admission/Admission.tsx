// import { ChangeEvent, FormEvent, useState } from "react";
// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import PageMeta from "../../../components/common/PageMeta";
// import ComponentCard from "../../../components/common/ComponentCard";

// import { Button, message,  theme } from "antd";
// import { Minus, Plus, Upload, X } from "lucide-react";

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
// ];

// export default function Admission() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [current, setCurrent] = useState(0);
//   const [photo, setPhoto] = useState <string | null>(null);
//   const [signature, setSignature] = useState<string | null>(null);
//   const [montessoriTeachers, setMontessoriTeachers] = useState(false);

//   const [formData, setFormData] = useState({
//     serialNo: "",
//     date: "",
//     candidateName: "",
//     fatherName: "",
//     motherName: "",
//     guardianName: "",
//     address: "",
//     phone: "",
//     mobile: "",
//     sex: "",
//     dateOfBirth: "",
//     bloodGroup: "",
//     category: "",
//     disability: "",
//     monthlyIncome: "",
//     languages: "",
//     education: {
//       madhyamik: { subjects: "", board: "", year: "", marks: "" },
//       hsH2: { subjects: "", board: "", year: "", marks: "" },
//       degree: { subjects: "", board: "", year: "", marks: "" },
//       pg: { subjects: "", board: "", year: "", marks: "" },
//       others: { subjects: "", board: "", year: "", marks: "" },
//     },
//     // Next page
//     selfAttestedLastResult: [],
//     ageProofAdmitCard: [],
//     stampSizePhotos: [],
//     addressProof: [],

//     // Declaration section
//     declarationAccepted: false,

//     // Signature section

//     guardianSignature: "",
//     guardianDate: "",

//     // Office use section
//     admitRejectedReason: "",
//     admissionNo: "",
//     remarks: "",
//     authoritySignature: "",
//     authorityDate: "",
//     principalSignature: "",
//     principalDate: "",

//     // First Declaration
//     applicantTitle1: "",
//     applicantName1: "",
//     relationshipType1: "",
//     relationName1: "",
//     admissionFeeAmount: "5000",
//     admissionFeeWords: "Five thousand",
//     courseDetails: "",
//     batchNumber: "",

//     // Second Declaration
//     applicantTitle2: "",
//     applicantName2: "",
//     relationshipType2: "",
//     relationName2: "",
//     bssRegistrationFee: "5000",
//     bssRegistrationFeeWords: "Five thousand",

//     // Signatures and Dates
//     parentGuardianSignature: "",
//     parentGuardianDate: "",
//     applicantSignature: "",
//     applicantDate: "",
//   });

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: Array.from(files),
//       }));
//     }
//   };

//   const handleEducationChange = (
//     level: string,
//     field: string,
//     value: string
//   ) => {

//     setFormData((prev) => ({
//       ...prev,
//       education: {
//         ...prev.education,
//         [level]: {
//           ...prev.education[level],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const handleFileUpload = (
//     e: ChangeEvent<HTMLInputElement>,
//     type: "photo" | "signature"
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event: ProgressEvent<FileReader>) => {
//         const result = event.target?.result as string;
//         if (type === "photo") {
//           setPhoto(result);
//         } else if (type === "signature") {
//           setSignature(result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeFile = (type: "photo" | "signature") => {
//     if (type === "photo") {
//       setPhoto(null);
//     } else if (type === "signature") {
//       setSignature(null);
//     }
//   };

//   // const removeFile2 = (fieldName: string, index: number) => {
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [fieldName]: prev[fieldName]?.filter((_: any, i: number) => i !== index),
//   //   }));
//   // };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setMontessoriTeachers(true);

//
//     alert("Form submitted successfully!");
//   };

//   const handleTeacherShow = () => {
//     jumpToTop();
//     setMontessoriTeachers(false);
//   };
//   const handleTeacherClose = () => {
//     setMontessoriTeachers(true);
//   };

//   const jumpToTop = () => {
//     window.scrollTo({
//       top: 50,
//       behavior: "smooth",
//     });
//   };

//   const next = () => {
//     jumpToTop();
//     setCurrent(current + 1);
//   };
//   const prev = () => {
//     jumpToTop();
//     setCurrent(current - 1);
//   };

//   const items = steps.map((item) => ({ key: item.title, title: item.title }));
//   // const contentStyle = {
//   //   // lineHeight: "260px",
//   //   textAlign: "center",
//   //   color: token.colorTextTertiary,
//   //   backgroundColor: token.colorFillAlter,
//   //   borderRadius: token.borderRadiusLG,
//   //   border: `1px dashed ${token.colorBorder}`,
//   //   marginTop: 16,
//   // };
//   const success = () => {
//     setMontessoriTeachers(false);
//     setCurrent(0);
//     messageApi.open({
//       type: "success",
//       content: "This is a success message",
//     });
//   };

//   return (
//     <div>
//       <div className="z-50 fixed top-50">{contextHolder}</div>
//       <PageMeta
//         title=" Dashboard Form Elements Dashboard |  "
//         description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Admission" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6 ">
//           <ComponentCard title="Admission">
//             {/* form body  */}

//             <div
//               onClick={
//                 montessoriTeachers ? handleTeacherShow : handleTeacherClose
//               }
//               className="cursor-pointer text-gray-500 hover:text-gray-500 dark:text-gray-300  flex items-center justify-center"
//             >
//               {montessoriTeachers ? (
//                 <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
//                   <Minus className="text-red-500" size={50} />
//                   <div className="text-2xl"> Student Admission</div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
//                   <Plus size={50} />
//                   <div className="text-2xl"> Student Admission</div>
//                 </div>
//               )}
//             </div>
//             {montessoriTeachers && (
//               <div>
//                 {/* <div className="p-7 pl-30 pr-30  flex items-center sticky top-20 bg-gray-100  dark:bg-gray-800 dark:text-gray-100   text-gray-800  z-20 justify-center">
//                   <Steps
//                     style={{ fontSize: "20px", width: "" }}
//                     current={current}
//                     items={items}
//                   />
//                 </div> */}

//                 {/* <div style={{ ...contentStyle }}> */}
//                 <div>

//                   <div className="max-w-4xl mx-auto p-6 bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                     {/* Header Section */}

//                     <form
//                       onSubmit={handleSubmit}
//                       className="space-y-6 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
//                     >
//                       {/* Serial No and Date */}
//                       {current === 0 && (
//                         <div>
//                           <div className="w-12/12 pr-20 pl-20 mb-4">
//                             <label className="block text-lg font-bold dark:text-gray-400 text-gray-700 mb-1">
//                               Choose your Courses
//                             </label>
//                             <select
//                               name="category"
//                               value={formData.category}
//                               onChange={handleInputChange}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                               <option value="">Select</option>
//                               <option value="teacher-training">
//                                 Teacher Training
//                               </option>
//                               <option value="nursing-training">
//                                 Nursing Training
//                               </option>
//                               <option value="lab-technicion-training">
//                                 Lab Technicion Training
//                               </option>
//                               <option value="ECG-technicion-training">
//                                 ECG Technicion Training
//                               </option>
//                               <option value="physiotherapy-training">
//                                 Physiotherapy Training
//                               </option>
//                               <option value="OT-technicion-training">
//                                 OT Technicion Training
//                               </option>
//                               <option value="X-Ray-&-imaging-technology">
//                                 X-Ray & Imaging Technology
//                               </option>
//                               <option value="CMS-&-ED-training">
//                                 CMS & ED Training
//                               </option>
//                             </select>
//                           </div>

//                           {/* Personal Details */}
//                           <div className=" border-gray-300 p-4">
//                             <h2 className="text-lg font-semibold mb-4 bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                               Personal Details
//                             </h2>

//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="grid grid-cols-3 gap-4">
//                                 <div></div>
//                                 <div></div>
//                                 <div className="ml-4 flex  justify-center">
//                                   <div className="w-32 h-40 border-2 border-gray-400 flex flex-col items-center justify-center bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                                     {photo ? (
//                                       <div className="relative w-full h-full">
//                                         <img
//                                           src={photo}
//                                           alt="Candidate"
//                                           className="w-full h-full object-cover"
//                                         />
//                                         <button
//                                           onClick={() => removeFile("photo")}
//                                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                                         >
//                                           <X size={12} />
//                                         </button>
//                                       </div>
//                                     ) : (
//                                       <div className="text-center">
//                                         <Upload
//                                           size={24}
//                                           className="mx-auto mb-2 text-gray-400"
//                                         />
//                                         <p className="text-xs text-gray-500">
//                                           Paste Your Photo
//                                         </p>
//                                         <label className="cursor-pointer">
//                                           <input
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) =>
//                                               handleFileUpload(e, "photo")
//                                             }
//                                             className="hidden"
//                                           />
//                                           <span className="text-xs text-blue-500 hover:text-blue-700">
//                                             Upload
//                                           </span>
//                                         </label>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Candidate's Name
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="candidateName"
//                                     value={formData.candidateName}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Father's Name
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="fatherName"
//                                     value={formData.fatherName}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Mother's Name
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="motherName"
//                                     value={formData.motherName}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Guardian's Name
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="guardianName"
//                                     value={formData.guardianName}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Address
//                                   </label>
//                                   <textarea
//                                     name="address"
//                                     value={formData.address}
//                                     onChange={handleInputChange}
//                                     rows="3"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Phone
//                                   </label>
//                                   <input
//                                     type="tel"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Mobile
//                                   </label>
//                                   <input
//                                     type="tel"
//                                     name="mobile"
//                                     value={formData.mobile}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-3 gap-4">
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Sex
//                                   </label>
//                                   <select
//                                     name="sex"
//                                     value={formData.sex}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   >
//                                     <option value="">Select</option>
//                                     <option value="M">Male</option>
//                                     <option value="F">Female</option>
//                                   </select>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Date of Birth
//                                   </label>
//                                   <input
//                                     type="date"
//                                     name="dateOfBirth"
//                                     value={formData.dateOfBirth}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Blood Group
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="bloodGroup"
//                                     value={formData.bloodGroup}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-3 gap-4">
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Category
//                                   </label>
//                                   <select
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   >
//                                     <option value="">Select</option>
//                                     <option value="General">General</option>
//                                     <option value="SC">SC</option>
//                                     <option value="ST">ST</option>
//                                     <option value="OBC">OBC</option>
//                                   </select>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Person with Disability
//                                   </label>
//                                   <select
//                                     name="disability"
//                                     value={formData.disability}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   >
//                                     <option value="">Select</option>
//                                     <option value="Yes">Yes</option>
//                                     <option value="No">No</option>
//                                   </select>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                     Monthly Income (in Rupees)
//                                   </label>
//                                   <input
//                                     type="number"
//                                     name="monthlyIncome"
//                                     value={formData.monthlyIncome}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div>
//                                 <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                   Languages Known
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="languages"
//                                   value={formData.languages}
//                                   onChange={handleInputChange}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           {/* Education Qualification */}
//                           <div className="border-2 border-gray-300 p-4">
//                             <h2 className="text-lg font-semibold mb-4 bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                               Education Qualification
//                             </h2>

//                             <div className="overflow-x-auto">
//                               <table className="w-full border-collapse border border-gray-300">
//                                 <thead>
//                                   <tr className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                                     <th className="border border-gray-300 p-2 text-left">
//                                       Name of Examination
//                                     </th>
//                                     <th className="border border-gray-300 p-2 text-left">
//                                       Subjects
//                                     </th>
//                                     <th className="border border-gray-300 p-2 text-left">
//                                       Board/University
//                                     </th>
//                                     <th className="border border-gray-300 p-2 text-left">
//                                       Year of Passing
//                                     </th>
//                                     <th className="border border-gray-300 p-2 text-left">
//                                       % of Marks
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {Object.entries(formData.education).map(
//                                     ([level, data]) => (
//                                       <tr key={level}>
//                                         <td className="border border-gray-300 p-2 font-start">
//                                           {level === "madhyamik"
//                                             ? "Madhyamik"
//                                             : level === "hsH2"
//                                             ? "H.S/H-2"
//                                             : level === "degree"
//                                             ? "Degree"
//                                             : level === "pg"
//                                             ? "PG"
//                                             : "Others (Specify)"}
//                                         </td>
//                                         <td className="border border-gray-300 p-2">
//                                           <input
//                                             type="text"
//                                             value={data.subjects}
//                                             onChange={(e) =>
//                                               handleEducationChange(
//                                                 level,
//                                                 "subjects",
//                                                 e.target.value
//                                               )
//                                             }
//                                             className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                           />
//                                         </td>
//                                         <td className="border border-gray-300 p-2">
//                                           <input
//                                             type="text"
//                                             value={data.board}
//                                             onChange={(e) =>
//                                               handleEducationChange(
//                                                 level,
//                                                 "board",
//                                                 e.target.value
//                                               )
//                                             }
//                                             className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                           />
//                                         </td>
//                                         <td className="border border-gray-300 p-2">
//                                           <input
//                                             type="text"
//                                             value={data.year}
//                                             onChange={(e) =>
//                                               handleEducationChange(
//                                                 level,
//                                                 "year",
//                                                 e.target.value
//                                               )
//                                             }
//                                             className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                           />
//                                         </td>
//                                         <td className="border border-gray-300 p-2">
//                                           <input
//                                             type="text"
//                                             value={data.marks}
//                                             onChange={(e) =>
//                                               handleEducationChange(
//                                                 level,
//                                                 "marks",
//                                                 e.target.value
//                                               )
//                                             }
//                                             className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                           />
//                                         </td>
//                                       </tr>
//                                     )
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>

//                           {/* Declaration and Signature */}
//                           <div className="border-2 border-gray-300 p-4 text-center">
//                             <h2 className="text-lg font-semibold mb-4 bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
//                               Declaration
//                             </h2>
//                             <p className="text-sm dark:text-gray-400 text-gray-700 mb-4">
//                               I hereby declare that the information provided by
//                               me is true and subject to verification by G.T.I. I
//                               hereby acknowledge that I have read and understood
//                               the rules and regulations, fee structure, syllabus
//                               decided by G.T.I. And I agree to abide by the
//                               same.
//                             </p>

//                             <div className="grid grid-cols-2 gap-8">
//                               <div>
//                                 <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                   Place
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                   Name
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-8">
//                               <div className="mt-4">
//                                 <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-1">
//                                   Date
//                                 </label>
//                                 <input
//                                   type="date"
//                                   className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Office Use Only */}

//                       {/* Submit Button */}
//                       {/* <div className="text-center">
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Submit Application
//               </button>
//                </div> */}
//                       {current === 1 && (
//                         <div className="max-w-4xl mx-auto p-6  min-h-screen">
//                           <div className="space-y-6">
//                             {/* Header - Placeholder for logo */}

//                             {/* Documents Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 p-6 rounded-lg ">
//                               <h2 className="text-lg font-semibold mb-4">
//                                 Documents to be enclosed with the application
//                               </h2>

//                               <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Self attested copies of last result
//                                   </label>
//                                   <input
//                                     type="file"
//                                     name="selfAttestedLastResult"
//                                     onChange={handleFileChange}
//                                     multiple
//                                     accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                   />
//                                   {formData.selfAttestedLastResult.length >
//                                     0 && (
//                                     <div className="mt-2 space-y-1">
//                                       {formData.selfAttestedLastResult.map(
//                                         (file:any, index:number) => (
//                                           <div
//                                             key={index}
//                                             className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
//                                           >
//                                             <span className="truncate">
//                                               {file.name}
//                                             </span>
//                                             <button
//                                               type="button"
//                                               onClick={() =>
//                                                 removeFile2(
//                                                   "selfAttestedLastResult",
//                                                   index
//                                                 )
//                                               }
//                                               className="text-red-500 hover:text-red-700 ml-2"
//                                             >
//                                               ×
//                                             </button>
//                                           </div>
//                                         )
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Self Attested copies of Age Proof
//                                   </label>
//                                   <input
//                                     type="file"
//                                     name="ageProofAdmitCard"
//                                     onChange={handleFileChange}
//                                     multiple
//                                     accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                   />
//                                   {formData.ageProofAdmitCard.length > 0 && (
//                                     <div className="mt-2 space-y-1">
//                                       {formData.ageProofAdmitCard.map(
//                                         (file : any, index  : number) => (
//                                           <div
//                                             key={index}
//                                             className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
//                                           >
//                                             <span className="truncate">
//                                               {file.name}
//                                             </span>
//                                             <button
//                                               type="button"
//                                               onClick={() =>
//                                                 removeFile2(
//                                                   "ageProofAdmitCard",
//                                                   index
//                                                 )
//                                               }
//                                               className="text-red-500 hover:text-red-700 ml-2"
//                                             >
//                                               ×
//                                             </button>
//                                           </div>
//                                         )
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Address Proof
//                                   </label>
//                                   <input
//                                     type="file"
//                                     name="addressProof"
//                                     onChange={handleFileChange}
//                                     multiple
//                                     accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                   />
//                                   {formData.addressProof.length > 0 && (
//                                     <div className="mt-2 space-y-1">
//                                       {formData.addressProof.map(
//                                         (file : any, index : number) => (
//                                           <div
//                                             key={index}
//                                             className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
//                                           >
//                                             <span className="truncate">
//                                               {file.name}
//                                             </span>
//                                             <button
//                                               type="button"
//                                               onClick={() =>
//                                                 removeFile2(
//                                                   "addressProof",
//                                                   index
//                                                 )
//                                               }
//                                               className="text-red-500 hover:text-red-700 ml-2"
//                                             >
//                                               ×
//                                             </button>
//                                           </div>
//                                         )
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Declaration Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 p-6 rounded-lg shadow-sm">
//                               <h2 className="text-lg font-semibold mb-4">
//                                 Declaration
//                               </h2>

//                               <div className="text-sm dark:text-gray-400 text-gray-700 mb-4 leading-relaxed">
//                                 I hereby declare that all the particulars stated
//                                 in this application form are true to the best of
//                                 my knowledge and belief. In the event of
//                                 admission by incorrect or wrong information or
//                                 any fact like educational qualification, marks,
//                                 category, etc. That I will be liable for the
//                                 cancellation of admission by them. Also agree to
//                                 abide by all the Rules & Regulation of the
//                                 Institute. I further understand that admission
//                                 fees once paid can not be refunded. I clearly
//                                 understand that false structure of the course
//                                 may be changed at any time according to
//                                 circulation from Council/University/Institute
//                                 College. I also understand that my Admission is
//                                 purely provisional subject to that verification
//                                 of the eligibility condition as per prescribed
//                                 by the board. I acknowledge that the Institute
//                                 has full right to add/delete/change the class
//                                 schedule, Fee structure, Rule and Regulation as
//                                 and when required. All legal cause concerning
//                                 GLOBAL TECHNICAL INSTITUTE shall lie within
//                                 jurisdiction at Beleghata, Phool Bagan, Kolkata.
//                               </div>

//                               <div className="flex items-center space-x-2">
//                                 <input
//                                   type="checkbox"
//                                   name="declarationAccepted"
//                                   checked={formData.declarationAccepted}
//                                   onChange={handleInputChange}
//                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 />
//                                 <label className="text-sm dark:text-gray-400 text-gray-700">
//                                   I accept the above declaration
//                                 </label>
//                               </div>
//                             </div>

//                             {/* Signature Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 p-6 rounded-lg shadow-sm">
//                               <h2 className="text-lg font-semibold mb-4">
//                                 Signatures
//                               </h2>

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Signature of Applicant
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="applicantSignature"
//                                     value={formData.applicantSignature}
//                                     onChange={handleInputChange}
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Applicant's signature"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Signature of Parent/Guardian
//                                   </label>
//                                   <input
//                                     type="text"
//                                     name="guardianSignature"
//                                     value={formData.guardianSignature}
//                                     onChange={handleInputChange}
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Parent/Guardian's signature"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     name="applicantDate"
//                                     value={formData.applicantDate}
//                                     onChange={handleInputChange}
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                                     Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     name="guardianDate"
//                                     value={formData.guardianDate}
//                                     onChange={handleInputChange}
//                                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                   />
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Office Use Only Section */}
//                             {/* <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-800">
//                       For Office Use Only
//                     </h2>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                           Admit Rejected with reason
//                         </label>
//                         <input
//                           type="text"
//                           name="admitRejectedReason"
//                           value={formData.admitRejectedReason}
//                           onChange={handleInputChange}
//                           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="Enter reason if rejected"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                           Admission No.
//                         </label>
//                         <input
//                           type="text"
//                           name="admissionNo"
//                           value={formData.admissionNo}
//                           onChange={handleInputChange}
//                           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="Enter admission number"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                           Remarks
//                         </label>
//                         <textarea
//                           name="remarks"
//                           value={formData.remarks}
//                           onChange={handleInputChange}
//                           rows="3"
//                           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="Enter any remarks"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                         <div>
//                           <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                             Name of Authority
//                           </label>
//                           <input
//                             type="text"
//                             name="authoritySignature"
//                             value={formData.authoritySignature}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Authority signature"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                             Name of Principal
//                           </label>
//                           <input
//                             type="text"
//                             name="principalSignature"
//                             value={formData.principalSignature}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Principal signature"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                             Date
//                           </label>
//                           <input
//                             type="date"
//                             name="authorityDate"
//                             value={formData.authorityDate}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-start dark:text-gray-400 text-gray-700 mb-2">
//                             Date
//                           </label>
//                           <input
//                             type="date"
//                             name="principalDate"
//                             value={formData.principalDate}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}

//                             {/* Submit Button */}
//                             {/* <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-start py-3 px-8 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                     >
//                       Submit Application
//                     </button>
//                   </div> */}
//                           </div>
//                         </div>
//                       )}

//                       {current === 2 && (
//                         <div className="max-w-4xl mx-auto p-6 bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 min-h-screen">
//                           <div className="space-y-8">
//                             {/* Header */}
//                             <div className="text-center">
//                               <h1 className="text-3xl font-bold text-gray-800 underline mb-8">
//                                 DECLARATION
//                               </h1>
//                             </div>

//                             {/* First Declaration Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 p-6 rounded-lg">
//                               <h2 className="text-lg font-semibold mb-4 text-gray-800">
//                                 First Declaration - Admission Fee
//                               </h2>

//                               <div className="space-y-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Title
//                                     </label>
//                                     <select
//                                       name="applicantTitle1"
//                                       value={formData.applicantTitle1}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                       <option value="">Select</option>
//                                       <option value="Sri">Sri</option>
//                                       <option value="Smt">Smt</option>
//                                       <option value="Miss">Miss</option>
//                                     </select>
//                                   </div>

//                                   <div className="md:col-span-3">
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Full Name
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="applicantName1"
//                                       value={formData.applicantName1}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Enter full name"
//                                     />
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Relationship Type
//                                     </label>
//                                     <select
//                                       name="relationshipType1"
//                                       value={formData.relationshipType1}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                       <option value="">Select</option>
//                                       <option value="S/o">S/o (Son of)</option>
//                                       <option value="D/o">
//                                         D/o (Daughter of)
//                                       </option>
//                                       <option value="W/o">W/o (Wife of)</option>
//                                     </select>
//                                   </div>

//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Father's/Husband's Name
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="relationName1"
//                                       value={formData.relationName1}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Enter name"
//                                     />
//                                   </div>
//                                 </div>

//                                 <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 p-4 rounded-md">
//                                   <p className="text-sm dark:text-gray-400 text-gray-700 mb-4">
//                                     <strong>Declaration:</strong> I hereby
//                                     declare that I will have to pay a sum of Rs.
//                                     <input
//                                       type="number"
//                                       name="admissionFeeAmount"
//                                       value={formData.admissionFeeAmount}
//                                       onChange={handleInputChange}
//                                       className="mx-2 w-20 p-1 border border-gray-300 rounded text-center"
//                                     />
//                                     /- (Rupees{" "}
//                                     <span className="test-lg font-bold">
//                                       {toWords.convert(
//                                         formData.admissionFeeAmount
//                                       )}{" "}
//                                     </span>
//                                     ) only towards Admission Fee for Montessori
//                                     Teachers' Training course (6 Months) of
//                                   </p>

//                                   <p className="text-sm dark:text-gray-400 text-gray-700 mt-2">
//                                     within 3 (three) months from the date of
//                                     getting Admission in the aforesaid Course.
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Second Declaration Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 p-6 rounded-lg">
//                               <h2 className="text-lg font-semibold mb-4 text-gray-800">
//                                 Second Declaration - BSS Registration Fee
//                               </h2>

//                               <div className="space-y-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Title
//                                     </label>
//                                     <select
//                                       name="applicantTitle2"
//                                       value={formData.applicantTitle2}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                       <option value="">Select</option>
//                                       <option value="Sri">Sri</option>
//                                       <option value="Smt">Smt</option>
//                                       <option value="Miss">Miss</option>
//                                     </select>
//                                   </div>

//                                   <div className="md:col-span-3">
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Full Name
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="applicantName2"
//                                       value={formData.applicantName2}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Enter full name"
//                                     />
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Relationship Type
//                                     </label>
//                                     <select
//                                       name="relationshipType2"
//                                       value={formData.relationshipType2}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                       <option value="">Select</option>
//                                       <option value="S/o">S/o (Son of)</option>
//                                       <option value="D/o">
//                                         D/o (Daughter of)
//                                       </option>
//                                       <option value="W/o">W/o (Wife of)</option>
//                                     </select>
//                                   </div>

//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Father's/Husband's Name
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="relationName2"
//                                       value={formData.relationName2}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Enter name"
//                                     />
//                                   </div>
//                                 </div>

//                                 <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 p-4 rounded-md">
//                                   <p className="text-sm dark:text-gray-400 text-gray-700">
//                                     <strong>Declaration:</strong> I hereby
//                                     declare that I will also have to pay a sum
//                                     of Rs.
//                                     <input
//                                       type="number"
//                                       name="bssRegistrationFee"
//                                       value={formData.bssRegistrationFee}
//                                       onChange={handleInputChange}
//                                       className="mx-2 w-20 p-1 border border-gray-300 rounded text-center"
//                                     />
//                                     /- (Rupees{" "}
//                                     <span className="test-lg font-bold">
//                                       {toWords.convert(
//                                         formData.admissionFeeAmount
//                                       )}{" "}
//                                     </span>
//                                     ) only towards BSS Registration Fee within 3
//                                     (Three) months after 6 (Six) months of
//                                     getting Admission for Montessori Teachers'
//                                     Training Course.
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Signature Section */}
//                             <div className="bg-gray-100  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 p-6 rounded-lg border-2 border-gray-200">
//                               <h2 className="text-lg font-semibold mb-6 text-gray-800">
//                                 Signatures
//                               </h2>

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 <div className="space-y-4">
//                                   <div className="border-b-2 border-dashed border-gray-300 pb-4">
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Signature of Parent/Guardian
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="parentGuardianSignature"
//                                       value={formData.parentGuardianSignature}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Parent/Guardian signature"
//                                     />
//                                   </div>

//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Date
//                                     </label>
//                                     <input
//                                       type="date"
//                                       name="parentGuardianDate"
//                                       value={formData.parentGuardianDate}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                   </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                   <div className="border-b-2 border-dashed border-gray-300 pb-4">
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Signature of the Applicant/Candidate
//                                     </label>
//                                     <input
//                                       type="text"
//                                       name="applicantSignature"
//                                       value={formData.applicantSignature}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                       placeholder="Applicant signature"
//                                     />
//                                   </div>

//                                   <div>
//                                     <label className="block text-sm font-medium text-start dark:text-gray-400 text-gray-700 mb-2">
//                                       Date
//                                     </label>
//                                     <input
//                                       type="date"
//                                       name="applicantDate"
//                                       value={formData.applicantDate}
//                                       onChange={handleInputChange}
//                                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Submit Button */}
//                             {/* <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-start py-3 px-8 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                     >
//                       Submit Declaration
//                     </button>
//                   </div> */}
//                           </div>
//                         </div>
//                       )}
//                     </form>
//                   </div>
//                 </div>

//                 <div className="mt-[20px] mb-[20px] flex justify-center">
//                   {current > 0 && (
//                     <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
//                       Previous
//                     </Button>
//                   )}
//                   {current === steps.length - 1 && (
//                     <Button type="primary" onClick={success}>
//                       Submit
//                     </Button>
//                   )}
//                   {current < steps.length - 1 && (
//                     <Button type="primary" onClick={() => next()}>
//                       Next
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             )}
//             <div className="flex flex-col gap-6">
//               <h3 className="text-gray-500 dark:text-gray-400 ">
//                 Admission List
//               </h3>
//             </div>
//             {/* <BasicTableCourses /> */}
//           </ComponentCard>
//         </div>
//       </div>
//     </div>
//   );
// }
