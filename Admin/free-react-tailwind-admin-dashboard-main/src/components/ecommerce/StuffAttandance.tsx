import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine } from "../../icons";
import Badge from "../ui/badge/Badge";
import DatePicker from "react-datepicker";
import useSWR from "swr";
import { getFetcher } from "../../api/fatcher";
import dayjs from "dayjs";

export default function StuffAttandance() {
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: attendance, isLoading: attandanceLoading } = useSWR(
    `api/v1/dashboard/attendance?date=${dayjs(selectedDate).format(
      "YYYY-MM-DD"
    )}`,
    getFetcher
  );

  if (attandanceLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-green-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          {/* Date Picker */}
          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date as any)}
              dateFormat="dd/MM/yyyy"
              className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
              calendarClassName="!bg-white dark:!bg-gray-200"
            />
          </div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Staff
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {attendance?.data?.total_employee}
            </h4>
          </div>

          <div className="flex flex-col gap-2 text-start items-start">
            <Badge color="success">
              <ArrowUpIcon />
              Present - {attendance?.data?.present}
            </Badge>
            <Badge color="error">
              <ArrowDownIcon />
              Absent - {attendance?.data?.absent}
            </Badge>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
