
import PageMeta from "../../../components/common/PageMeta";
import { useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";

export default function Home() {

  
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");

    if (token) localStorage.setItem("token", token);
    if (category) localStorage.setItem("category", category);

    console.log("Token:", window.location.search);
    console.log("Category:", category);
  }, []);
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className=" max-w-full overflow-x-auto">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* <EcommerceMetrics /> */}
          <ComponentCard title="Student DashBoard">
            <BasicTableCourses /> 
          </ComponentCard>
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* <MonthlyTarget /> */}
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
