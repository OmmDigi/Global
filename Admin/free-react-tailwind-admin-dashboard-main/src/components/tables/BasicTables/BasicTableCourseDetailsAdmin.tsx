import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import ComponentCard from "../../common/ComponentCard";
import useSWRMutation from "swr/mutation";
import { deleteFetcher } from "../../../api/fatcher";
import { message } from "antd";
// import { mutate } from "swr";

interface IProps {
  // batchList: any;
  fees_structure_table: any;
  refetch: any;
  formId: any;
  onEdit: (id: any) => void;
}

// Define the table data using the interface

export default function BasicTableCourseDetailsAdmin({
  fees_structure_table,
  refetch,
  formId,
  onEdit,
}: IProps) {
  const { trigger: deleteUser } = useSWRMutation(
    "api/v1/payment",
    (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${formId}/${arg}`) // arg contains the id
  );
  const handleDelete = async (id: number) => {
    if (!confirm("Are you want to delete")) return;

    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete user");
    }
  };

  return (
    <ComponentCard
      title={`  ${
        fees_structure_table?.length > 0
          ? "Fees Payment List  "
          : "( There is No Any Payment )"
      } `}
      className="mt-15"
    >
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
                  Fees Head
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Remarks
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bill No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Month Of Payment
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Payment Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Payment Mode
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {fees_structure_table?.map((order: any, index: number) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="cursor-pointer size-4"/>
                      <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                        {index + 1}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.fee_head_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.remark ? order.remark : "--"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.amount == -1 ? "Amount Paid" : order.amount}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.bill_no}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.month ? order.month : "--"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.payment_date}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span
                          className={`block font-medium ${
                            order.mode == "Discount"
                              ? " text-orange-400 text-theme-xl"
                              : "dark:text-white/90 text-gray-800 text-theme-sm"
                          }   `}
                        >
                          {order.mode}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(order)}
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
    </ComponentCard>
  );
}
