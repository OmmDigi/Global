import PageMeta from "../../../components/common/PageMeta";
import { useRef, useState, useTransition } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useParams } from "react-router-dom";
import { message, Modal } from "antd";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  getFetcher,
  patchFetcher,
  postFetcher,
  uploadUrl,
} from "../../../api/fatcher";
// import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";
import BasicTableFeesList from "../../../components/tables/studentTable/BasicTableFeesList";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { uploadFiles } from "../../../utils/uploadFile";
import Button from "../../../components/ui/button/Button";
import { Loader2 } from "lucide-react";
import { LATE_FINE, MONTHLY_PAYMENT } from "../../../constant";
// import DatePicker from "react-datepicker";
// import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";

export default function CourseDetails() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const [month, setMonth] = useState<{
    [key: number]: Date | null;
  }>({});

  const [selectedMonths, setSelectedMonths] = useState<Date[]>([]);

  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lateFineDialogOpen, setLateFineDialogOpen] = useState(false);
  const [lateFineAmount, setLateFineAmount] = useState(0);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

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
    (url, { arg }) => patchFetcher(url, arg),
  );
  const { trigger: create2 } = useSWRMutation(
    "api/v1/payment/create-order",
    (url, { arg }) => postFetcher(url, arg),
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

  const proceedWithPayment = (formData: any) => {
    startTransition(async () => {
      try {
        const response = await create2(formData);
        messageApi.open({ type: "success", content: response.message });
        refetch();
        window.location.href = response?.data?.payment_page_url;
      } catch (error: any) {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message ?? "Try Again",
        });
      }
    });
  };

  // api/v1/payment/create-order
  const handleSubmit2 = async (e: any) => {
    e.preventDefault();

    const fee_structure_info: any[] = [];
    let hasMonthlyPayment = false;
    let hasLateFine = false;

    for (const item of feesStructure?.data?.fee_structure_info ?? []) {
      if (item.fee_head_id == LATE_FINE) {
        hasLateFine = true;
      }
      const entireAmount = Number(enteredAmounts[item.fee_head_id] || 0);
      if (entireAmount === 0) continue;

      if (item.fee_head_id == MONTHLY_PAYMENT) {
        if (selectedMonths.length === 0) {
          return messageApi.error(
            "Select at least one month for monthly payment",
          );
        }

        hasMonthlyPayment = true;
        const count = selectedMonths.length;
        const perMonth = Math.floor(entireAmount / count);
        const remainder = entireAmount - perMonth * (count - 1);
        selectedMonths.forEach((m, i) => {
          fee_structure_info.push({
            fee_head_id: item.fee_head_id,
            custom_min_amount: i === count - 1 ? remainder : perMonth,
            month: dayjs(m).format("YYYY-MM"),
          });
        });
      } else {
        fee_structure_info.push({
          fee_head_id: item.fee_head_id,
          custom_min_amount: entireAmount,
          month: month[item.fee_head_id]
            ? dayjs(month[item.fee_head_id]).format("YYYY-MM")
            : null,
        });
      }
    }

    if (fee_structure_info.length == 0) {
      return messageApi.error("You have to pay minium one fee");
    }

    const finalFormData = { form_id: id, fee_structure_info };

    if (hasMonthlyPayment) {
      let totalFine = 0;
      // for (const entry of fee_structure_info.filter(
      //   (f) => f.fee_head_id == MONTHLY_PAYMENT,
      // )) {

      // }

      if (hasLateFine) {
        const monthlyPayments = fee_structure_info.filter(
          (f) => f.fee_head_id == MONTHLY_PAYMENT,
        );

        try {
          const fineRes = await getFetcher(
            `api/v1/payment/check-late-fine?form_id=${id}&${monthlyPayments.map((item) => `pay_month=${item.month}`).join("&")}`,
          );
          const fineAmount = Number(fineRes?.data?.amount ?? 0);
          if (fineAmount > 0) {
            totalFine += fineAmount;
          }
        } catch {
          // proceed if check fails
        }
      }

      if (totalFine > 0) {
        setPendingFormData(finalFormData);
        setLateFineAmount(totalFine);
        setLateFineDialogOpen(true);
        return;
      }
    }

    proceedWithPayment(finalFormData);
  };

  // const mutateClick = () => {
  //   mutate();
  // };
  const admissionFees = feesStructure?.data?.fee_structure_info?.find(
    (item: any) => item.fee_head_id == 3,
  );
  // .filter((price: number | null) => price !== null);

  const bssFees = feesStructure?.data?.fee_structure_info?.find(
    (item: any) => item.fee_head_id === 6,
  );

  const fees_structure_table = feesStructure?.data?.payments_history;

  const paidMonths: string[] = (feesStructure?.data?.payments_history ?? [])
    .filter((p: any) => p.fee_head_id == MONTHLY_PAYMENT)
    .map((p: any) => dayjs(p.month).format("YYYY-MM"));

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

  const updateProfileImage = async (imageUrl: string) => {
    try {
      const response = await patchFetcher(`api/v1/users/profile/image`, {
        image: imageUrl,
      });
      messageApi.success(response.message);
      setPhoto(imageUrl);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
    }
  };

  const handleFileUpload = (e: any, type: string) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (type === "photo") {
          setPhoto(result as any);
        }
      };
      reader.readAsDataURL(file);
      setIsUploading(true);

      uploadFiles({
        url: `${uploadUrl}api/v1/upload/multiple`,
        files: [file],
        folder: "profile_image",
        onUploaded(result) {
          const imageUrl = result[0].url;
          updateProfileImage(imageUrl);
          setIsUploading(false);
        },
        onError() {
          setIsUploading(false);
          messageApi.open({
            type: "error",
            content: "Image upload failed. Please try again.",
          });
        },
      });
    }
  };

  // const handleMonthPickerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };

  return (
    <>
      {contextHolder}
      <Modal
        title="Late Fine Notice"
        open={lateFineDialogOpen}
        onOk={() => {
          setLateFineDialogOpen(false);
          proceedWithPayment(pendingFormData);
        }}
        onCancel={() => setLateFineDialogOpen(false)}
        okText="Proceed"
        cancelText="Cancel"
      >
        <p className="text-gray-700">
          An additional late fine of{" "}
          <span className="font-semibold text-red-500">₹{lateFineAmount}</span>{" "}
          will be charged with your payment.
        </p>
        <p className="text-gray-500 mt-2">Do you wish to proceed?</p>
      </Modal>
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
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
                  have to pay a sum of Rs.{" "}
                  <input
                    type="number"
                    readOnly
                    name="admissionFeeAmount"
                    value={admissionFees?.price ?? 0}
                    className="inline-block w-24 sm:w-28 p-1 border border-gray-300 rounded text-center"
                  />{" "}
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
                    also have to pay a sum of Rs.{" "}
                    <input
                      type="number"
                      readOnly
                      name="bssRegistrationFee"
                      value={bssFees.price}
                      className="inline-block w-24 sm:w-28 p-1 border border-gray-300 rounded text-center"
                    />{" "}
                    only towards BSS Registration Fee within 3 (Three) months
                    after 6 (Six) months of getting Admission for Montessori
                    Teachers' Training Course.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {admissionFees || bssFees ? (
            <div className="flex justify-center px-4">
              <button
                type="submit"
                onClick={submitClick}
                className="w-full sm:w-auto bg-blue-200 px-8 py-3 hover:bg-blue-400 hover:text-gray-100 text-lg font-semibold rounded-full transition-colors"
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
          <h1 className="text-gray-800 dark:text-amber-50 text-xl sm:text-2xl lg:text-3xl mb-5 break-words">
            {feesStructure?.data?.form_name}
          </h1>
          <div className="max-w-full overflow-x-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[35%_65%]">
              <div className="space-y-6  ">
                <ComponentCard title="Profile">
                  <div className="space-y-6">
                    <div className="font-medium relative flex justify-center text-gray-500 text-theme-xs dark:text-gray-400 mb-10">
                      <img
                        src={
                          photo
                            ? photo
                            : feesStructure?.data?.student_image !== ""
                              ? feesStructure?.data?.student_image
                              : "/images/chat/chat.jpg"
                        }
                        // src="/images/chat/chat.jpg"
                        alt="Student Image"
                        className="h-30 w-30 rounded-full"
                      />
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="absolute -z-10 opacity-0"
                        onChange={(e) => handleFileUpload(e, "photo")}
                      />
                    </div>

                    {isUploading && (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" />
                        <p className="text-white text-sm ml-1">Uploading..</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                      <Button
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                      >
                        Upload Image
                      </Button>
                      <Button
                        onClick={() => {
                          window.open(
                            photo
                              ? photo
                              : feesStructure?.data?.student_image !== ""
                                ? feesStructure?.data?.student_image
                                : "/images/chat/chat.jpg",
                          );
                        }}
                        variant="outline"
                      >
                        View Image
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                              feesStructure?.data?.course_fee ?? "0.00",
                            ) -
                              parseFloat(
                                feesStructure?.data?.due_amount ?? "0.00",
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
                    <div>
                      <Label htmlFor="inputTwo">
                        Admission Date : {feesStructure?.data?.admission_date}
                      </Label>
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
                          {feesStructure?.data?.fee_structure_info
                            ?.filter(
                              (item: any) => item.fee_head_id != LATE_FINE,
                            )
                            ?.map((item: any, index: number) => {
                              return (
                                <div key={item.fee_head_id} className="">
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">
                                        {index + 1}. {item.fee_head_name}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-0.5">
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
                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:shrink-0">
                                      {item.fee_head_id == LATE_FINE ? (
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
                                          className="border w-[7.5rem] border-gray-300 dark:border-gray-300 dark:text-gray-200 rounded-md px-2 py-1 text-sm"
                                          autoComplete="off"
                                          placeholderText="Select Month"
                                        />
                                      ) : null}
                                      <div className="w-full sm:w-28">
                                        <input
                                          disabled={
                                            Number(item?.due_amount) === 0
                                              ? true
                                              : false
                                          }
                                          type="number"
                                          min={
                                            item.fee_head_id == MONTHLY_PAYMENT
                                              ? item.min_amount *
                                                Math.max(
                                                  1,
                                                  selectedMonths.length,
                                                )
                                              : item.min_amount
                                          }
                                          max={
                                            item.fee_head_id == MONTHLY_PAYMENT
                                              ? item.min_amount *
                                                Math.max(
                                                  1,
                                                  selectedMonths.length,
                                                )
                                              : item?.due_amount
                                          }
                                          onChange={(e) =>
                                            handleAmountChange(e, item)
                                          }
                                          // value={
                                          //   item.fee_head_id == MONTHLY_PAYMENT
                                          //     ? item.min_amount *
                                          //       Math.max(
                                          //         1,
                                          //         selectedMonths.length,
                                          //       )
                                          //     : undefined
                                          // }
                                          value={
                                            enteredAmounts[item.fee_head_id]
                                          }
                                          placeholder="Amount"
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {item.fee_head_id == MONTHLY_PAYMENT && (
                                    <div className="mt-2 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <DatePicker
                                          selected={null}
                                          onChange={(date: Date | null) => {
                                            if (!date) return;
                                            const formatted =
                                              dayjs(date).format("YYYY-MM");

                                            if (
                                              paidMonths.includes(formatted)
                                            ) {
                                              return messageApi.warning(
                                                `You already paid for "${dayjs(date).format("MMMM")}" month`,
                                              );
                                            }

                                            const already = selectedMonths.some(
                                              (m) =>
                                                dayjs(m).format("YYYY-MM") ===
                                                formatted,
                                            );

                                            if (!already) {
                                              setSelectedMonths((prev) => [
                                                ...prev,
                                                date,
                                              ]);
                                              setEnteredAmounts(
                                                (prev: any) => ({
                                                  ...prev,
                                                  [item.fee_head_id]:
                                                    item.min_amount *
                                                    Math.max(
                                                      1,
                                                      selectedMonths.length + 1,
                                                    ),
                                                }),
                                              );
                                            }
                                          }}
                                          // filterDate={(date) =>
                                          //   !paidMonths.includes(
                                          //     dayjs(date).format("YYYY-MM"),
                                          //   )
                                          // }
                                          dateFormat="MM-yyyy"
                                          showMonthYearPicker
                                          className="border w-[7.5rem] border-gray-300 dark:border-gray-300 dark:text-gray-200 rounded-md px-2 py-1 text-sm"
                                          autoComplete="off"
                                          placeholderText="+ Add Month"
                                        />
                                      </div>
                                      {selectedMonths.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {selectedMonths.map((m, i) => (
                                            <span
                                              key={i}
                                              className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full"
                                            >
                                              {dayjs(m).format("MMM YYYY")}
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setSelectedMonths((prev) =>
                                                    prev.filter(
                                                      (_, idx) => idx !== i,
                                                    ),
                                                  )
                                                }
                                                className="text-blue-500 hover:text-red-500 font-bold leading-none"
                                              >
                                                ×
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <div className="text-xs text-yellow-600 space-y-0.5">
                                        <p>
                                          Min ₹{item.min_amount}/month
                                          {selectedMonths.length > 1 && (
                                            <>
                                              {" "}
                                              · Total min ₹
                                              {item.min_amount *
                                                selectedMonths.length}{" "}
                                              for {selectedMonths.length} months
                                            </>
                                          )}
                                        </p>
                                        {selectedMonths.length > 1 &&
                                          Number(
                                            enteredAmounts[item.fee_head_id],
                                          ) > 0 && (
                                            <p className="text-blue-500">
                                              ≈ ₹
                                              {Math.floor(
                                                Number(
                                                  enteredAmounts[
                                                    item.fee_head_id
                                                  ],
                                                ) / selectedMonths.length,
                                              )}{" "}
                                              per month
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                          <div className="flex justify-center">
                            <button
                              disabled={
                                isPending ||
                                Object.keys(enteredAmounts).length == 0
                              }
                              type="submit"
                              className="w-full disabled:opacity-30 sm:w-auto bg-blue-200 px-6 py-3 hover:bg-blue-400 hover:text-gray-100 text-base sm:text-lg font-bold rounded-full transition-colors"
                            >
                              {isPending ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                              ) : (
                                "Click For Payment"
                              )}
                            </button>
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
