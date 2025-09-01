import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Switch from "../../form/switch/Switch";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Pagination from "../../form/Pagination";

export default function BasicTableAdmission({
  admissionlist,
  onEdit,
  onActive,
  onSendData,
  
}: any) {
  const navigate = useNavigate();

 
  const handleDetailsClick = (id: number) => {
    navigate(`/courseDetailsAdmin/${id}`);
  };
  const [count, setCount] = useState(1);

  useEffect(() => {
    onSendData(count);
  }, [count, onSendData]);



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
                Course name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Batch
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Form No
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Fees
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Due Amount
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
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Details
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {admissionlist?.data?.map((order: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      <img
                        src={order.student_image}
                        alt={order.student_image}
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.student_name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.course_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.batch_name}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.form_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.course_fee}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 ${
                    Number(order.due_amount) === 0
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-500 "
                  }  text-start text-theme-sm `}
                >
                  {order.due_amount}
                </TableCell>

                <TableCell>
                  <div className="pl-4">
                    <Switch
                      label=""
                      defaultChecked={order.form_status}
                      onChange={(defaultChecked) =>
                        onActive(defaultChecked, order.form_id)
                      }
                    />
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(order.form_id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDetailsClick(order.form_id)}
                      className="text-blue-500 hover:underline"
                    >
                      Details
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-8">
          <Pagination count={count} onChange={setCount} length={admissionlist?.data?.length ? admissionlist?.data?.length : 1} />
        </div>

      </div>
    </div>
  );
}
