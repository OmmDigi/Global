import PageMeta from "../../../components/common/PageMeta";
import { useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";
import { getFetcher } from "../../../api/fatcher";
import useSWR from "swr";

export default function Home() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");
    const name = query.get("name");

    if (token) localStorage.setItem("token", token);
    if (category) localStorage.setItem("category", category);
    if (name) localStorage.setItem("name", name);
  }, []);

  const { data: courseList, isLoading: courseLoading } = useSWR(
    "api/v1/users/course",
    getFetcher
  );
  if (courseLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  return (
    <>
      <PageMeta
        title=" Dashboard Ecommerce Dashboard |  "
        description="This is  Dashboard Ecommerce Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <div className=" max-w-full overflow-x-auto">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* <EcommerceMetrics /> */}
          <ComponentCard
            title={`Welcome ${
              localStorage.getItem("name") ?? " to your dashboard"
            }`}
          >
            <BasicTableCourses courseList={courseList} />
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
