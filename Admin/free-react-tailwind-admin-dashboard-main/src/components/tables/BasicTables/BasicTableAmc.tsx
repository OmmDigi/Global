import { useEffect, useState } from "react";
import Pagination from "../../form/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useSearchParams } from "react-router";

interface IProps {
  amcList: any;
  onEdit: (id: number) => void;
}

const SEARCH_OPTIONS = [
  { value: "product_name", label: "Product Name" },
  { value: "company_name", label: "Company Name" },
];

const inputCls =
  "border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

const DATE_FILTER_OPTIONS = [
  { value: "expiry", label: "Expiry Date" },
  { value: "renewal", label: "Renewal Date" },
];

const BasicTableAmc: React.FC<IProps> = ({ amcList, onEdit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");

  const [searchBy, setSearchBy] = useState(searchParams.get("search_by") ?? "product_name");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [dateFilterBy, setDateFilterBy] = useState<"expiry" | "renewal">("expiry");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // debounced text search
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

  const handleDateFilterByChange = (val: "expiry" | "renewal") => {
    setDateFilterBy(val);
    setDateFrom("");
    setDateTo("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("expiry_from");
      next.delete("expiry_to");
      next.delete("renewal_from");
      next.delete("renewal_to");
      next.set("page", "1");
      return next;
    });
  };

  const handleDateChange = (which: "from" | "to", val: string) => {
    if (which === "from") setDateFrom(val);
    else setDateTo(val);

    const fromKey = dateFilterBy === "expiry" ? "expiry_from" : "renewal_from";
    const toKey = dateFilterBy === "expiry" ? "expiry_to" : "renewal_to";
    const key = which === "from" ? fromKey : toKey;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set(key, val);
      } else {
        next.delete(key);
      }
      next.set("page", "1");
      return next;
    });
  };

  const placeholder =
    searchBy === "company_name" ? "Search by company name..." : "Search by product name...";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-3">
        {/* Text search */}
        <select
          value={searchBy}
          onChange={(e) => handleSearchByChange(e.target.value)}
          className={inputCls}
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
          className={`${inputCls} w-48`}
        />

        {/* Date range with type selector */}
        <div className="flex items-center gap-2">
          <select
            value={dateFilterBy}
            onChange={(e) => handleDateFilterByChange(e.target.value as "expiry" | "renewal")}
            className={inputCls}
          >
            {DATE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className={inputCls}
          />
          <span className="text-xs text-gray-400">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Product Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Company Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Expiry Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Renewal Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Time Duration
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {amcList?.data?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.id}
                    </div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.product_name}
                    </span>
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
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <button
                    onClick={() => onEdit(order.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
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
            length={amcList?.data?.length ? amcList?.data?.length : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTableAmc;
