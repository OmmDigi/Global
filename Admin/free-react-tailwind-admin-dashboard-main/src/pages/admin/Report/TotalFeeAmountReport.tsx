import { Button } from "antd";
import ComponentCard from "../../../components/common/ComponentCard";
import DatePicker from "react-datepicker";
import { useEffect, useState, useTransition } from "react";
import useSWRMutation from "swr/mutation";
import { postFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";

interface IProps {
  courseList: any;
}

export default function TotalFeeAmountReport({ courseList }: IProps) {
  const [formData, setFormData] = useState<Record<string, string> | null>(null);
  const [isPending, startTransition] = useTransition();

  const [dateRangeOverAll, setDateRangeOverAll] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [startDateOverAll, endDateOverAll] = dateRangeOverAll;

  const [excelDownloadUrl, setExcelDownloadUrl] = useState<string | null>(null);

  const { trigger: create } = useSWRMutation(
    `api/v1/excel/url`,
    (url, { arg }) => postFetcher(url, arg)
  );

  useEffect(() => {
    if (dateRangeOverAll?.[0] && dateRangeOverAll?.[1]) {
      const from_date = dayjs(dateRangeOverAll[0]).format("YYYY-MM-DD");
      const to_date = dayjs(dateRangeOverAll[1]).format("YYYY-MM-DD");
      setFormData((prev) => ({ ...prev, from_date, to_date }));
    }
  }, [dateRangeOverAll]);

  const handleSearch = () => {
    setExcelDownloadUrl(null);
    if (formData == null) {
      return alert("No option to search");
    }

    const dataToSend = {
      type: "total_amount_report",
      query: new URLSearchParams(formData).toString(),
    };

    startTransition(async () => {
      const response = await create(dataToSend as any);
      if (response?.data) {
        setExcelDownloadUrl(response?.data);
      }
    });
  };

  return (
    <ComponentCard
      className="mt-15"
      title="Report For Student Fee summary Report "
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">
            Select date range
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDateOverAll}
            endDate={endDateOverAll}
            onChange={(update) => {
              setDateRangeOverAll(update);
              setExcelDownloadUrl(null);
            }}
            isClearable={true}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy - dd/MM/yyyy"
            className="border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
            calendarClassName="!bg-white dark:!bg-gray-200"
          />
        </div>
        <div className="  mb-4">
          <label className="block text-sm font-bold text-gray-500 mb-1">
            Choose your Courses
          </label>
          <select
            key={+"courseName"}
            name="courseName"
            onChange={(e) => {
              const course = e.currentTarget.value;
              if (course != "-1" && course != "") {
                setExcelDownloadUrl(null);
                setFormData((prev) => ({
                  ...prev,
                  course: course,
                }));
              }
            }}
            className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="">Option</option>
            <option value="-1">All</option>
            {courseList?.data?.map((data: any, index: number) => (
              <option key={index} value={`${data?.id}`}>
                {data?.course_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">
            Choose your payment Mode
          </label>
          <select
            key={+"mode"}
            name="mode"
            onChange={(e) => {
              const value = e.currentTarget.value;
              if (value !== "Both" && value !== "") {
                setExcelDownloadUrl(null);
                setFormData((prev) => ({
                  ...prev,
                  mode: value,
                }));
              }
            }}
            className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Option</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        {excelDownloadUrl ? (
          <a
            target="__blank"
            href={excelDownloadUrl}
            download="report.xlsx"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Excel
          </a>
        ) : (
          <Button type="primary" disabled={isPending} onClick={handleSearch}>
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Generate Report"
            )}
          </Button>
        )}
      </div>
    </ComponentCard>
  );
}
