// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import { useState } from "react";
// import PageMeta from "../../../components/common/PageMeta";
// import ComponentCard from "../../../components/common/ComponentCard";

// import BasicTableNotice from "../../../components/tables/studentTable/BasicTableNotice";

// export default function FormElementsStudent() {
//   const [message, setMessage] = useState("");
//   const [title, setTitle] = useState("");
//   const [selectedValues, setSelectedValues] = useState<string[]>([]);
//   const [selectedValue, setSelectedValue] = useState<string>("option1");
//   const [dropdownOpen, setDropdownOpen] = useState("");

//   const submit = (e: React.MouseEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setSelectedValue("option1");
//     setTitle("");
//     setMessage("");
//     setSelectedValues([]);
//     setDropdownOpen("");
//       selectedValues,
//       title,
//       message,
//       selectedValue,
//     });
//   };
//   return (
//     <div>
//       <PageMeta
//         title=" Dashboard Form Elements Dashboard |  "
//         description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Notice / Message" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6 ">
//           <ComponentCard title="Notice / Message List">

//             <BasicTableNotice />
//           </ComponentCard>
//         </div>
//       </div>
//     </div>
//   );
// }
