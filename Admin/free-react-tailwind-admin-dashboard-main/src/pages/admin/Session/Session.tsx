import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import BasicTableSession from "../../../components/tables/BasicTables/BasicTableSession";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR, { mutate } from "swr";

export default function Session() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
  });

  //   create Seaaion
  const { trigger: create } = useSWRMutation(
    "api/v1/course/session",
    (url, { arg }) => postFetcher(url, arg)
  );


  //   get session list
  const { data: sessionList, isLoading: sessionLoading } = useSWR(
    "api/v1/course/session",
    getFetcher
  );

  
  const { trigger: update } = useSWRMutation(
    "api/v1/course/session",
    (url, { arg }) => putFetcher(url, arg)
  );
  if (sessionLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      const response = await getFetcher(`api/v1/course/session/${id}`);
      const userData = response.data;
      setFormData({
        name: userData?.name,
      });
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
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

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/course/session");
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        name: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleActive = async (isActive: boolean, id: number) => {
    type UpdateFormPayload = {
      id: string | number; // depends on your API, choose one
      is_active: boolean;
    };
    const UpdateFormPayload: UpdateFormPayload = {
      id: id,
      is_active: isActive,
    };
    try {
      const response = await update(UpdateFormPayload as any);
      mutate("api/v1/course/session");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create(formData as any);
      //   mutate(
      //     (currentData: any) => [...(currentData || []), response.data],
      //     false
      //   );
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        name: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
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
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Sessions" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Sessions">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="inputTwo">Sessions Name</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="2025-2026"
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
            <BasicTableSession
              sessionList={sessionList}
              onEdit={handleEdit}
              onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
