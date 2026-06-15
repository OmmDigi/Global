import { useState } from "react";
import DatePicker from "react-datepicker";
import { message } from "antd";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTablePayments from "../../../components/tables/BasicTables/BasicTablePayments";
import { getFetcher, patchFetcher } from "../../../api/fatcher";

export default function Payments() {
  const [messageApi, contextHolder] = message.useMessage();

  const [mode, setMode] = useState<"Online" | "Offline" | "Both">("Online");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [page, setPage] = useState(1);

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("page", String(page));
    if (startDate)
      params.set("from_date", dayjs(startDate).format("YYYY-MM-DD"));
    if (endDate) params.set("to_date", dayjs(endDate).format("YYYY-MM-DD"));
    return params.toString();
  };

  const swrKey = `api/v1/payment/list?${buildQuery()}`;

  const { data, mutate } = useSWR(swrKey, getFetcher);

  const { trigger: updateBillNo } = useSWRMutation(
    "api/v1/payment/bill-no",
    (url, { arg }: { arg: { id: number; bill_no: string } }) =>
      patchFetcher(url, arg),
  );

  const handleModeChange = (newMode: "Online" | "Offline" | "Both") => {
    setMode(newMode);
    setPage(1);
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    setDateRange(range);
    setPage(1);
  };

  const handleClearFilters = () => {
    setDateRange([null, null]);
    setMode("Online");
    setPage(1);
  };

  const handleUpdateBillNo = async (id: number, bill_no: string) => {
    try {
      const response = await updateBillNo({ id, bill_no });
      mutate();
      messageApi.open({ type: "success", content: response.message });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message || "Failed to update bill no",
      });
    }
  };

  const payments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <>
      {contextHolder}
      <PageMeta title="Payments" description="All payments list" />
      <PageBreadcrumb pageTitle="Payments" />

      <div className="space-y-5">
        <ComponentCard title="Filters">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/[0.1]">
              {(["Online", "Offline", "Both"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Date range picker */}
            <div className="flex items-center gap-2">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                placeholderText="Select date range"
                dateFormat="dd/MM/yyyy"
                isClearable
                className="border border-gray-200 dark:border-white/[0.1] rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-900 w-52"
              />
            </div>

            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-white/[0.1] rounded-lg"
            >
              Clear
            </button>

            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Total: <strong>{total}</strong>
            </span>
          </div>
        </ComponentCard>

        <ComponentCard title="Payments List" className="overflow-hidden">
          <BasicTablePayments
            payments={payments}
            onUpdateBillNo={handleUpdateBillNo}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-white/[0.1] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/[0.05] dark:text-white"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-white/[0.1] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/[0.05] dark:text-white"
              >
                Next
              </button>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
