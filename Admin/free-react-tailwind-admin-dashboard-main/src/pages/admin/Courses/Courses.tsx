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
    session_id: sessionList?.data[0]?.id ? sessionList?.data[0]?.id : "",
    payment_mode: "UPI",
    duration: "",
    price: "",
    description: "",
  });
  console.log("sessionList", sessionList);
  console.log("sessionListdata", sessionList?.data[0]?.id);

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

  // edit course
  const {
    trigger: update,
    data,
    error,
    isMutating,
  } = useSWRMutation("api/v1/course", (url, { arg }) => putFetcher(url, arg));
  console.log("dataUpdate", data);

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
    console.log("form", formData);
    // setFormData({
    //   name: "",
    //   session_id: sessionList?.data[0]?.id,
    //   payment_mode: "UPI",
    //   duration: "",
    //   price: "",
    //   description: "",
    // });

    try {
      const response = await create(formData);

      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", formData);

      setFormData({
        name: "",
        session_id: sessionList?.data[0]?.id,
        payment_mode: "UPI",
        duration: "",
        price: "",
        description: "",
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
        session_id: userData?.session_id,
        payment_mode: userData?.payment_mode,
        duration: userData?.duration,
        price: userData?.price,
        description: userData?.description,
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
        session_id: sessionList?.data[0]?.id ? sessionList?.data[0]?.id : "",
        payment_mode: "UPI",
        duration: "",
        price: "",
        description: "",
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

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="price"
                      onChange={handleChange}
                      value={formData.price}
                      placeholder="Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      id="inputTwo"
                      name="payment_mode"
                      onChange={handleChange}
                      value={formData.payment_mode}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700 "
                    >
                      <option value="Online">Online</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
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
