import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
// import { FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR from "swr";

// import { useNavigate } from "react-router";
// Define the table data using the interface
// type Staff = {
//   id: number;
//   name: string;
//   designation: string;
//   image: string;
// };
const BasicTablePayslip = ({ role }: any) => {
  // const [selected, setSelected] = useState<number[]>([]);
  // const [selectAll, setSelectAll] = useState(false);
  const [month, setMonth] = useState<Date | null>(new Date());
  const [messageApi, contextHolder] = message.useMessage();

  // Toggle one row
  // const handleCheckboxChange = (id: number) => {
  //   setSelected((prev) =>
  //     prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  //   );
  // };

  // Toggle select all
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelected([]);
  //     setSelectAll(false);
  //   } else {
  //     setSelected(attandancelist?.data?.map((x: any) => x.id) || []);
  //     setSelectAll(true);
  //   }
  // };

  const {
    data: attandancelist,
    isLoading: attandanceLoading,
    error: attandanceError,
  } = useSWR(
    `api/v1/users/payslip?category=${role}&month=${dayjs(month).format(
      "YYYY-MM"
    )}`,
    getFetcher
  );

  const { trigger: update } = useSWRMutation(
    "api/v1/excel/url",
    (url, { arg }) => postFetcher(url, arg)
  );

  if (attandanceLoading) {
    return <div>Loading ...</div>;
  }
  if (attandanceError) {
    return <div>Error ...</div>;
  }
  // Handle Generate Payslip
  const handleGeneratePayslip = async (month: any) => {
    const data = {
      // role: role,
      // month: dayjs(month).format("YYYY-MM"),
      type: "salary_sheet",
      query: `role=${role}&month=${dayjs(month).format("YYYY-MM")}`,
    };

    try {
      const response = await update(data as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      if (response?.data) {
        window.open(response?.data, "__blank");
        //    window.open(response?.data,"__blank");
      }
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }

    // API call here
  };
  // const navigate = useNavigate();
  // const url = import.meta.env.VITE_API_BASE_URL;
  // const handleDetailsClick = (id: number) => {
  //   window.open(
  //     `${url}api/v1/users/payslip/${id}?month=${dayjs(month).format("YYYY-MM")}`
  //   );
  // };

  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <DatePicker
          selected={month}
          onChange={(date) => setMonth(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-md px-3 py-2 text-sm"
          placeholderText="Select Month"
        />
        <button
          onClick={() => handleGeneratePayslip(month)}
          disabled={!month}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          Generate Payslip
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {/* <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="m-3"
                  /> */}
                  Staff Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Designation
                </TableCell>

                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  View
                </TableCell> */}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {attandancelist?.data?.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {/* <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                      /> */}
                      {/* <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div> */}
                      <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.designation}
                  </TableCell>

                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={!order?.payslip_generated}
                        onClick={() => handleDetailsClick(order.id)}
                        className={` ${
                          order?.payslip_generated == true
                            ? "text-blue-500"
                            : "text-gray-500"
                        }     `}
                      >
                        <FaEye className="text-2xl" />
                      </button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default BasicTablePayslip;
