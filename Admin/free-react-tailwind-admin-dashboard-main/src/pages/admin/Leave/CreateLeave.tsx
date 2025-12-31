import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR, { mutate } from "swr";
import BasicTablecreateLeave from "../../../components/tables/BasicTables/BasicTablecreateLeave";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

export default function CreateLeave() {
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState({
    date: [],
    description: "",
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const { data: leaveList, isLoading: leaveLoading } = useSWR(
    "api/v1/users/leave",
    getFetcher
  );
  //   create Leave
  const { trigger: create } = useSWRMutation("api/v1/leave", (url, { arg }) =>
    postFetcher(url, arg)
  );

  if (leaveLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  // get course list

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

  const newFormDate = {
    from_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
    to_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
    reason: formData?.description,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create(newFormDate as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate("api/v1/users/leave");

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
    }
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
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
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                      }}
                      isClearable={true}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select date range"
                      className="border rounded-md px-3 py-1 text-sm dark:bg-gray-800 dark:text-white"
                      calendarClassName="!bg-white dark:!bg-gray-200"
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
                </div>
                {/* <Space direction="vertical" size={12}>
                  <RangePicker />
                </Space> */}

                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Submit
                    </button>
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
