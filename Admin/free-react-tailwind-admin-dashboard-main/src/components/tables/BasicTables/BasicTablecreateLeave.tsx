import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Switch from "../../form/switch/Switch";
import useSWRMutation from "swr/mutation";
import { deleteFetcher } from "../../../api/fatcher";
import { message } from "antd";
import { mutate } from "swr";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";

interface IProps {
  leaveList: any;

}

// Define the table data using the interface

export default function BasicTablecreateLeave({
  leaveList,
 
}: IProps) {
  // const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
  //   current,
  //   pageSize
  // ) => {
  //   console.log(current, pageSize);
  // };

  const { trigger: deleteUser, isMutating } = useSWRMutation(
    "api/v1/leave",
    (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${arg}`) // arg contains the id
  );
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      mutate("api/v1/leave");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete user");
    }
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
                Form Date
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
            {leaveList?.data?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.from_date}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.to_date}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.status   }
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {/* <button
                      onClick={() => onEdit(order.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button> */}
                    {order?.status == "Pending" ? (
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    ) : order?.status == "Approved" ? <p className="text-2xl">😊</p> : <p className="text-2xl">😢</p>}
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
    </div>
  );
}
