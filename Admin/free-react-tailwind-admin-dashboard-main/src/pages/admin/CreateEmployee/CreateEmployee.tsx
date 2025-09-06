import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Upload, X } from "lucide-react";
import BasicTableCreateEmployee from "../../../components/tables/BasicTables/BasicTableCreateEmoloyee";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import {
  getFetcher,
  postFetcher,
  putFetcher,
  uploadUrl,
} from "../../../api/fatcher";
import { uploadFiles } from "../../../utils/uploadFile";
import useSWR, { mutate } from "swr";
import MultiSelect from "../../../components/form/MultiSelect";
import { MultiSelectOption } from "../../../types";

const options: MultiSelectOption[] = [
  {
    name: "Dashboard",
    id: 1,
  },
  {
    name: "Manage Holidays",
    id: 2,
  },
  {
    name: "Leave Apply",
    id: 3,
  },
  {
    name: "Manage Leave",
    id: 4,
  },
  {
    name: "Courses",
    id: 5,
  },
  {
    name: "Admission",
    id: 6,
  },
  {
    name: "Create Employee",
    id: 7,
  },
  {
    name: "Inventory Manage",
    id: 8,
  },
  {
    name: "Purchase Record",
    id: 9,
  },
  {
    name: "Maintenance Record",
    id: 10,
  },
  {
    name: "Staff Attendance",
    id: 11,
  },
];

