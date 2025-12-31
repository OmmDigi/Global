import ComponentCard from "../../../components/common/ComponentCard";
import DatePicker from "react-datepicker";
import { Button, message } from "antd";
import { ChangeEvent, useState, useTransition } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function AdminReport() {
  const [messageApi, contextHolder] = message.useMessage();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [startDate, endDate] = dateRange;
  const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);
  const [course, setCourse] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [mode, setMode] = useState<any>(0);
  const [batch, setBatch] = useState<any>(0);
  const [isPending, startTransition] = useTransition();

  const { trigger: create } = useSWRMutation(
    `api/v1/excel/url`,
    (url, { arg }) => postFetcher(url, arg)
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setBatch(value);
    setExcelFileUrl(null);
  };

  const handleCourseChange = (e: any) => {
    const value = e.target.value;
    setCourse(value);
    setExcelFileUrl(null);

    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId as any);
  };

  const handleModeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setMode(value);
    setExcelFileUrl(null);
  };

  const formDataAccount = {
    type: "payment_report",
    query: `from_date=${dayjs(dateRange[0]).format(
      "YYYY-MM-DD"
    )}&to_date=${dayjs(dateRange[1]).format(
      "YYYY-MM-DD"
    )}&course=${course}&batch=${batch}&mode=${mode}`,
  };
  const handleSearchAccount = () => {
    setExcelFileUrl(null);
    startTransition(async () => {
      if (dateRange[0] && dateRange[0] && course && batch) {
        const response = await create(formDataAccount as any);

        if (response?.data) {
          setExcelFileUrl(response?.data);
          //    window.open(response?.data,"__blank");
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Please Select all Input Fields",
        });
      }
    });
  };

  const {
    data: courseList,
    // isLoading: courseLoading,
  } = useSWR(`api/v1/course/dropdown`, getFetcher);

  const selectedCourse = Array.isArray(courseList?.data)
    ? courseList?.data?.find((course: any) => course.id == selectedCourseId)
    : null;

  return (
    <div>
      {contextHolder}
            <PageBreadcrumb pageTitle="Admin Report" />
      
      <ComponentCard title="Report For Admission Payment (Online / Cash / Cheque)">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Select date range
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
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
              // disabled={id ? true : false}
              // defaultValue={formData?.courseName}
              // value={formData.courseName}
              onChange={(e) => handleCourseChange(e)}
              className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            >
              <option value="">Option-</option>
              {courseList?.data?.map((data: any, index: number) => (
                <option key={index} value={`${data?.id}`}>
                  {data?.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Choose your Batch
            </label>
            <select
              key={+"batchName"}
              name="batchName"
              // disabled={id ? true : false}
              // defaultValue={formData.batchName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Option-</option>
              {selectedCourse?.batch?.map((batch: any, index: number) => (
                <option key={index} value={`${batch?.batch_id}`}>
                  {batch.month_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Choose Payment Mode
            </label>
            <select
              key={+"mode"}
              name="mode"
              // disabled={id ? true : false}
              // defaultValue={formData.batchName}
              onChange={handleModeChange}
              className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Option-</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          {isPending ? (
            <Button type="primary" disabled>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </Button>
          ) : excelFileUrl ? (
            <a
              target="__blank"
              href={excelFileUrl}
              download="report.xlsx"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Excel
            </a>
          ) : (
            <Button
              type="primary"
              disabled={isPending}
              onClick={handleSearchAccount}
            >
              Generate Report
            </Button>
          )}
        </div>
      </ComponentCard>
    </div>
  );
}
