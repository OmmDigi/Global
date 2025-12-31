import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Calendar, Eye } from "lucide-react";
import { useState } from "react";

import { useSearchParams } from "react-router";
// import { useEffect, useState } from "react";
import Pagination from "../../form/Pagination";

export default function BasicTableEnquiry({
  enquirylist,

  onStatus,
}: // onSendData,
any) {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [openData, setOpenData] = useState<any | null>(null);

  const STATUS_OPTIONS = [
    { label: "Pending", value: "0" },
    { label: "Call", value: "1" },
    { label: "Done", value: "2" },
    { label: "Not Interested", value: "3" },
  ];
  return (
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
                Student name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ph Number
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Details
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {enquirylist?.data?.map((order: any, index: number) => (
              <TableRow key={order.form_id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500">
                      {currentPage * 10 - 10 + index + 1}
                    </div>

                    <div className="flex flex-col gap-y-1">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.name}
                      </span>
                      <span className="flex items-center gap-2 dark:text-gray-400 text-sm">
                        <Calendar size={15} strokeWidth={2} />
                        <span className="text-sm">{order.created_at}</span>
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.phone}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.email}
                </TableCell>

                <TableCell className="px-4 py-3 text-center">
                  <button
                    onClick={() => setOpenData(order)}
                    className="inline-flex items-center justify-center text-gray-800 dark:text-gray-50 hover:text-gray-600  "
                  >
                    <Eye size={18} />
                  </button>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-3.5">
                    {/* <Switch
                      label=""
                      defaultChecked={order.form_status}
                      onChange={(defaultChecked) =>
                        onActive(defaultChecked, order.form_id)
                      }
                    /> */}
                    {/* Status Select */}
                    <select
                      value={order.status || "0"}
                      onChange={(e) => onStatus(order.id, e.target.value)}
                      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
                 focus:outline-none focus:ring-1 focus:ring-gray-900
                 dark:bg-gray-800 text-gray-800 dark:text-gray-50 dark:border-white/[0.1]"
                    >
                      {STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {openData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Enquiry Details</h3>
                <button
                  onClick={() => setOpenData(null)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="border-b-2 border-dotted text-black w-full mb-5"></div>

              {/* Body */}
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <strong>Name:</strong> {openData.name}
                </div>
                <div>
                  <strong>Email:</strong> {openData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {openData.phone}
                </div>
                <div>
                  <strong>Message:</strong> {openData.message}
                </div>
                <div>
                  <strong>Age:</strong> {openData.age ?? "N/A"}
                </div>
                <div>
                  <strong>Gender:</strong> {openData.gender ?? "N/A"}
                </div>
                <div>
                  <strong>Education:</strong>{" "}
                  {openData.education_qualification ?? "N/A"}
                </div>
                <div>
                  <strong>Course:</strong> {openData.course_names ?? "N/A"}
                </div>
                <div>
                  <strong>Address:</strong> {openData.address ?? "N/A"}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-right">
                <button
                  onClick={() => setOpenData(null)}
                  className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          <Pagination
            // count={count}
            // onChange={setCount}
            length={enquirylist?.data?.length ? enquirylist?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
}
