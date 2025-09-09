import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import BasicTableAttandance from "../../../components/tables/BasicTables/BasicTableAttandance";
import useSWR from "swr";
import { getFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";

export default function StuffAttandance() {
  const {
    data: attandancelist,
    isLoading: attandanceLoading,
    error: attandanceError,
  } = useSWR("api/v1/attendance?limit=-1", getFetcher);

  if (attandanceLoading) {
    console.log("loading", attandanceLoading);
  }
  if (attandanceError) {
    console.log("stuffError", attandanceError);
  }

  const today = new Date();

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Staff Attandance" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard
            title="Staff Attandance"
            desc={`${dayjs(today).format("DD-MM-YYYY")}`}
          >
            <BasicTableAttandance attandancelist={attandancelist} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
