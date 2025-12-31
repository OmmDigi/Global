import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import BasicTableAttandance from "../../../components/tables/BasicTables/BasicTableAttandance";
import useSWR from "swr";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";
import { useState, useTransition } from "react";
import { message } from "antd";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

export default function StuffAttandance() {
  const [isPending, startTransition] = useTransition();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: attandancelist, mutate: attandanceMutate } = useSWR(
    `api/v1/attendance?limit=-1&date=${dayjs(selectedDate).format(
      "YYYY-MM-DD"
    )}`,
    getFetcher
  );

  // const today = new Date();

  const syncAttendance = () => {
    startTransition(async () => {
      try {
        await postFetcher("api/v1/attendance/sync", {});
        messageApi.success(
          "Attendance synced successfully it will take some time to reflect"
        );
        attandanceMutate();
      } catch (error: any) {
        messageApi.error(
          error?.response?.data?.message || "Failed to sync attendance"
        );
      }
    });
  };

  console.log("selectedDate", selectedDate);

  return (
    <div>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Staff Attandance" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Staff Attandance">
            <div className=" flex justify-end items-end">
              <div>
                <button
                  onClick={syncAttendance}
                  disabled={isPending}
                  className={`bg-blue-500 ${
                    isPending ? "opacity-50 cursor-not-allowed" : ""
                  } text-white px-5 py-2 mr-3 text-xl rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300`}
                >
                  {isPending ? "Syncing..." : "Sync Attendance"}
                </button>
              </div>

              {/* <div className="text-gray-500 text-3xl font-bold">
                {dayjs(today).format("DD-MM-YYYY")}
              </div> */}

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date as any)}
                  dateFormat="dd-MM-YYY"
                  className="border rounded-md px-2 py-3 text-sm dark:bg-gray-800 dark:text-white"
                  calendarClassName="!bg-white dark:!bg-gray-200"
                />
                {/* <span className="text-sm text-gray-500">
                  {dayjs(selectedDate).format("dddd")}
                </span> */}
              </div>
            </div>
            <BasicTableAttandance attandancelist={attandancelist} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
