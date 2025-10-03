import { Button, message } from "antd";
import { useState, ChangeEvent, useTransition } from "react";
import DatePicker from "react-datepicker";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";
import useSWR from "swr";
// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import useSWRMutation from "swr/mutation";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

function Report() {
  const [messageApi, contextHolder] = message.useMessage();

  // const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
  //   null,
  //   null,
  // ]);
  const [dateRangeStudent, setDateRangeStudent] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [dateRangeInventory, setDateRangeInventory] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [dateRangeStudentMonthlyPayment, setDateRangeStudentMonthlyPayment] =
    useState<[Date | null, Date | null]>([null, null]);
  // const [startDate, endDate] = dateRange;
  const [startDateStudent, endDateStudent] = dateRangeStudent;
  const [startDateInventory, endDateInventory] = dateRangeInventory;
  const [startDateStudentMonthlyPayment, endDateStudentMonthlyPayment] =
    dateRangeStudentMonthlyPayment;

  // const [ , setEditedFormId] = useState<number>(-1);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [course, setCourse] = useState<number>(0);
  const [batch, setBatch] = useState<any>(0);
  // const [mode, setMode] = useState<any>(0);
  // const [isPending, startTransition] = useTransition();
  const [isPendingStudent, startTransitionStudent] = useTransition();
  const [isPendingInventory, startTransitionInventory] = useTransition();
  const [isPendingStudentMonthlyPayment, startTransitionStudentMonthlyPayment] =
    useTransition();

  // const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);
  const [excelFileUrlStudent, setExcelFileUrlStudent] = useState<string | null>(
    null
  );
  const [
    excelFileUrlStudentMonthlyPayment,
    setExcelFileUrlStudentMonthlyPayment,
  ] = useState<string | null>(null);
  const [excelFileUrlInventory, setExcelFileUrlInventory] = useState<
    string | null
  >(null);

  const handleCourseChange = (e: any) => {
    const value = e.target.value;
    setCourse(value);
    // setExcelFileUrl(null);
    setExcelFileUrlStudent(null);

    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId as any);
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setBatch(value);
    // setExcelFileUrl(null);
    setExcelFileUrlStudent(null);
  };
  const handleCourseChangeMonthlyPayment = (e: any) => {
    const value = e.target.value;
    setCourse(value);
    // setExcelFileUrl(null);
    setExcelFileUrlStudentMonthlyPayment(null);

    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId as any);
  };
  const handleInputChangeMonthlyPayment = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setBatch(value);
    // setExcelFileUrl(null);
    setExcelFileUrlStudentMonthlyPayment(null);
  };

  //   get courst list
  const {
    data: courseList,
    // isLoading: courseLoading,
  } = useSWR(`api/v1/course/dropdown`, getFetcher);

  // const  formdata = {
  //     type  : "payment_report",
  //     data
  // }
  //   create Batch
  const { trigger: create } = useSWRMutation(
    `api/v1/excel/url`,
    (url, { arg }) => postFetcher(url, arg)
  );

  const formDataStudent = {
    type: "admission_report",
    query: `from_date=${dayjs(dateRangeStudent[0]).format(
      "YYYY-MM-DD"
    )}&to_date=${dayjs(dateRangeStudent[1]).format(
      "YYYY-MM-DD"
    )}&course=${course}&batch=${batch}`,
  };

  const handleSearchStudent = () => {
    setExcelFileUrlStudent(null);
    startTransitionStudent(async () => {
      if (dateRangeStudent[0] && dateRangeStudent[0] && course && batch) {
        const response = await create(formDataStudent as any);

        if (response?.data) {
          setExcelFileUrlStudent(response?.data);
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

  const formDataStudentMonthlyPayment = {
    type: "monthly_payment_report",
    query: `from_date=${dayjs(dateRangeStudentMonthlyPayment[0]).format(
      "YYYY-MM-DD"
    )}&to_date=${dayjs(dateRangeStudentMonthlyPayment[1]).format(
      "YYYY-MM-DD"
    )}&course=${course}&batch=${batch}`,
  };

  const handleSearchStudentMonthlyPayment = () => {
    setExcelFileUrlStudentMonthlyPayment(null);
    startTransitionStudentMonthlyPayment(async () => {
      if (
        dateRangeStudentMonthlyPayment[0] &&
        dateRangeStudentMonthlyPayment[0] &&
        course &&
        batch
      ) {
        const response = await create(formDataStudentMonthlyPayment as any);
        if (response?.data) {
          setExcelFileUrlStudentMonthlyPayment(response?.data);
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

  const formDataInventory = {
    type: "inventory_report",
    query: `from_date=${dayjs(dateRangeInventory[0]).format(
      "YYYY-MM-DD"
    )}&to_date=${dayjs(dateRangeInventory[1]).format("YYYY-MM-DD")}`,
  };
  const handleSearchInventory = () => {
    setExcelFileUrlInventory(null);
    startTransitionInventory(async () => {
      if (dateRangeInventory[0] && dateRangeInventory[0]) {
        const response = await create(formDataInventory as any);
        if (response?.data) {
          setExcelFileUrlInventory(response?.data);
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

  const selectedCourse = Array.isArray(courseList?.data)
    ? courseList?.data?.find((course: any) => course.id == selectedCourseId)
    : null;

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Report" />

      <ComponentCard className="mt-15" title="Report For Student Admission ">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Select date range
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDateStudent}
              endDate={endDateStudent}
              onChange={(update) => {
                setDateRangeStudent(update);
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
              onChange={handleCourseChange}
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
        </div>
        <div className="flex justify-end mt-5">
          {isPendingStudent ? (
            <Button type="primary" disabled>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </Button>
          ) : excelFileUrlStudent ? (
            <a
              target="__blank"
              href={excelFileUrlStudent}
              download="report.xlsx"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Excel
            </a>
          ) : (
            <Button
              type="primary"
              disabled={isPendingStudent}
              onClick={handleSearchStudent}
            >
              Generate Report
            </Button>
          )}
        </div>
      </ComponentCard>
      <ComponentCard
        className="mt-15"
        title="Report For Student Monthly Payment "
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Select date range
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDateStudentMonthlyPayment}
              endDate={endDateStudentMonthlyPayment}
              onChange={(update) => {
                setDateRangeStudentMonthlyPayment(update);
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
              onChange={handleCourseChangeMonthlyPayment}
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
              onChange={handleInputChangeMonthlyPayment}
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
        </div>
        <div className="flex justify-end mt-5">
          {isPendingStudentMonthlyPayment ? (
            <Button type="primary" disabled>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </Button>
          ) : excelFileUrlStudentMonthlyPayment ? (
            <a
              target="__blank"
              href={excelFileUrlStudentMonthlyPayment}
              download="report.xlsx"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Excel
            </a>
          ) : (
            <Button
              type="primary"
              disabled={isPendingStudentMonthlyPayment}
              onClick={handleSearchStudentMonthlyPayment}
            >
              Generate Report
            </Button>
          )}
        </div>
      </ComponentCard>
      <ComponentCard className="mt-15" title="Report For Inventory  ">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">
              Select date range
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDateInventory}
              endDate={endDateInventory}
              onChange={(update) => {
                setDateRangeInventory(update);
              }}
              isClearable={true}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy - dd/MM/yyyy"
              className="border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
              calendarClassName="!bg-white dark:!bg-gray-200"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          {isPendingInventory ? (
            <Button type="primary" disabled>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </Button>
          ) : excelFileUrlInventory ? (
            <a
              target="__blank"
              href={excelFileUrlInventory}
              download="report.xlsx"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Excel
            </a>
          ) : (
            <Button
              type="primary"
              disabled={isPendingInventory}
              onClick={handleSearchInventory}
            >
              Generate Report
            </Button>
          )}
        </div>
      </ComponentCard>
    </div>
  );
}

export default Report;
