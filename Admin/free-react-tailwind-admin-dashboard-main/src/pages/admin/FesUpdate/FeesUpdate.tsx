import { useState, useTransition } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
// import BasicTableBatch from "../../../components/tables/BasicTables/BasicTableBatch";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { Button, message } from "antd";
import useSWR from "swr";
import BasicTableFeeHead from "../../../components/tables/BasicTables/BasicTableFeeHead";
import { LoaderCircle } from "lucide-react";

type SessionType = { session_id: number; session_name: string };
type BatchType = { batch_id: number; month_name: string; session_id: number };

type CourseListType = {
  data: {
    id: number;
    course_name: string;
    session: SessionType[];
    batch: BatchType[];
  }[];
};

type FeeHeadType = {
  id: number;
  name: string;
  is_active: boolean;
};

export default function FeesUpdate() {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageCount, setPageCount] = useState<number>(1);
  const [feeHead, setFeeHead] = useState("");
  const [searchData, setSearchData] = useState<any>({});

  // new states somnath gupta start
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState(0);
  const [currentBatchId, setCurrentBatchId] = useState(0);
  const [sessionFilterList, setSessionFilterList] = useState<SessionType[]>([]);
  const [batchFilterList, setBatchFilterList] = useState<BatchType[]>([]);

  const [feeHeadList, setFeeHeadList] = useState<FeeHeadType[]>([]);

  const [prevAmount, setPrevAmount] = useState<number | null>(null);

  const [isSubmitting, startSubmitting] = useTransition();

  // new states somnath gupta end

  //   get session list
  const { data: fee_head } = useSWR("api/v1/course/fee-head", getFetcher);

  //   create amount
  const { trigger: create } = useSWRMutation(
    "api/v1/admission/amount",
    (url, { arg }) => postFetcher(url, arg)
  );

  //   get amount list
  const { data: amountList } = useSWR(
    `api/v1/admission/amount/history?page=${pageCount}`,
    getFetcher
  );

  const { data: courseList } = useSWR<CourseListType>(
    `api/v1/course/dropdown`,
    getFetcher
  );

  const handleChildData = (data: any) => {
    setPageCount(data);
  };

  const handleFeeHeadFilter = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;
    setFeeHead(value);
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

  const handleCourseDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCourseID = parseInt(event.currentTarget.value);
    setSessionFilterList([]);
    setBatchFilterList([]);

    if (selectedCourseID === 0) return;

    setSelectedCourseId(selectedCourseID);

    // if (selectedCourseID === -1) {
    //   // 'All' option selected
    //   let allSessions: SessionType[] = [];

    //   const alreadyExistSession = new Set<number>();

    //   courseList?.data.forEach((course) => {
    //     course.session.forEach((session) => {
    //       if (!alreadyExistSession.has(session.session_id)) {
    //         alreadyExistSession.add(session.session_id);
    //         allSessions.push(session);
    //       }
    //     });
    //   });

    //   setSessionFilterList(allSessions);
    //   return;
    // }

    const selectedCourse = courseList?.data.find(
      (course) => course.id === selectedCourseID
    );
    const batches = selectedCourse?.batch.filter(
      (batch) => batch.session_id === currentSessionId
    );

    setSessionFilterList(selectedCourse ? selectedCourse.session : []);
    setBatchFilterList(batches ? batches : []);
  };

  const handleSessionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSessionID = parseInt(event.currentTarget.value);
    setBatchFilterList([]);

    if (selectedSessionID === 0) return;

    setCurrentSessionId(selectedSessionID);

    const selectedCourseData = courseList?.data.find(
      (course) => course.id === selectedCourseId
    );

    const batches = selectedCourseData?.batch.filter(
      (batch) => batch.session_id === selectedSessionID
    );

    setBatchFilterList(batches ? batches : []);
  };

  const handleBatchSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedBatchID = parseInt(event.currentTarget.value);
    setCurrentBatchId(selectedBatchID);

    // fetch the fee head list
    try {
      const response = await getFetcher(`api/v1/course/fee-head`);
      setFeeHeadList(response?.data || []);
    } catch (error) {
      message.error("Error fetching fee head list");
    }
  };

  const handleNewFeeHeadChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedFeeHeadID = parseInt(event.currentTarget.value);
    if (selectedFeeHeadID === 0) return;

    // fetch the previous amount
    try {
      const response = await getFetcher(
        `api/v1/admission/amount?fee_head_id=${selectedFeeHeadID}&session_id=${currentSessionId}${
          currentBatchId === -1 ? "" : `&batch_id=${currentBatchId}`
        }&course_id=${selectedCourseId}`
      );
      setPrevAmount(response?.data || null);
    } catch (error) {
      message.error("Error fetching previous amount");
    }
  };

  const handleUpdateFeeHeadForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.batch_id.toString() == "-1") {
      delete data.batch_id;
    }

    startSubmitting(async () => {
      try {
        const response = await create(data as any);
        messageApi.open({
          type: "success",
          content: response.message,
        });
        e.currentTarget.reset();
      } catch (error: any) {
        messageApi.open({
          type: "error",
          content: error.response?.data?.message
            ? error.response?.data?.message
            : "try again ",
        });
      }
    });
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
              <form onSubmit={handleUpdateFeeHeadForm} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose Course
                    </label>
                    <select
                      name="course_id"
                      onChange={handleCourseDropDownChange}
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value={0}>Choose</option>
                      {/* <option value={-1}>All</option> */}
                      {courseList?.data?.map((course) => (
                        <div key={course.id}>
                          <option value={course.id}>
                            {course.course_name}
                          </option>
                        </div>
                      ))}
                    </select>
                  </div>

                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose Session
                    </label>
                    <select
                      name="session_id"
                      onChange={handleSessionSelectChange}
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value={0}>Choose</option>
                      {sessionFilterList?.map((session) => (
                        <div key={session.session_id}>
                          <option value={session.session_id}>
                            {session.session_name}
                          </option>
                        </div>
                      ))}
                    </select>
                  </div>

                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose Batch
                    </label>
                    <select
                      name="batch_id"
                      onChange={handleBatchSelectChange}
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value={0}>Choose</option>
                      <option value={-1}>All</option>
                      {batchFilterList?.map((batch) => (
                        <div key={batch.batch_id}>
                          <option value={batch.batch_id}>
                            {batch.month_name}
                          </option>
                        </div>
                      ))}
                    </select>
                  </div>

                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Fee Head
                    </label>
                    <select
                      name="fee_head_id"
                      onChange={handleNewFeeHeadChange}
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value={0}>Choose</option>
                      {feeHeadList?.map((feeHead) => (
                        <div key={feeHead.id}>
                          <option value={feeHead.id}>{feeHead.name}</option>
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
                      value={prevAmount ?? ""}
                      name="previous_amount"
                      className="w-full px-3 py-3 bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    ></input>
                  </div>

                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Updated Fee
                    </label>
                    <input
                      name="current_amount"
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    ></input>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    {isSubmitting ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>

              {/* <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={previousAmount ?? formData.previous_fee}
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
              </form> */}
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
