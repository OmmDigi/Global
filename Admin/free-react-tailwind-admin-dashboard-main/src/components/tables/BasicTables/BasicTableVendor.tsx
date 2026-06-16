import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import useSWRMutation from "swr/mutation";
import { deleteFetcher } from "../../../api/fatcher";
import { message } from "antd";
import { mutate } from "swr";
import { useSearchParams } from "react-router";


interface IProps {
  sessionList: any;
  onEdit: (id: number) => void;
}

export default function BasicTableVendor({ sessionList, onEdit }: IProps) {
  const [searchParams, setSearchParams] = useSearchParams();
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
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { trigger: deleteUser } = useSWRMutation(
    "api/v1/vendor",
    (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${arg}`) // arg contains the id
  );
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      mutate("api/v1/vendor");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete user");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by vendor name..."
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
                Vendor name
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Service type
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact details
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
            {sessionList?.data?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.service_type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.contact_details}
                    </span>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="pl-4">
                    <Switch
                      label=""
                      defaultChecked={order.is_active}
                      onChange={(defaultChecked) =>
                        onActive(defaultChecked, order.id)
                      }
                    />
                  </div>
                </TableCell> */}

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(order.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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
