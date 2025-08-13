import PageMeta from "../../../components/common/PageMeta";
import { useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";
import BasicTableManageLeave from "../../../components/tables/BasicTables/BasicTableManageLeave";
import useSWR, { mutate } from "swr";
import { getFetcher,patchFetcher,putFetcher,update } from "../../../api/fatcher";
import { message } from "antd";
import useSWRMutation from "swr/mutation";

export default function ManageLeave() {
    const [messageApi, contextHolder] = message.useMessage();
  //   get Leave list


  const {
    data: leaveList,
    loading: leaveLoading,
    error: leaveError,
  } = useSWR("api/v1/leave", getFetcher);
  if (leaveLoading) {
    return <div>Loading ...</div>;
  }
console.log("leaveList",leaveList);

  const {
    trigger: update,
    data: updateData,
    error: updateError,
    isMutating: updateLoading,
  } = useSWRMutation("api/v1/leave", (url, { arg }) =>
    patchFetcher(url, arg)
  );

    const handleChange =async (value:any,id:number,employee_id:number) => {
    console.log("eeeee",value.target.value);
    const formData = {
        id : id,
        status : value.target.value,
        employee_id:employee_id,
    }

    try {
      const response = await update(formData);
      mutate("api/v1/leave");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);

     
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message ? error.response?.data?.message : "try Again",
      });
      console.log("Upload Error:", error);
    }
 
  };

  return (
    <>
    {contextHolder}
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className=" max-w-full overflow-x-auto">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* <EcommerceMetrics /> */}
          <ComponentCard title="Manage Leave">
            <BasicTableManageLeave leaveList={leaveList} handleChange={handleChange} />
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