export default function CreateEmployee() {
  interface FormData {
    id?: number;
    image: string;
    name: string;
    joining_date: string;
    designation: string;
    email: string;
    ph_no: string;
    password: string;
    category: string;
    fee_structure_teacher: {
      course_id: string;
      type: string;
      class_per_month: string;
      amount: string;
      workshop: string;
      extra: string;
    }[];
    fee_structure_stuff: {
      fee_head: string;
      amount: string;
      amount_type: string;
    }[];
    permissions: string[]; // proper type
    description: string;
  }
  const [messageApi, contextHolder] = message.useMessage();
  const [photo, setPhoto] = useState<string | null>(null);
  const [id, setId] = useState<number>();
  const [showPassword, setShowPassword] = useState(false);
  const [teacher, setTeacher] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const [formData, setFormData] = useState({
    // id: 0,
    image: "",
    name: "",
    joining_date: "",
    designation: "",
    email: "",
    ph_no: "",
    password: "",
    category: "",
    permissions: [],
    fee_structure_teacher: [],
    fee_structure_stuff: [],
    description: "",
  } as FormData);

  // create employee
  const { trigger: create } = useSWRMutation(
    "api/v1/users/create",
    (url, { arg }) => postFetcher(url, arg)
  );

  // edit employee
  const { trigger: update } = useSWRMutation("api/v1/users", (url, { arg }) =>
    putFetcher(url, arg)
  );

  // get course list
  const { data: courseList, isLoading: courseLoading } = useSWR(
    "api/v1/course",
    getFetcher
  );

  // get stuff list
  const {
    data: stufflist,
    isLoading: stuffLoading,
    error: stuffError,
  } = useSWR(`api/v1/users?page=${pageCount}`, getFetcher);
  if (courseLoading) {
    return <div>Loading ...</div>;
  }
  if (stuffLoading) {
    return <div>Loading...</div>;
  }
  if (stuffError) {
    return <div>Error...</div>;
  }
  const handleChildData = (data: any) => {
    setPageCount(data);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeCatagort = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTeacher(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleNameChange = (selected: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      permissions: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await create(formData as any);
      mutate(
        (currentData: any) => [...(currentData || []), response.data],
        false
      );
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setPhoto(null);
      setFormData({
        image: "",
        name: "",
        joining_date: "",
        designation: "",
        email: "",
        ph_no: "",
        password: "",
        category: "",
        permissions: [],
        fee_structure_teacher: [],
        fee_structure_stuff: [],
        description: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " Try Again",
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (type === "photo") {
          setPhoto(result);
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
            image: result[0].downloadUrl,
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

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      jumpToTop();
      const response = await getFetcher(`api/v1/users/${id}`);
      const userData = response.data;

      setPhoto(userData?.image);
      setTeacher(userData?.category);
      setFormData({
        id: id,
        image: userData?.image,
        name: userData?.name,
        joining_date: userData?.joining_date,
        designation: userData?.designation,
        email: userData?.email,
        ph_no: userData?.ph_no,
        password: userData?.password,
        category: userData?.category,
        permissions: userData?.permissions,
        fee_structure_teacher: Array.isArray(userData?.fee_structure_teacher)
          ? userData.fee_structure_teacher.map((item: any) => ({
              course_id: item.course_id || "",
              type: item.type || "",
              class_per_month: item.class_per_month || "",
              amount: item.amount || "",
              workshop: item.workshop || "",
              extra: item.extra || "",
            }))
          : [
              { course_id: "", amount: "", workshop: "", extra: "" },
              { course_id: "", amount: "", workshop: "", extra: "" },
            ],
        fee_structure_stuff: Array.isArray(userData?.fee_structure_stuff)
          ? userData.fee_structure_stuff.map((item: any) => ({
              fee_head: item.fee_head || "",
              amount: item.amount || "",
              amount_type: item.amount_type || "",
            }))
          : [
              { fee_head: "", amount: "", amount_type: "" },
              { fee_head: "", amount: "", amount_type: "" },
            ],
        description: userData?.description,
      });
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/users");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setPhoto(null);
      setFormData({
        image: "",
        name: "",
        joining_date: "",
        designation: "",
        email: "",
        ph_no: "",
        password: "",
        category: "",
        permissions: [],
        fee_structure_teacher: [],
        fee_structure_stuff: [],
        description: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleAdd = () => {
    setFormData((prev: any) => ({
      ...prev,
      fee_structure_teacher: [
        ...prev.fee_structure_teacher,
        { course_id: "", amount: "" },
      ],
    }));
  };

  const handleRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure_teacher: prev.fee_structure_teacher.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleChangeEntries = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure_teacher: prev.fee_structure_teacher.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // stuff
  const handleAddStuff = () => {
    setFormData((prev: any) => ({
      ...prev,
      fee_structure_stuff: [
        ...prev.fee_structure_stuff,
        { fee_head: "", amount: "", amount_type: "" },
      ],
    }));
  };

  const handleRemoveStuff = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure_stuff: prev.fee_structure_stuff.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleChangeEntriesStuff = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure_stuff: prev.fee_structure_stuff.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };
  const jumpToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  console.log(formData?.permissions);

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Cteate Employee" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Employee">
            <div className="space-y-6">
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div className="ml-4 flex  justify-center">
                  <div className="w-32 h-40 border-2 border-gray-400 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
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
                            name="file"
                            // value={formData.image}
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
                  <Label htmlFor="inputTwo">Employee Name</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Employee Name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Joining Date</Label>
                    <Input
                      type="date"
                      id="inputTwo"
                      name="joining_date"
                      onChange={handleChange}
                      value={formData.joining_date}
                      placeholder="Joining Date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inputTwo">Designation</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="designation"
                      onChange={handleChange}
                      value={formData.designation}
                      placeholder="Designation"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Email</Label>
                    <Input
                      type="email"
                      id="inputTwo"
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <Label>PH No</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="ph_no"
                      onChange={handleChange}
                      value={formData.ph_no}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label>Password</Label>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[85%_15%]">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="inputTwo"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="Password"
                      />
                      <span
                        onClick={togglePassword}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          color: "#888",
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="inputTwo"
                      name="category"
                      onChange={(e) => handleChangeCatagort(e)}
                      value={formData.category}
                      className="w-full px-3 py-3 border bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Stuff">Staff</option>
                    </select>
                  </div>
                </div>

                {teacher == "Teacher" ? (
                  <div>
                    <div className="flex justify-between ">
                      <h2 className="w-auto px-3 py-3   text-3xl   dark:hover:border-gray-800        dark:text-gray-300 text-gray-700">
                        Teacher Payment Structure
                      </h2>
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        + Add More
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                      {formData?.fee_structure_teacher?.map((entry, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div>
                            <Label>Choose Course</Label>
                            <select
                              value={entry.course_id}
                              onChange={(e) =>
                                handleChangeEntries(
                                  index,
                                  "course_id",
                                  e.target.value
                                )
                              }
                              className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                            >
                              <option value="">Choose</option>
                              {courseList?.data?.map((opt: any, i: number) => (
                                <option key={i} value={opt.id}>
                                  {opt.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label>Class/month</Label>
                            <Input
                              type="number"
                              placeholder="Class/month"
                              value={entry.class_per_month}
                              onChange={(e) =>
                                handleChangeEntries(
                                  index,
                                  "class_per_month",
                                  e.target.value
                                )
                              }
                              className="flex-1 border px-3 py-1 rounded-md"
                            />
                          </div>
                          <div>
                            <Label>choose Type</Label>
                            <select
                              value={entry?.type as any}
                              onChange={(e: any) =>
                                handleChangeEntries(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                            >
                              <option value="">Choose</option>
                              <option value="fixed">Fixed</option>
                              <option value="per_class">Per Class</option>
                            </select>
                          </div>

                          <div>
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              placeholder="Fees"
                              value={entry.amount}
                              onChange={(e) =>
                                handleChangeEntries(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="flex-1 border px-3 py-1 rounded-md"
                            />
                          </div>
                          <div>
                            <Label>Workshop Amount</Label>
                            <Input
                              type="number"
                              placeholder="workshop"
                              value={entry.workshop}
                              onChange={(e) =>
                                handleChangeEntries(
                                  index,
                                  "workshop",
                                  e.target.value
                                )
                              }
                              className="flex-1 border px-3 py-1 rounded-md"
                            />
                          </div>
                          <div>
                            <Label>Extra Amount</Label>
                            <Input
                              type="number"
                              placeholder="Extra Amount"
                              value={entry.extra}
                              onChange={(e) =>
                                handleChangeEntries(
                                  index,
                                  "extra",
                                  e.target.value
                                )
                              }
                              className="flex-1 border px-3 py-1 rounded-md"
                            />
                          </div>

                          {formData.fee_structure_teacher.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="text-red-600 font-bold text-xl"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {teacher == "Stuff" ? (
                  <div>
                    <div className="flex justify-between ">
                      <h2 className="w-auto px-3 py-3   text-3xl   dark:hover:border-gray-800        dark:text-gray-300 text-gray-700">
                        Stuff Payment Structure
                      </h2>
                      <button
                        type="button"
                        onClick={handleAddStuff}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        + Add More
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                      <div className="flex gap-30 text-gray-400 w-[50%]">
                        <div>Salary Head</div>
                         <div>Amount</div>
                          <div>Amount Type</div>
                      </div>
                      {formData?.fee_structure_stuff?.map((entry, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div>
                            {/* <Label htmlFor="inputTwo">Salary Head</Label> */}
                            <select
                              value={entry.fee_head}
                              onChange={(e) =>
                                handleChangeEntriesStuff(
                                  index,
                                  "fee_head",
                                  e.target.value
                                )
                              }
                              className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                            >
                              <option value="">Choose</option>
                              <option value="base_salary">Basic Salary</option>
                              <option value="HRA">HRA</option>
                              <option value="MEDICAL">MEDICAL</option>
                              <option value="P_tax">P Tax</option>
                            </select>
                          </div>
                          <div>
                            {/* <Label htmlFor="inputTwo">Amount</Label> */}
                            <Input
                              type="number"
                              placeholder="Fees"
                              value={entry.amount}
                              onChange={(e) =>
                                handleChangeEntriesStuff(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="flex-1 border px-3 py-1 rounded-md"
                            />
                          </div>
                          <div>
                            {/* <Label htmlFor="inputTwo">Amount Type</Label> */}
                            <select
                              value={entry.amount_type}
                              onChange={(e) =>
                                handleChangeEntriesStuff(
                                  index,
                                  "amount_type",
                                  e.target.value
                                )
                              }
                              className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                            >
                              <option value="">Choose</option>
                              <option value="addition">Addition</option>
                              <option value="deduction">Deduction</option>
                            </select>
                          </div>

                          {formData.fee_structure_stuff.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStuff(index)}
                              className="text-red-600 font-bold text-xl"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div>
                  <MultiSelect
                    label="Permissions"
                    options={options}
                    onChange={(selected) => handleNameChange(selected)}
                    // defaultSelected={}
                    defaultSelected={formData?.permissions}
                    // className="w-full h-auto px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={4}
                    className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray-400 "
                  />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
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
                </div>
              </form>
            </div>
            <BasicTableCreateEmployee
              stufflist={stufflist}
              onEdit={handleEdit}
              onSendData={handleChildData}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
