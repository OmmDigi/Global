import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";



// Define the table data using the interface

const BasicTableAttandanceDetails = ({ attandanceList_table }: any) => {

  // const handleDetailsClick = (id: number) => {
  //   navigate(`/stuffAttandancdDetails/${id}`);
  // };

  return (
    <div className="overflow-hidden rounded-xl border mt-10 border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
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
                IN Time
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                OUT Time
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell> */}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {attandanceList_table?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div>
                    
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.date}
                      </span>
                    </div>
                  </div>
                </TableCell>
               
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.in_time ? order.in_time : "--:--:--"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500  text-start text-theme-sm dark:text-gray-400">
                  {order.out_time ? order.out_time : "--:--:--"}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400`}
                >
                  {order.status &&
                  <div className={`text-gray-900  ${order.status == "Present" ? "bg-green-300  " :"bg-red-400  " } p-1 rounded-2xl text-center font-semibold`}>{order.status}</div>
                  }
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

                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      // onClick={() => handleDetailsClick(order.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BasicTableAttandanceDetails;
