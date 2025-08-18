import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import {  message } from "antd";
import useSWR, { mutate } from "swr";
import { DatePicker, Space } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import BasicTablecreateLeave from "../../../components/tables/BasicTables/BasicTablecreateLeave";

const { RangePicker } = DatePicker;

export default function CreateLeave() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [date, setDate] = useState([]);
  const [formData, setFormData] = useState({
    date: [],
    description: "",
  });

  //   create Leave
  const {
    trigger: create,
   
  } = useSWRMutation("api/v1/leave", (url, { arg }) => postFetcher(url, arg));

const {
  data: leaveList,
  isLoading: leaveLoading,
} = useSWR("api/v1/users/leave", getFetcher);

const {
  trigger: update,
} = useSWRMutation("api/v1/course/fee-head", (url, { arg }) =>
  putFetcher(url, arg)
);

if (leaveLoading) {
  return <div>Loading ...</div>;
}

console.log("leaveList", leaveList);

  const onOk = (value: RangePickerProps["value"]) => {
    setDate(value as any);
    // console.log("onOk", value[0]);
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
      console.log("Upload Success:", response);

      setFormData({
        date: [],
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

  const newFormDate = {
    from_date: date[0],
    to_date: date[1],
    reason: formData?.description,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form1", newFormDate);
    try {
      const response = await create(newFormDate as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate("api/v1/users/leave");
      console.log("Upload Success:", response);

      setFormData({
        date: [],
        description: "",
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
 

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Leave Apply" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Leave Apply">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Date Range</Label>
                    <Space direction="vertical" size={12}>
                      <RangePicker
                        onChange={( dateString) => onOk(dateString)}
                        // onOk={onOk}
                        format="YYYY-MM-DD"
                      />
                    </Space>
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
                </div>
                {/* <Space direction="vertical" size={12}>
                  <RangePicker />
                </Space> */}

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
            <BasicTablecreateLeave
              leaveList={leaveList}
              //   onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
