import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { message, Pagination, PaginationProps } from "antd";
import { useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { deleteFetcher } from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";



// Define the table data using the interface

interface Message {
  id: number;
  title: string;
  description: string;
  created_at: string; 
  send_to: string[];
}
export default function BasicTableNotice({ noticeList }: any) {
const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDetailsClick = (project: any) => {
    setSelectedMessage(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    console.log(current, pageSize);
  };


   // for delete
  const { trigger: deleteUser } = useSWRMutation(
    "api/v1/notice",
    (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${arg}`) // arg contains the id
  );
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      messageApi?.success("User deleted successfully");
      mutate("api/v1/notice");
    } catch (error) {
      console.error("Delete failed:", error);
      messageApi.error("Failed to delete user");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
     {contextHolder}
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
                Notice Title
              </TableCell>
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
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {noticeList?.data?.map((order:any, index:number) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {index +1}
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.send_to[0]}
                        </span>
                        {order.send_to.length > 1 && (
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
                  {order.title}
                </TableCell>
                 <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.created_at}
                </TableCell>
               

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {/* <button className="text-blue-500 hover:underline">
                      Edit
                    </button> */}
                    <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination  */}
        <div>
          <Pagination
            showSizeChanger
            onChange={onShowSizeChange}
            defaultCurrent={1}
            total={500}
            // colorPrimaryHover={'#qwe23'}
          />
        </div>
      </div>

      {showModal &&  selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Notice Details</h2>
            
            <p>
              <strong>Title:</strong> {selectedMessage?.title}
            </p>
            <p className="flex gap-2">
              <strong>Sended to:</strong>  
              {selectedMessage?.send_to?.map((send:any) =>(
                <p> {send} , </p>
              ))}
            </p>
            <p>
              <strong>Description:</strong> {selectedMessage?.description}
            </p>
            <p>
              <strong>Date:</strong> {selectedMessage?.created_at}
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
