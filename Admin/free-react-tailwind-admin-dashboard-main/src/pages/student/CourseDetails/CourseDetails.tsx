import PageMeta from "../../../components/common/PageMeta";
import { useState, useTransition } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useParams } from "react-router-dom";
import { message } from "antd";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getFetcher, patchFetcher, postFetcher } from "../../../api/fatcher";
// import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";
import BasicTableFeesList from "../../../components/tables/studentTable/BasicTableFeesList";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
// import DatePicker from "react-datepicker";
// import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";

export default function CourseDetails() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  const [month, setMonth] = useState<{
    [key: number]: Date | null;
  }>({});

  // const months = useRef<{
  //   monthly_fee_month: string | null;
  //   late_fine_fee_month: string | null;
  // }>({
  //   monthly_fee_month: null,
  //   late_fine_fee_month: null,
  // });

  // const [needToSelectMonth, setNeedSelectMonth] = useState<
  //   "monthly" | "late-fine" | null
  // >("monthly");

  const [enteredAmounts, setEnteredAmounts] = useState<any>({});

  const { id } = useParams();

  const {
    data: feesStructure,
    isLoading: feesStructureLoading,
    mutate: refetch,
  } = useSWR(`api/v1/users/admission/${id}`, getFetcher);

  const { trigger: create } = useSWRMutation(
    "api/v1/admission/accept-declaration-status",
    (url, { arg }) => patchFetcher(url, arg)
  );
  const { trigger: create2 } = useSWRMutation(
    "api/v1/payment/create-order",
    (url, { arg }) => postFetcher(url, arg)
  );
  if (feesStructureLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleAmountChange = (e: any, item: any) => {
    const value = e.target.value;
    const id = item.fee_head_id;

    setEnteredAmounts((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // api/v1/payment/create-order
  const handleSubmit2 = async (e: any) => {
    e.preventDefault();
    const fee_structure_info = feesStructure?.data?.fee_structure_info?.map(
      (item: any) => ({
        fee_head_id: item.fee_head_id,
        custom_min_amount: enteredAmounts[item.fee_head_id] || 0,
        month: month[item.fee_head_id]
          ? dayjs(month[item.fee_head_id]).format("YYYY-MM")
          : null,
      })
    );

    const finalFormData = {
      form_id: id,
      fee_structure_info,
    };

    startTransition(async () => {
      try {
        const response = await create2(finalFormData as any);
        messageApi.open({
          type: "success",
          content: response.message,
        });
        refetch();
        window.location.href = response?.data?.payment_page_url;
      } catch (error: any) {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Try Again",
        });
      }
    });
  };

  // const mutateClick = () => {
  //   mutate();
  // };
  const admissionFees = feesStructure?.data?.fee_structure_info?.find(
    (item: any) => item.fee_head_id == 3
  );
  // .filter((price: number | null) => price !== null);

  const bssFees = feesStructure?.data?.fee_structure_info?.find(
    (item: any) => item.fee_head_id === 6
  );

  const fees_structure_table = feesStructure?.data?.payments_history;

  const submitClick = async () => {
    const newFormDate = { form_id: id };
    try {
      const response = await create(newFormDate as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      refetch();
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
    }
  };

  // const handleMonthPickerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };

  return (
    <>
      {contextHolder}
      <PageMeta
        title=" Dashboard Ecommerce Dashboard |  "
        description="This is  Dashboard Ecommerce Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      {feesStructure?.data?.declaration_status == 0 ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-500 underline mb-8">
              DECLARATION
            </h1>
          </div>

          {/* First Declaration Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              First Declaration - Admission Fee
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-start text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="applicantName1"
                    value={feesStructure?.data?.student_name}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Declaration:</strong> I hereby declare that I will
                  have to pay a sum of Rs.
                  <input
                    type="number"
                    readOnly
                    name="admissionFeeAmount"
                    value={admissionFees?.price ?? 0}
                    // onChange={handleInputChange}
                    className="mx-2 w-30 p-1 border border-gray-300 rounded text-center"
                  />
                  only towards Admission Fee for Montessori Teachers' Training
                  course (6 Months) of
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  within 3 (three) months from the date of getting Admission in
                  the aforesaid Course.
                </p>
              </div>
            </div>
          </div>

          {/* Second Declaration Section */}
          {bssFees ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Second Declaration - BSS Registration Fee
              </h2>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Declaration:</strong> I hereby declare that I will
                    also have to pay a sum of Rs.
                    <input
                      type="number"
                      readOnly
                      name="bssRegistrationFee"
                      value={bssFees.price}
                      // onChange={handleInputChange}
                      className="mx-2 w-30 p-1 border border-gray-300 rounded text-center"
                    />
                    only towards BSS Registration Fee within 3 (Three) months
                    after 6 (Six) months of getting Admission for Montessori
                    Teachers' Training Course.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {admissionFees || bssFees ? (
            <div className="flex justify-center">
              <button
                type="submit"
                onClick={submitClick}
                className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
              >
                I Agree
              </button>
            </div>
          ) : null}
          {/* Signature Section */}
        </div>
      ) : null}

      {feesStructure?.data?.declaration_status == 0 ? null : (
        <>
          <PageBreadcrumb pageTitle="Course Details" />
          <h1 className="text-gray-800 dark:text-amber-50 text-3xl mb-5">
            {feesStructure?.data?.form_name}
          </h1>
          <div className=" max-w-full overflow-x-auto">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[35%_65%]">
              <div className="space-y-6  ">
                <ComponentCard title="Profile">
                  <div className="space-y-6">
                    <div className=" font-medium flex justify-center text-gray-500 text-theme-xs dark:text-gray-400 mb-10">
                      <img
                        src={
                          feesStructure?.data?.student_image
                            ? feesStructure?.data?.student_image
                            : "/images/chat/chat.jpg"
                        }
                        // src="/images/chat/chat.jpg"
                        alt="/images/chat/chat.jpg"
                        className="h-30 w-30 rounded-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                      <div>
                        <Label htmlFor="inputTwo">
                          Name : {feesStructure?.data?.student_name}{" "}
                        </Label>
                      </div>
                      <div>
                        <Label>
                          Course : {feesStructure?.data?.course_name}{" "}
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                      <div>
                        <Label htmlFor="inputTwo">
                          Session : {feesStructure?.data?.session_name}{" "}
                        </Label>
                      </div>
                      <div>
                        <Label>
                          Batch : {feesStructure?.data?.batch_name}{" "}
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                      <div>
                        <Label htmlFor="inputTwo">
                          Total Fees : {feesStructure?.data?.course_fee}
                        </Label>
                      </div>
                      <div>
                        <Label>
                          Due Amount :{" "}
                          <span
                            className={`${
                              Number(feesStructure?.data?.due_amount) === 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {feesStructure?.data?.due_amount}
                          </span>{" "}
                        </Label>
                      </div>

                      <div>
                        <Label htmlFor="inputTwo">
                          Total Paid Fee :{" "}
                          <span className="font-semibold text-green-500">
                            {parseFloat(
                              feesStructure?.data?.course_fee ?? "0.00"
                            ) -
                              parseFloat(
                                feesStructure?.data?.due_amount ?? "0.00"
                              )}
                          </span>
                        </Label>
                      </div>

                      {feesStructure?.data?.total_discount > 0 ? (
                        <div>
                          <Label
                            htmlFor={`inputTwo`}
                            className={`${
                              Number(feesStructure?.data?.total_discount) === 0
                                ? "dark:text-green-500 text-orange-500"
                                : "dark:text-orange-400 text-orange-500"
                            }`}
                          >
                            Total Discount :{" "}
                            {feesStructure?.data?.total_discount}
                          </Label>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-6"></div>
                  </div>
                </ComponentCard>
              </div>
              <div className="space-y-6 ">
                <ComponentCard title="Fees head">
                  <div className="space-y-6">
                    <form onSubmit={handleSubmit2} className="space-y-6">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-sm  ">
                        <div className="space-y-6">
                          {feesStructure?.data?.fee_structure_info?.map(
                            (item: any, index: number) => {
                              return (
                                <div
                                  key={item.fee_head_id}
                                  className="flex flex-col"
                                >
                                  <div className="flex flex-wrap md:flex-nowrap gap-2.5">
                                    <div className="flex-1">
                                      <p className="flex-1">
                                        {index + 1}. {item.fee_head_name}
                                      </p>
                                      <div className="flex items-center gap-3.5 text-sm text-gray-400">
                                        <p>Fees : ₹ {item.price}</p>{" "}
                                        <p>
                                          Due Fees : ₹{" "}
                                          <span
                                            className={`${
                                              Number(item?.due_amount) === 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                            }`}
                                          >
                                            {item.due_amount}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="w-full md:w-auto flex items-center gap-2.5">
                                      {item.fee_head_id == 4 ||
                                      item.fee_head_id == 5 ? (
                                        <DatePicker
                                          name="fee_head_id"
                                          selected={
                                            month[item.fee_head_id] || null
                                          }
                                          onChange={(date: Date | null) => {
                                            setMonth((prev) => ({
                                              ...prev,
                                              [item.fee_head_id]: date,
                                            }));
                                          }}
                                          dateFormat="MM-yyyy"
                                          showMonthYearPicker
                                          className="border w-30 border-gray-300 dark:border-gray-300 dark:text-gray-200 rounded-md px-1 py-1 mr-2 mt-1 text-sm"
                                          autoComplete="off"
                                          placeholderText="Select Month"
                                        />
                                      ) : null}
                                      <div className="flex-1">
                                        <input
                                          disabled={
                                            Number(item?.due_amount) === 0
                                              ? true
                                              : false
                                          }
                                          type="number"
                                          min={1}
                                          max={item?.price}
                                          // value={formData2.fee_structure_info.fee_head_id}
                                          onChange={(e) =>
                                            handleAmountChange(e, item)
                                          }
                                          placeholder="Amount"
                                          className="px-2 py-1 border rounded"
                                        />
                                        {/* {item?.min_amount > 0 &&
                                        item?.due_amount > 0 ? (
                                          <p className="text-xs text-red-300">
                                            {" "}
                                            Minimum to pay {item?.min_amount}
                                          </p>
                                        ) : null} */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                          <div className="space-x-4">
                            <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                              <button
                                disabled={isPending}
                                type="submit"
                                className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                              >
                                {isPending ? (
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  "Click For Payment"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </ComponentCard>
              </div>
            </div>
            <BasicTableFeesList fees_structure_table={fees_structure_table} />
          </div>
        </>
      )}
    </>
  );
}
