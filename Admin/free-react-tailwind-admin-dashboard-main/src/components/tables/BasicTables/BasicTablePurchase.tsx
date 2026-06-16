import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Pagination from "../../form/Pagination";
import { useSearchParams } from "react-router";

interface IProps {
  purchaseList: any;
  onEdit: (id: number) => void;
}

const SEARCH_OPTIONS = [
  { value: "name", label: "Item Name" },
  { value: "bill_no", label: "Bill No" },
];

const BasicTablePurchase: React.FC<IProps> = ({ purchaseList, onEdit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [searchBy, setSearchBy] = useState(searchParams.get("search_by") ?? "name");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput) {
          next.set("search", searchInput);
          next.set("search_by", searchBy);
        } else {
          next.delete("search");
          next.delete("search_by");
        }
        next.set("page", "1");
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchBy]);

  const handleSearchByChange = (val: string) => {
    setSearchBy(val);
    setSearchInput("");
  };

  const placeholder = searchBy === "bill_no" ? "Search by bill no..." : "Search by item name...";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex gap-2">
        <select
          value={searchBy}
          onChange={(e) => handleSearchByChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SEARCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={placeholder}
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
                Total Item Rate
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
                  {order.total_item_rate}
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
            count={page}
            onChange={(p) => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", String(p));
                return next;
              });
            }}
            length={purchaseList?.data?.length ? purchaseList?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTablePurchase;
