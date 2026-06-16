import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Switch from "../../form/switch/Switch";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import Pagination from "../../form/Pagination";
import { useSearchParams } from "react-router";

interface IProps {
  courseList: any;
  onEdit: (id: number) => void;
  onActive: (checked: boolean, id: number) => void;
}

// Define the table data using the interface

const BasicTableCourses: React.FC<IProps> = ({
  courseList,
  onEdit,
  onActive,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput) {
          next.set("search", searchInput);
        } else {
          next.delete("search");
        }
        next.set("page", "1");
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search course by name..."
          className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Course name
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Session
              </TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Duration
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment Mode
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {courseList?.data?.map((order: any, index: number) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      <div className="text-gray-500">
                        {page * 10 - 10 + index + 1}
                      </div>
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.session_id}
                </TableCell> */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.duration}
                </TableCell>
                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.payment_mode}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.price}
                </TableCell> */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {dayjs(order.created_at).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <div className="pl-4">
                    <Switch
                      label=""
                      defaultChecked={order.is_active}
                      onChange={(defaultChecked) =>
                        onActive(defaultChecked, order.id)
                      }
                    />
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(order.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-8">
          <Pagination
            count={page}
            onChange={(page) => {
              setSearchParams((prev) => ({ ...prev, page }));
            }}
            length={courseList?.data?.length ? courseList?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTableCourses;
