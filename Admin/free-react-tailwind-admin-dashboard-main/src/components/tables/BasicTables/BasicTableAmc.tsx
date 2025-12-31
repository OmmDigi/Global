import { useEffect, useState } from "react";
import Pagination from "../../form/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";



interface IProps {
  amcList: any;
  onEdit: (id: number) => void;
  onSendData:any
}

// Define the table data using the interface

const BasicTableAmc: React.FC<IProps> = ({
  amcList,
  onEdit,
  onSendData
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
                Product Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Company name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Expiry Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Renewal Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
               Time Duration
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
            {amcList?.data?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.product_name}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.company_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.expiry_date}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.renewal_date}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.time_duration}
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
            length={amcList?.data?.length ? amcList?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTableAmc;
