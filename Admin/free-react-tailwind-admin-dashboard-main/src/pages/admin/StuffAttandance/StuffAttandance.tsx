import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import BasicTableAttandance from "../../../components/tables/BasicTables/BasicTableAttandance";
import useSWR from "swr";
import { getFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";
// import { message } from "antd";

export default function StuffAttandance() {
  const {
    data: attandancelist,
    isLoading: attandanceLoading,
    error: attandanceError,
    // mutate: attandanceMutate,
  } = useSWR("api/v1/attendance?limit=-1", getFetcher);

  if (attandanceLoading) {
    console.log("loading", attandanceLoading);
  }
  if (attandanceError) {
    console.log("stuffError", attandanceError);
  }
  const today = new Date();

  // const syncdata = async () => {
  //   try {
  //     const response = await getFetcher("api/v1/attendance/sync");
  //     if (!response.ok) {
  //       message.error(response.message || "Failed to sync attendance");
  //       return;
  //     }
  //     attandanceMutate();
  //   } catch (error) {
  //     console.error("Error syncing attendance", error);
  //   }
  // };

  return (
    <div>
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Staff Attandance" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Staff Attandance">
            <div className=" flex justify-end items-end">
              {/* <div>
                {" "}
                <button onClick={syncdata} className="bg-blue-500 text-white px-2 py-2 mr-3 text-xl rounded">
                  Sync Attendance
                </button>
              </div> */}
              <div className="text-gray-500 text-3xl font-bold">
                {" "}
                {dayjs(today).format("DD-MM-YYYY")}
              </div>
            </div>
            <BasicTableAttandance attandancelist={attandancelist} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
