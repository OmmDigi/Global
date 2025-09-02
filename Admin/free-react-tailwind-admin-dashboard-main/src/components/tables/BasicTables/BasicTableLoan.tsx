import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { FaEye } from "react-icons/fa";


// import { useNavigate } from "react-router";
// Define the table data using the interface
const BasicTableLoan = ({ attandancelist }: any) => {


  // Toggle one row
  // const handleCheckboxChange = (id: number) => {
  //   setSelected((prev) =>
  //     prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  //   );
  // };

  // Toggle select all




  // Handle Generate Payslip
  
  // const navigate = useNavigate();

 

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
       
      </div>
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
                
                  Staff Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total amount
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Monthly return amount
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {attandancelist?.data?.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {/* <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {order.id}
                    </div> */}
                      <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.total_amount}
                  </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.monthly_return_amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={order?.payslip_generated == "false"}
                        // onClick={() => handleDetailsClick(order.id)}
                        className={` ${
                          order?.payslip_generated == true
                            ? "text-blue-500"
                            : "text-gray-500"
                        }     `}
                      >
                        <FaEye className="text-2xl" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default BasicTableLoan;
