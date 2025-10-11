import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
// import BasicTableBatch from "../../../components/tables/BasicTables/BasicTableBatch";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { Button, message } from "antd";
import useSWR, { mutate } from "swr";
import BasicTableFeeHead from "../../../components/tables/BasicTables/BasicTableFeeHead";

export default function FeesUpdate() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [session, setSession] = useState("");
  const [feeHead, setFeeHead] = useState("");
  const [searchData, setSearchData] = useState<any>({});

  const [previousAmount, setPreviousAmount] = useState("");
  // form data state
  // Define the form data state
  const [formData, setFormData] = useState({
    session_id: "",
    fee_head: "",
    previous_fee: "",
    updated_fee: "",
  });

  //   get session list
  const { data: sessionList, isLoading: sessionLoading } = useSWR(
    "api/v1/course/session?limit=-1&is_active=true",
    getFetcher
  );
  //   get Course list
  // const { data: courseList } = useSWR(
  //   "api/v1/course?is_active=true&fields=id,name",
  //   getFetcher
  // );

  //   get session list
  const { data: fee_head } = useSWR("api/v1/course/fee-head", getFetcher);

  //   create amount
  const { trigger: create } = useSWRMutation(
    "api/v1/admission/amount",
    (url, { arg }) => postFetcher(url, arg)
  );

  //   get amount list
  const { data: amountList, isLoading: amountLoading } = useSWR(
    `api/v1/admission/amount/history?page=${pageCount}`,
    getFetcher
  );

  //   get single data
  // const {
  //   data: editData,
  //   loading: editLoading,
  //   error: editError,
  // } = useSWR(`api/v1/course/batch/${id}`, getFetcher);

  //   get updated data
  const { trigger: update } = useSWRMutation(
    "api/v1/course/batch",
    (url, { arg }) => putFetcher(url, arg)
  );
  if (sessionLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }
  if (amountLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleChildData = (data: any) => {
    setPageCount(data);
  };

  const handleSessionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setSession(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeHeadChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log("value:", value);

    setFeeHead(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    try {
      const response = await getFetcher(
        `/api/v1/admission/amount?session_id=${session}&fee_head_id=${value}`
      );
      setPreviousAmount(response?.data);
      if (!response.success == true) {
        message.error(response.message || "Failed to sync attendance");
        return;
      }
    } catch (error) {
      console.error("Error syncing attendance", error);
    }
    console.log("value:", value);
  };

  const handlePreviousAmountChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: previousAmount,
    }));
  };
  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log("name,value:", name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeHeadFilter = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;
    setFeeHead(value);
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/course/batch");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setFormData({
        session_id: "",
        fee_head: "",
        previous_fee: "",
        updated_fee: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  // const handleActive = async (isActive: boolean, id: number) => {
  //   type UpdateFormPayload = {
  //     id: string | number; // depends on your API, choose one
  //     is_active: boolean;
  //   };
  //   const UpdateFormPayload: UpdateFormPayload = {
  //     id: id,
  //     is_active: isActive,
  //   };
  //   try {
  //     const response = await update(UpdateFormPayload as any);

  //     mutate("api/v1/course/batch");
  //     messageApi.open({
  //       type: "success",
  //       content: response.message,
  //     });
  //   } catch (error: any) {
  //     messageApi.open({
  //       type: "error",
  //       content: error.response?.data?.message,
  //     });
  //   }
  // };

  const payload = {
    session_id: session,
    fee_head_id: feeHead,
    previous_amount: previousAmount,
    current_amount: formData.updated_fee,
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("formData:", formData);

    try {
      const response = await create(payload as any);
      //   mutate(
      //     (currentData: any) => [...(currentData || []), response.data],
      //     false
      //   );
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        session_id: "",
        fee_head: "",
        previous_fee: "",
        updated_fee: "",
      });
      setPreviousAmount("");
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
    }
  };

  const handleFormSearch = async () => {
    if (feeHead) {
      const response = await getFetcher(
        `api/v1/admission/amount/history?fee_head_id=${feeHead}`
      );
      if (response) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        setSearchData(response);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Please Select all Input Fields",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Fees Update" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Fees Update Form">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Session
                    </label>
                    <select
                      name="session_id"
                      value={formData.session_id}
                      onChange={handleSessionChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {sessionList?.data?.map((data: any, index: number) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  {/* <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Courses
                    </label>
                    <select
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {courseList?.data?.map((data: any, index: number) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div> */}
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your fee Head
                    </label>
                    <select
                      name="fee_head"
                      value={formData.fee_head}
                      onChange={(e) => handleFeeHeadChange(e)}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {fee_head?.data?.map((data: any, index: number) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Previous Fee
                    </label>
                    <input
                      readOnly
                      name="previous_fee"
                      value={previousAmount || formData.previous_fee}
                      onChange={handlePreviousAmountChange}
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    ></input>
                  </div>
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Updated Fee
                    </label>
                    <input
                      name="updated_fee"
                      value={formData.updated_fee}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    ></input>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
                    {id ? (
                      <div
                        onClick={handleUpdate}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Update
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-center items-center gap-6 mt-5 ">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">
                  Search Type
                </label>
                <select
                  name="fee_head"
                  value={feeHead}
                  onChange={(e) => handleFeeHeadFilter(e)}
                  className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose</option>
                  {fee_head?.data?.map((data: any, index: number) => (
                    <div key={index}>
                      <option value={data?.id}>{data?.name}</option>
                    </div>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-5">
                <Button type="primary" onClick={handleFormSearch}>
                  Search
                </Button>
              </div>
            </div>
            <BasicTableFeeHead
              amountList={searchData?.data ? searchData : amountList}
              // onEdit={handleEdit}
              // onActive={handleActive}
              onSendData={handleChildData}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
