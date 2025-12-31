import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { message } from "antd";
import BasicTableHoliday from "../../../components/tables/BasicTables/BasicTableHoliday";

type FormDataType = {
  id?: number; // optional (if sometimes missing)
  date: string;
  holiday_name: string;
};

export default function ManageHolidays() {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageCount, setPageCount] = useState<number>(1);

  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState<FormDataType>({
    // id: "",
    date: "",
    holiday_name: "",
  });

  // get Holiday List
  const { data: holidayList, isLoading: holidayLoading } = useSWR(
    `api/v1/holiday?page=${pageCount}`,
    getFetcher
  );
  // create Holiday
  const { trigger: create } = useSWRMutation("api/v1/holiday", (url, { arg }) =>
    postFetcher(url, arg)
  );

  if (holidayLoading) {
  }

  // Update course
  const { trigger: update } = useSWRMutation("api/v1/holiday", (url, { arg }) =>
    putFetcher(url, arg)
  );

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

      setFormData({
        date: "",
        holiday_name: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value : [],
    }));
  };

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      // jumpToTop();

      const response = await getFetcher(`api/v1/holiday/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        date: userData?.date,
        holiday_name: userData?.holiday_name,
      });
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/holiday?limit=-1");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setFormData({
        date: "",
        holiday_name: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
    }
  };
  const handleChildData = (data: any) => {
    setPageCount(data);
  };
  // const handleActive = async (isActive: boolean, id: number) => {
  //   try {
  //     const response = await update({
  //       id: id,
  //       is_active: isActive,
  //     });
  //     messageApi.open({
  //       type: "success",
  //       content: response.message,
  //     });
  //     mutate("api/v1/holiday");
  //   }
  //   catch (error: any) {
  //     messageApi.open({
  //       type: "error",
  //       content: error.response?.data?.message,
  //     });
  //   }
  // };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Manage Holidays" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create Holidays">
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputTwo">Holiday Date</Label>
                  <Input
                    type="date"
                    id="inputTwo"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                    placeholder="Holiday date"
                  />
                </div>
                <div>
                  <Label htmlFor="inputTwo">Holiday Title</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="holiday_name"
                    onChange={handleChange}
                    value={formData.holiday_name}
                    placeholder="Holiday Title"
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
            <BasicTableHoliday
              holidayList={holidayList}
              onEdit={handleEdit}
              onSendData={handleChildData}
              // onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
