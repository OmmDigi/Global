import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
// import BasicTableAdmission from "../../../components/tables/BasicTables/BasicTableAdmission";
import DatePicker from "react-datepicker";

import useSWR from "swr";
import { getFetcher, patchFetcher } from "../../../api/fatcher";

import dayjs from "dayjs";
import BasicTableEnquiry from "../../../components/tables/BasicTables/BasicTableEnquiry";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import { useSearchParams } from "react-router";

export default function Enquiry() {
  const [messageApi, contextHolder] = message.useMessage();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  // const [filter, setFilter] = useState("");
  const [startDate, endDate] = dateRange;

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: enquirylist, mutate: mutateEnquiryList } = useSWR(
    `api/v1/users/enquiry?${searchParams.toString()}`,
    getFetcher
  );
  const { trigger: update2 } = useSWRMutation(
    "api/v1/users/enquiry",
    (url, { arg }) => patchFetcher(url, arg)
  );

  const handleStatus = async (id: number, status: any) => {
    type UpdateFormPayload = {
      id: number; // depends on your API, choose one
      status: any;
    };
    const UpdateFormPayload: UpdateFormPayload = {
      id: id,
      status: status,
    };

    try {
      const response = await update2(UpdateFormPayload as any);

      mutateEnquiryList();
      messageApi.open({
        type: "success",
        content: response.message,
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const submitDate = () => {
    if (dateRange[0] !== null && dateRange[1] !== null) {
      setSearchParams({
        from_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        to_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
      });
    }
  };

  const handleEdit = async (id: number) => {
    try {
      jumpToTop();

      const response = await getFetcher(`api/v1/admission/form/${id}`);
      const userData = JSON.parse(response?.data?.admission_details ?? "{}");

      const tempObj: any = {};

      Object.entries(userData).forEach(([key, value]) => {
        tempObj[key] = value;
      });

      tempObj.courseName = response?.data?.course_id;
      tempObj.batchName = response?.data?.batch_id;
      tempObj.sessionName = response?.data?.session_id;
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const jumpToTop = () => {
    window.scrollTo({
      top: 50,
      behavior: "smooth",
    });
  };

  //   const next = () => {
  //     // jumpToTop();
  //     return;
  //     setCurrent(current + 1);
  //   };
  //   const prev = () => {
  //     // jumpToTop();
  //     setCurrent(current - 1);
  //   };

  return (
    <>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Enquiry" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Enquiry">
            {/* form body  */}

            <div className="cursor-pointer text-gray-500 hover:text-gray-500 dark:text-gray-300  flex items-center justify-center gap-5">
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
              <div>
                <button
                  onClick={() => submitDate()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                >
                  Submit
                </button>
              </div>
            </div>

            <BasicTableEnquiry
              enquirylist={enquirylist}
              onEdit={handleEdit}
              onStatus={handleStatus}
              // onSendData={handleChildData}
              //   pageMutate={mutateEnquiryList}
            />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
