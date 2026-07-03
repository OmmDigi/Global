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

type FeeHeadRowType = {
  fee_head_id: number;
  fee_head_name: string;
  prev_amount: number | null;
  prev_min_amount: number | null;
  current_amount: string;
  current_min_amount: string;
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
  const [allFeeHeadRows, setAllFeeHeadRows] = useState<FeeHeadRowType[]>([]);

  const [isSubmitting, startSubmitting] = useTransition();

  // new states somnath gupta end

  //   get session list
  const { data: fee_head } = useSWR("api/v1/course/fee-head", getFetcher);

  //   create amount
  const { trigger: create } = useSWRMutation(
    "api/v1/admission/amount",
    (url, { arg }) => postFetcher(url, arg),
  );

  //   get amount list
  const { data: amountList } = useSWR(
    `api/v1/admission/amount/history?page=${pageCount}`,
    getFetcher,
  );

  const { data: courseList } = useSWR<CourseListType>(
    `api/v1/course/dropdown`,
    getFetcher,
  );

  const handleChildData = (data: any) => {
    setPageCount(data);
  };

  const handleFeeHeadFilter = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { value } = e.target;
    setFeeHead(value);
  };

  const handleFormSearch = async () => {
    if (feeHead) {
      const response = await getFetcher(
        `api/v1/admission/amount/history?fee_head_id=${feeHead}`,
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
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedCourseID = parseInt(event.currentTarget.value);
    setSessionFilterList([]);
    setBatchFilterList([]);
    setFeeHeadList([]);
    setAllFeeHeadRows([]);

    if (selectedCourseID === 0) return;

    setSelectedCourseId(selectedCourseID);

    const selectedCourse = courseList?.data.find(
      (course) => course.id === selectedCourseID,
    );
    const batches = selectedCourse?.batch.filter(
      (batch) => batch.session_id === currentSessionId,
    );

    setSessionFilterList(selectedCourse ? selectedCourse.session : []);
    setBatchFilterList(batches ? batches : []);
  };

  const handleSessionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedSessionID = parseInt(event.currentTarget.value);
    setBatchFilterList([]);
    setFeeHeadList([]);
    setAllFeeHeadRows([]);

    if (selectedSessionID === 0) return;

    setCurrentSessionId(selectedSessionID);

    const selectedCourseData = courseList?.data.find(
      (course) => course.id === selectedCourseId,
    );

    const batches = selectedCourseData?.batch.filter(
      (batch) => batch.session_id === selectedSessionID,
    );

    setBatchFilterList(batches ? batches : []);
  };

  // fetch every fee head's amount for this course/session/batch, keyed by fee head
  const fetchAllFeeHeadAmounts = async (
    heads: FeeHeadType[],
    batchId: number,
  ) => {
    try {
      const response = await getFetcher(
        `api/v1/admission/amount?session_id=${currentSessionId}${
          batchId === -1 ? "" : `&batch_id=${batchId}`
        }&course_id=${selectedCourseId}`,
      );

      const priceByFeeHead = new Map<
        number,
        { amount: number; min_amount: number }
      >();
      (response?.data || []).forEach((item: any) => {
        priceByFeeHead.set(Number(item.fee_head_id), {
          amount: Number(item.amount),
          min_amount: Number(item.min_amount),
        });
      });

      setAllFeeHeadRows(
        heads.map((head) => {
          const prev = priceByFeeHead.get(head.id);
          return {
            fee_head_id: head.id,
            fee_head_name: head.name,
            prev_amount: prev?.amount ?? null,
            prev_min_amount: prev?.min_amount ?? null,
            current_amount: prev?.amount != null ? String(prev.amount) : "",
            current_min_amount:
              prev?.min_amount != null ? String(prev.min_amount) : "",
          };
        }),
      );
    } catch (error) {
      message.error("Error fetching fee head amount list");
    }
  };

  const handleBatchSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedBatchID = parseInt(event.currentTarget.value);
    setCurrentBatchId(selectedBatchID);
    setAllFeeHeadRows([]);

    if (selectedBatchID === 0) {
      setFeeHeadList([]);
      return;
    }

    try {
      const response = await getFetcher(`api/v1/course/fee-head`);
      const heads: FeeHeadType[] = response?.data || [];
      setFeeHeadList(heads);
      await fetchAllFeeHeadAmounts(heads, selectedBatchID);
    } catch (error) {
      message.error("Error fetching fee head list");
    }
  };

  const handleAllFeeHeadRowChange = (
    feeHeadId: number,
    field: "current_amount" | "current_min_amount",
    value: string,
  ) => {
    setAllFeeHeadRows((prev) =>
      prev.map((row) =>
        row.fee_head_id === feeHeadId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const submitAllFeeHeadRows = (mode: "save" | "update") => {
    const confirmMessage =
      mode === "update"
        ? "Are you sure you want to update? This will only update students who already have that fee head and will create nothing new."
        : "Are you sure you want to save? This will update every changed fee head below and also create it for any student/form who doesn't have it yet.";

    if (!confirm(confirmMessage)) return;

    // submit only rows whose amount was entered/changed from the previous value
    const rowsToSave = allFeeHeadRows.filter((row) => {
      if (row.current_amount === "") return false;
      const newAmount = Number(row.current_amount);
      const newMinAmount = Number(
        row.current_min_amount || row.current_amount,
      );
      return (
        newAmount !== (row.prev_amount ?? null) ||
        newMinAmount !== (row.prev_min_amount ?? null)
      );
    });

    if (rowsToSave.length === 0) {
      messageApi.open({
        type: "error",
        content: "Enter a new amount for at least one fee head",
      });
      return;
    }

    startSubmitting(async () => {
      try {
        for (const row of rowsToSave) {
          const payload: Record<string, any> = {
            session_id: currentSessionId,
            course_id: selectedCourseId,
            fee_head_id: row.fee_head_id,
            previous_amount: row.prev_amount ?? 0,
            previous_min_amount: row.prev_min_amount ?? 0,
            current_amount: Number(row.current_amount),
            current_min_amount: Number(
              row.current_min_amount || row.current_amount,
            ),
            mode,
          };
          if (currentBatchId !== -1) payload.batch_id = currentBatchId;

          await create(payload as any);
        }

        messageApi.open({
          type: "success",
          content: "Fee head amounts successfully updated",
        });

        const savedFeeHeadIds = new Set(
          rowsToSave.map((row) => row.fee_head_id),
        );

        setAllFeeHeadRows((prev) =>
          prev.map((row) =>
            savedFeeHeadIds.has(row.fee_head_id)
              ? {
                  ...row,
                  prev_amount: Number(row.current_amount),
                  prev_min_amount: Number(
                    row.current_min_amount || row.current_amount,
                  ),
                }
              : row,
          ),
        );
      } catch (error: any) {
        console.log("Error ", error);
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
                </div>

                {feeHeadList.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      <thead className="bg-gray-100 dark:bg-gray-900">
                        <tr>
                          <th className="px-3 py-2">Fee Head</th>
                          <th className="px-3 py-2">Previous Amount</th>
                          <th className="px-3 py-2">Previous Min Amount</th>
                          <th className="px-3 py-2">New Amount</th>
                          <th className="px-3 py-2">New Min Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allFeeHeadRows.map((row) => (
                          <tr
                            key={row.fee_head_id}
                            className="border-t border-gray-200 dark:border-gray-700"
                          >
                            <td className="px-3 py-2">{row.fee_head_name}</td>
                            <td className="px-3 py-2">
                              {row.prev_amount ?? "-"}
                            </td>
                            <td className="px-3 py-2">
                              {row.prev_min_amount ?? "-"}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                value={row.current_amount}
                                onChange={(e) =>
                                  handleAllFeeHeadRowChange(
                                    row.fee_head_id,
                                    "current_amount",
                                    e.target.value,
                                  )
                                }
                                className="w-28 px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                value={row.current_min_amount}
                                onChange={(e) =>
                                  handleAllFeeHeadRowChange(
                                    row.fee_head_id,
                                    "current_min_amount",
                                    e.target.value,
                                  )
                                }
                                className="w-28 px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {feeHeadList.length > 0 && (
                  <>
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 text-center">
                      <span>⚠</span>
                      <span>
                        <strong>Save</strong> updates every changed fee head
                        above and also creates it for any student who doesn't
                        have it yet. <strong>Update</strong> only changes
                        students who already have that fee head and creates
                        nothing new.
                      </span>
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        disabled={isSubmitting}
                        type="button"
                        onClick={() => submitAllFeeHeadRows("save")}
                        title="Update existing fee heads and create this fee head for students who don't have it yet"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        {isSubmitting ? (
                          <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="button"
                        onClick={() => submitAllFeeHeadRows("update")}
                        title="Only update students who already have this fee head, don't create it for anyone else"
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        {isSubmitting ? (
                          <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
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
