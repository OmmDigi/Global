import MonthlySalesChart from "../../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect } from "react";
import StuffAttandance from "../../../components/ecommerce/StuffAttandance";
import MonthlyIncome from "../../../components/ecommerce/MonthlyIncome";

export default function Home() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    console.log("token", query);
    const token = query.get("token");
    const category = query.get("category");
    const permissions = query.get("permissions");

    if (token) {
      localStorage.setItem("token", token);
    }
    if (category) localStorage.setItem("category", category);
    if (permissions) localStorage.setItem("permissions", permissions);
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <MonthlySalesChart />
          <StuffAttandance />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MonthlyIncome />
        </div>

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
