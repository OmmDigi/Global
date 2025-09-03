import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Pagination from "../../form/Pagination";



interface IProps {
  purchaseList: any;
  onEdit: (id: number) => void;
  onSendData:any
}

// Define the table data using the interface

const BasicTablePurchase: React.FC<IProps> = ({
  purchaseList,
  onEdit,
onSendData,
  
}: any) => {

  // for delete
  // const { trigger: deleteUser, isMutating } = useSWRMutation(
  //   "api/v1/purchase",
  //   (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${arg}`) // arg contains the id
  // );
  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteUser(id);
  //     message.success("User deleted successfully");
  //     mutate("api/v1/purchase");
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     message.error("Failed to delete user");
  //   }
  // };
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
                Item Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Bill no
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Quantityreceived
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Per Item Rate
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Company details
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
            {purchaseList?.data?.map((order: any) => (
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

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.bill_no}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.quantityreceived}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.per_item_rate}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.company_details}
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
                    {/* <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         <div className="p-8">
          <Pagination
            count={count}
            onChange={setCount}
            length={purchaseList?.data?.length ? purchaseList?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTablePurchase;
