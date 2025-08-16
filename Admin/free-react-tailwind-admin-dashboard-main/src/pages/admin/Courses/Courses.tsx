import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import BasicTableCourses from "../../../components/tables/BasicTables/BasicTableCourses";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { message } from "antd";

const options = ["Option 1", "Option 2", "Option 3"];

export default function Courses() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>();

  //   get session list
  const {
    data: sessionList,
    loading: sessionLoading,
    error: sessionError,
  } = useSWR("api/v1/course/session?limit=-1&is_active=true", getFetcher);
  if (sessionLoading) {
    return <div>Loading ...</div>;
  }

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    fee_structure: [
      { fee_head_id: "", amount: "", min_amount: "", required: false },
      { fee_head_id: "", amount: "", min_amount: "", required: false },
    ],
    description: "",
  });
  // const [fee_structure, setFormData] = useState<Entry[]>([
  //   { id: 1, fee_head_id: "", amount: "" },
  // ]);

  // const formData = { ...formData, ...fee_structure };

  // create course
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/course", (url, { arg }) => postFetcher(url, arg));

  // get course list
  const {
    data: courseList,
    loading: courseLoading,
    error: courseError,
  } = useSWR("api/v1/course", getFetcher);
  if (courseLoading) {
    return <div>Loading ...</div>;
  }

  //  get fees head
  const {
    data: feehead,
    loading: feeheadLoading,
    error: feeheadError,
  } = useSWR("api/v1/course/fee-head", getFetcher);
  if (feeheadLoading) {
    return <div>Loading ...</div>;
  }
  console.log("feehead", feehead);

  // edit course
  const {
    trigger: update,
    data,
    error,
    isMutating,
  } = useSWRMutation("api/v1/course", (url, { arg }) => putFetcher(url, arg));

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("formcourse", formData);

    try {
      const response = await create(formData);

      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        name: "",
        duration: "",
        description: "",
         fee_structure: [
      { fee_head_id: "", amount: "", min_amount: "", requierd: false },
      { fee_head_id: "", amount: "", min_amount: "", requierd: false },
    ],
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      jumpToTop();

      const response = await getFetcher(`api/v1/course/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        name: userData?.name,
        duration: userData?.duration,
        description: userData?.description,
        fee_structure: Array.isArray(userData?.fee_structure)
          ? userData.fee_structure.map((item) => ({
              fee_head_id: item.fee_head_id || "",
              amount: item.amount || "",
              min_amount: item.min_amount || "",
              required: item.required || "",
            }))
          : [
              { fee_head_id: "", amount: "", min_amount: "", requierd: false },
              { fee_head_id: "", amount: "", min_amount: "", requierd: false },
            ],
      });

      console.log("Edit data loaded:", userData);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData);
      mutate("api/v1/course?limit=-1");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setFormData({
        name: "",
        duration: "",
        description: "",
         fee_structure: [
      { fee_head_id: "", amount: "", min_amount: "", requierd: false },
      { fee_head_id: "", amount: "", min_amount: "", requierd: false },
    ],
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
      console.log("Upload Error:", error);
    }
  };

  const handleActive = async (isActive: boolean, id: number) => {
    console.log("isactiveaaaa ", id);

    try {
      const response = await update({
        id: id,
        is_active: isActive,
      });

      mutate("api/v1/course");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
  };

  const jumpToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAdd = () => {
    setFormData((prev:any) => ({
      ...prev,
      fee_structure: [
        ...prev.fee_structure,
        { id: Date.now(), fee_head_id: "", amount: "" },
      ],
    }));
  };

  const handleRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure: prev.fee_structure.filter((_, i) => i !== index),
    }));
  };

  const handleChangeEntries = (
    index: number,
    field: keyof Entry,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure: prev.fee_structure.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Courses" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Courses">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="inputTwo">Courses Name</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Courses Name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Duration</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="duration"
                      onChange={handleChange}
                      value={formData.duration}
                      placeholder="Duration"
                    />
                  </div>
                </div>
                <div className="flex justify-between ">
                  <h2 className="w-auto px-3 py-3   text-3xl   dark:hover:border-gray-800        dark:text-gray-300 text-gray-700">
                    Add Fees Structure
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
                  {formData?.fee_structure?.map((entry, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <select
                        value={entry.fee_head_id}
                        onChange={(e) =>
                          handleChangeEntries(
                            index,
                            "fee_head_id",
                            e.target.value
                          )
                        }
                        className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                      >
                        <option value="">Choose</option>
                        {feehead?.data?.map((opt, i) => (
                          <option key={i} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>

                      <Input
                        type="number"
                        placeholder="Enter value"
                        value={entry.amount}
                        onChange={(e) =>
                          handleChangeEntries(index, "amount", e.target.value)
                        }
                        className="flex-1 border px-3 py-1 rounded-md"
                      />
                        <Input
                        type="number"
                        placeholder="Enter value"
                        value={entry.min_amount}
                        onChange={(e) =>
                          handleChangeEntries(index, "min_amount", e.target.value)
                        }
                        className="flex-1 border px-3 py-1 rounded-md"
                      />
                      <select
                        value={entry.required}
                        onChange={(e) =>
                          handleChangeEntries(
                            index,
                            "required",
                            e.target.value
                          )
                        }
                        className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                      >
                        <option value="">Choose</option>

                        <option value="true">yes</option>
                        <option value="false">No</option>
                       
                      </select>

                      {formData.fee_structure.length > 1 && (
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
            <BasicTableCourses
              onEdit={handleEdit}
              courseList={courseList}
              onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
