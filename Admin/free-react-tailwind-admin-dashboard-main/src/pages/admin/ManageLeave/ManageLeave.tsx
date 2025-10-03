import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableManageLeave from "../../../components/tables/BasicTables/BasicTableManageLeave";
import useSWR, { mutate } from "swr";
import { getFetcher, patchFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function ManageLeave() {
  const [messageApi, contextHolder] = message.useMessage();
  //   get Leave list

  const { data: leaveList, isLoading: leaveLoading } = useSWR(
    "api/v1/leave",
    getFetcher
  );

  const { trigger: update } = useSWRMutation("api/v1/leave", (url, { arg }) =>
    patchFetcher(url, arg)
  );
  if (leaveLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleChange = async (value: any, id: number, employee_id: number) => {
    const formData = {
      id: id,
      status: value.target.value,
      employee_id: employee_id,
    };

    try {
      const response = await update(formData as any);
      mutate("api/v1/leave");
      messageApi.open({
        type: "success",
        content: response.message,
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "try Again",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
                  <PageBreadcrumb pageTitle="Manage Leave" />

      <div className=" max-w-full overflow-x-auto">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* <EcommerceMetrics /> */}
          <ComponentCard title="Manage Leave">
            <BasicTableManageLeave
              leaveList={leaveList}
              handleChange={handleChange}
            />
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
