import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";


import ComponentCard from "../../common/ComponentCard";

interface IProps {
  batchList: any;
  fees_structure_table:any;
  //   onEdit: (id: number) => void;
}

// Define the table data using the interface

export default function BasicTableCourseDetailsAdmin({
  fees_structure_table,
}: IProps) {
  return (
    <ComponentCard title={`  ${fees_structure_table?.length > 0 ? "Fees Payment List  " : "( There is No Any Payment )"} `} className="mt-15">
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
                  Patment ID/Receipt No/Cheque No
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
                  Payment Mode
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            {/* "id": 6,
            "course_id": "41",
            "session_id": "24",
            "month_id": 2,
            "is_active": false,
            "created_at": "2025-07-30T10:38:54.744Z",
            "session_name": "2026 - 2027",
            "course_name": " CMS & ED Training" */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {fees_structure_table?.map((order: any, index: number) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
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
                          {order.transition_id ? order.transition_id : "No Number"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.amount ? order.amount : "0"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.mode}
                        </span>
                      </div>
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
