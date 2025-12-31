// import Chart from "react-apexcharts";
import { Chart } from "react-google-charts";
import useSWR from "swr";
import { getFetcher } from "../../api/fatcher";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

export default function MonthlyIncome() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (dateRange[0] !== null && dateRange[1] !== null) {
      setFilter(
        `from_date=${dayjs(dateRange[0]).format("YYYY-MM-DD")}&to_date=${dayjs(
          dateRange[1]
        ).format("YYYY-MM-DD")}`
      );
    }
  }, [dateRange]);

  const { data: income, isLoading: incomeLoading } = useSWR(
    `api/v1/dashboard/income?${filter}`,
    getFetcher
  );
  if (incomeLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const data = [
    ["Task", "Hours per Day"],
    ...(income?.data || []).map((item: any) => [
      item.mode,
      Number(item.income),
    ]),
  ];

  const options = {
    backgroundColor: "transparent",
    pieHole: 0.4,
    pieStartAngle: 100,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Fees
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          <div>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date range"
              className="border rounded-md px-3 py-1 text-sm dark:bg-gray-800 dark:text-white"
              calendarClassName="!bg-white dark:!bg-gray-200"
            />
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[630px] " id="chartDarkStyle">
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width={"100%"}
              height={"400px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
