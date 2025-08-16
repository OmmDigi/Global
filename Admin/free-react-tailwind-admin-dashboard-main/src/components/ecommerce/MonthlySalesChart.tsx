import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { useState } from "react";
import useSWR from "swr";
import { getFetcher } from "../../api/fatcher";

export default function MonthlySalesChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  console.log("selectedYear", selectedYear);
 // get course list
  const {
    data: admission,
    loading: admissionLoading,
    error: admissionError,
  } = useSWR(`api/v1/dashboard/admission?year=${selectedYear}`, getFetcher);
  if (admissionLoading) {
    return <div>Loading ...</div>;
  }


  
  const months = admission?.data?.map((item:any) => item.month);
  const admissions = admission?.data?.map((item:any) => Number(item.admission));
  
  console.log("admission",months,admissions);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: "Admissions",
      data: admissions,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Admissions
        </h3>
        <select
          className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as any)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
