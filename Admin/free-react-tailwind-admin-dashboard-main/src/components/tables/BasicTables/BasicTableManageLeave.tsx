import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useState } from "react";
import { BiSolidShow } from "react-icons/bi";



// Define the table data using the interface
interface Message {
  id: number;
  name: string;
  reason: string;
  from_date: string; 
  to_date:string ;
}
export default function BasicTableManageLeave({
  leaveList,
  handleChange,
}: any) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDetailsClick = (project: any) => {
    setSelectedMessage(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

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
                User name
              </TableCell>
               <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
               Reason
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                From date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                To Date
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
            {leaveList?.data?.map((order:any, index:number) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {index + 1}
                    </div>
                    <div>{order.name}</div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex gap-2">
                        {order.reason.length < 20 && (
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 whitespace-pre-line">
                            {order.reason}
                          </span>
                        )}
                        {order.reason.length > 20 && (
                          <button
                            onClick={() => handleDetailsClick(order)}
                            className="text-blue-500 flex h-3 w-3 text-lg"
                          >
                            ...
                            <span>
                              <BiSolidShow className="text-2xl transition-transform duration-300 hover:scale-120" />
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.from_date}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.to_date}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {/* <button className="text-blue-500 hover:underline">
                      Edit
                    </button> */}
                    <select
                      // type="select"
                      id="inputTwo"
                      name="category"
                      value={order.status}
                      onChange={(value) =>
                        handleChange(value, order.id, order.employee_id)
                      }
                      // value={formData.category}
                      className={`w-full px-3 py-2 border-2 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800 ${order.status == "Rejected" && 'border-red-600'  }    ${order.status == "Approved" && 'border-green-600'  }  border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700`}
                    >
                      <option value="">Select</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination  */}
        {/* <div>
          <Pagination
            showSizeChanger
            onChange={onShowSizeChange}
            defaultCurrent={1}
            total={500}
            // colorPrimaryHover={'#qwe23'}
          />
        </div> */}
      </div>

      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Notice Details
            </h2>

            <p>
              <strong>Name:</strong> {selectedMessage?.name}
            </p>

            <p>
              <strong>Description:</strong> {selectedMessage?.reason}
            </p>
            <p>
              <strong>From Date:</strong> {selectedMessage?.from_date}
            </p>
            <p>
              <strong> To Date:</strong> {selectedMessage?.to_date}
            </p>

            <div className="mt-4 text-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
