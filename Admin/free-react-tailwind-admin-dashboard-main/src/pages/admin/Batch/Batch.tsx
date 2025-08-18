import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import BasicTableBatch from "../../../components/tables/BasicTables/BasicTableBatch";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR, { mutate } from "swr";
import MultiSelectName from "../../../components/form/MultiSelectName";

interface Option {
  name: string;
}

const options: Option[] = [
  { name: "JAN" },
  { name: "FEB" },
  { name: "MER" },
  { name: "APR" },
  { name: "MAY" },
  { name: "JUN" },
  { name: "JULY" },
  { name: "AUG" },
  { name: "SEPT" },
  { name: "OCT" },
  { name: "NOV" },
  { name: "DEC" },
];
export default function Batch() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [formData, setFormData] = useState({
    course_id: "",
    session_id: "",
    month_names: [],
  });

  //   get Course list
  const {
    data: courseList,
  
  } = useSWR("api/v1/course?is_active=true", getFetcher);


  //   get session list
  const {
    data: sessionList,
    loading: sessionLoading,
    error: sessionError,
  } = useSWR("api/v1/course/session?limit=-1&is_active=true", getFetcher);
  if (sessionLoading) {
    return <div>Loading ...</div>;
  }

  //   create Batch
  const {
    trigger: create,
  } = useSWRMutation("api/v1/course/batch", (url, { arg }) =>
    postFetcher(url, arg)
  );

  //   get batch list
  const {
    data: batchList,
    isLoading: batchLoading,
    error: batchError,
  } = useSWR("api/v1/course/batch", getFetcher);
  if (sessionLoading) {
    return <div>Loading ...</div>;
  }

  //   get single data
  // const {
  //   data: editData,
  //   loading: editLoading,
  //   error: editError,
  // } = useSWR(`api/v1/course/batch/${id}`, getFetcher);

  //   get updated data
  const {
    trigger: update,
    data: updateData,
    error: updateError,
    isMutating: updateLoading,
  } = useSWRMutation("api/v1/course/batch", (url, { arg }) =>
    putFetcher(url, arg)
  );

 

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

  const handleUpdate = async () => {
    try {
      const response = await update(formData);
      mutate("api/v1/course/batch");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);
      setId(0);
      setFormData({
        course_id: "",
        session_id: "",
        month_names: [],
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
  };

  const handleActive = async (isActive: boolean, id: number) => {
    console.log("isactiveaaaa ", isActive);

    try {
      const response = await update({
        id: id,
        is_active: isActive,
      });

      mutate("api/v1/course/batch");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form", formData);
    try {
      const response = await create(formData);
      //   mutate(
      //     (currentData: any) => [...(currentData || []), response.data],
      //     false
      //   );
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);

      setFormData({
        course_id: "",
        session_id: "",
        month_names: [],
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
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

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Batch" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Batch">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Courses
                    </label>
                    <select
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {courseList?.data?.map((data, index) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Session
                    </label>
                    <select
                      name="session_id"
                      value={formData.session_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {sessionList?.data?.map((data, index) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="inputOne">{"Select Batch Month"}</Label>
                    <MultiSelectName
                      options={options}
                      selectedValues={formData.month_names }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          month_names: selected,
                        }))
                      }
                    />
                  </div>
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
            <BasicTableBatch
              batchList={batchList}
              // onEdit={handleEdit}
              onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
