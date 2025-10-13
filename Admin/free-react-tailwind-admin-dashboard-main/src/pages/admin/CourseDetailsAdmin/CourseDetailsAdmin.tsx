import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState, useTransition } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import { message } from "antd";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";
import Input from "../../../components/form/input/InputField";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function CourseDetailsAdmin() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  // const [feesStructure, setFeesStructure] = useState("");
  const [month, setMonth] = useState<{
    [key: number]: Date | null;
  }>({});
  const [enteredAmounts, setEnteredAmounts] = useState<any>("");
  const [enteredBillno, setEnteredBillno] = useState<any>("");
  const [paymentMode, setPaymentMode] = useState<any>("");

  const [selectedDates, setSelectedDates] = useState<{
    [key: number]: Date | null;
  }>({});

  // const [paymentMode, setPaymentMode] = useState("");
  // const [paymentDetails, setPaymentDetails] = useState("");

  const [maxValue, setMaxValue] = useState(0);
  const [formData, setFormData] = useState({
    fee_head_id: "",
    amount: "",
  });
   const [addFormData, setAddFormData] = useState({
    fee_head_id: "",
    amount: "",
  });

  console.log("addFormData",addFormData);
  
  const { id } = useParams();
  const [formId, setFormId] = useState(id);

   const [remarksPopup, setRemarksPopup] = useState<any>({}); // store open state per row
  const [remarksText, setRemarksText] = useState<any>({}); 
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");
    if (token) localStorage.setItem("token", token);
    if (category) localStorage.setItem("category", category);
  }, []);

  //   get Fees head
  const {
    data: feesStructure,
    isLoading: feesStructureLoading,
    mutate: refetch,
  } = useSWR(`api/v1/admission/${id}`, getFetcher);

   const { data: feeHeadList } = useSWR(
    "api/v1/course/fee-head",
    getFetcher
  );
  console.log("feeHeadList",feeHeadList);
  
  //  if(!feesStructure?.data?.student_name){
  //     messageApi.open({
  //         type: "error",
  //         content: "Invalid Forn ID",
  //       });
  //  }
  // admin payment
  const { trigger: create } = useSWRMutation(
    `api/v1/payment/add`,
    (url, { arg }) => postFetcher(url, arg)
  );

   const { trigger: addCreate } = useSWRMutation(
    `api/v1/admission/fee-head`,
    (url, { arg }) => postFetcher(url, arg)
  );
  if (feesStructureLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleBillnoChange = (e: any, item: any) => {
    const value = e.target.value;
    const id = item.fee_head_id;

    setEnteredBillno((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleAmountChange = (e: any, item: any) => {
    const value = e.target.value;
    const id = item.fee_head_id;

    setEnteredAmounts((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handlePaymentType = (e: any, item: any) => {
    const value = e.target.value;
    const id = item.fee_head_id;

    setPaymentMode((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // const onChange = (e: any) => {
  //   setPaymentMode(e.target.value);
  // };
  const FormSearch = (e: any) => {
    const { value } = e.target;
    const split1 = value.split("/");
    const split_value = split1[split1.length - 1];
    setFormId(split_value);
  };

  const handleFormSearch = () => {
    navigate(`/courseDetailsAdmin/${formId}`);
    refetch(`api/v1/admission/${formId}`);
    console.log("formSearch", formId);
  };

  const doPayment = async (dataToSend: any) => {
    try {
      const response = await create(dataToSend);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      refetch();
      setEnteredAmounts("");
      setEnteredBillno("");
      setPaymentMode("");
      // setPaymentDetails("");
      // refatch(`api/v1/admission/${id}`, undefined, { revalidate: true });
      // const response = await getFetcher(`{api/v1/admission/${id}}`);
    } catch (error: any) {
      const err = error as AxiosError<any>;
      if (err.status == 409) {
        if (confirm(error.response?.data?.message)) {
          startTransition(async () => {
            await doPayment({ ...dataToSend, do_continue: true });
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: error.response?.data?.message,
        });
      }
    }
  };

  const handleSubmit2 = (e: any) => {
    e.preventDefault();
    const fee_structure_info = feesStructure?.data?.fee_structure_info?.map(
      (item: any) => ({
        fee_head_id: item.fee_head_id,
        custom_min_amount: enteredAmounts[item.fee_head_id] || 0,
        bill_no: enteredBillno[item.fee_head_id] || null,
        payment_mode: paymentMode[item.fee_head_id] || null,
        month: dayjs(month[item.fee_head_id]).format("YYYY-MM") || null,
        payment_date: selectedDates[item.fee_head_id]
          ? dayjs(selectedDates[item.fee_head_id]).format("YYYY-MM-DD")
          : null,
      })
    );

    const finalFormData = {
      form_id: id,
      // payment_mode: paymentMode,
      // payment_details: paymentDetails ? paymentDetails : null,
      fee_structure_info,
    };

    startTransition(async () => {
      await doPayment(finalFormData as any);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      form_id: id,
      payment_mode: "Discount",
      payment_details: "Discount",
      fee_structure_info: [
        {
          fee_head_id: formData.fee_head_id,
          custom_min_amount: formData.amount,
        },
      ],
    };

    try {
      const response = await create(payload as any);

      messageApi.open({
        type: "success",
        content: response.message,
      });
      refetch();
      setFormData({
        fee_head_id: "",
        amount: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

   const handleAddAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleAddAmountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      form_id: id,
      fee_head_id: addFormData.fee_head_id,
      amount: addFormData.amount,
    };

    try {
      const response = await addCreate(payload as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      refetch();
      setAddFormData({
        fee_head_id: "",
        amount: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };


 // store remarks per row

  // Handle save per row
  const handleRowSave = (item: any) => {
    const fee_structure_info = [{
      fee_head_id: item.fee_head_id,
      // fee_head_name: item.fee_head_name,
      payment_mode: paymentMode[item.fee_head_id] || "",
      bill_no: enteredBillno[item.fee_head_id] || "",
      custom_min_amount: enteredAmounts[item.fee_head_id] || "",
      payment_date: selectedDates[item.fee_head_id] || null,
      month: month[item.fee_head_id] || null,
      payment_details: remarksText[item.fee_head_id] || "",
    }];

    console.log("Saving row payload:", fee_structure_info);
    const finalFormData = {
      form_id: id,
      // payment_mode: paymentMode,
      // payment_details: paymentDetails ? paymentDetails : null,
      fee_structure_info,
    };

    setRemarksPopup((prev: any) => ({ ...prev, [item.fee_head_id]: false }));
    startTransition(async () => {
      await doPayment(finalFormData as any);
    });
  };

  const fees_structure_table = feesStructure?.data?.payments_history;
  return (
    <>
      {contextHolder}
      <PageMeta
        title=" Dashboard Ecommerce Dashboard |  "
        description="This is  Dashboard Ecommerce Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 mb-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg shadow"
      >
        ← Back
      </button>

      <div className="flex justify-center items-center gap-5 ">
        <div>
          <label className="block text-sm text-start text-gray-500 mb-1">
            Search by Form ID
          </label>
          <input
            type="text"
            name="value"
            onChange={FormSearch}
            placeholder=" Form ID"
            className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-white border-gray-500 rounded-md"
          />
        </div>
        <div className="flex py-1 justify-end mt-5">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
            onClick={handleFormSearch}
          >
            Search
          </button>
        </div>
      </div>
      <PageBreadcrumb pageTitle="Course Details" link="admissionAdmin" />
      <h1 className="text-gray-800 dark:text-amber-50 text-3xl mb-15">
        {feesStructure?.data?.form_name}
      </h1>

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-[65%-35%]">
        <ComponentCard title="Profile">
          <div className="space-y-6">
            <div className=" font-medium flex justify-center text-gray-500 text-theme-xs dark:text-gray-400 mb-10">
              <img
                src="/images/chat/chat.jpg"
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
                <Label htmlFor="inputTwo">
                  Email : {feesStructure?.data?.email}{" "}
                </Label>
              </div>
              <div>
                <Label htmlFor="inputTwo">
                  Phone No : {feesStructure?.data?.ph_no}{" "}
                </Label>
              </div>
              <div>
                <Label>Course : {feesStructure?.data?.course_name} </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label htmlFor="inputTwo">
                  Session : {feesStructure?.data?.session_name}{" "}
                </Label>
              </div>
              <div>
                <Label>Batch : {feesStructure?.data?.batch_name} </Label>
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
                  Total Course Duration : {feesStructure?.data?.duration}
                </Label>
              </div>
              {feesStructure?.data?.total_discount ? (
                <div>
                  <Label
                    htmlFor={`inputTwo`}
                    className={`${
                      Number(feesStructure?.data?.total_discount) === 0
                        ? "dark:text-green-500 text-orange-500"
                        : "dark:text-orange-400 text-orange-500"
                    }`}
                  >
                    Total Discount : {feesStructure?.data?.total_discount}
                  </Label>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6"></div>
          </div>
        </ComponentCard>
        <div className="space-y-6 ">
          <ComponentCard title="Discount Section">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputTwo">Choose Fee</Label>
                  <select
                    name="fee_head_id"
                    value={formData.fee_head_id}
                    onChange={(e) => {
                      const selected =
                        feesStructure?.data?.fee_structure_info.find(
                          (opt: any) =>
                            opt.fee_head_id === Number(e.target.value)
                        );
                      setFormData((prev) => ({
                        ...prev,
                        fee_head_id: e.target.value,
                      }));
                      if (selected) setMaxValue(selected.due_amount); // ✅ set max value here
                    }}
                    className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                  >
                    <option value="">Choose</option>
                    {feesStructure?.data?.fee_structure_info?.map(
                      (opt: any, i: number) => (
                        <option key={i} value={opt.fee_head_id}>
                          {opt.fee_head_name}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="inputTwo">Discount Amount</Label>
                  <Input
                    type="number"
                    name="amount"
                    max={`${maxValue}`}
                    placeholder="discount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="flex-1 border px-3 py-1 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </ComponentCard>

          <ComponentCard title="Add extra Fees">
            <form onSubmit={handleAddAmountSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputTwo">Choose Fee</Label>
                  <select
                    name="fee_head_id"
                    value={addFormData.fee_head_id}
                    onChange={(e) => {
                      const selected =
                        feeHeadList?.data?.find(
                          (opt: any) =>
                            opt.id === Number(e.target.value)
                        );
                      setAddFormData((prev) => ({
                        ...prev,
                        fee_head_id: e.target.value,
                      }));
                      if (selected) setMaxValue(selected.due_amount); // ✅ set max value here
                    }}
                    className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                  >
                    <option value="">Choose</option>
                    {feeHeadList?.data?.map(
                      (opt: any, i: number) => (
                        <option key={i} value={opt.id}>
                          {opt.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="inputTwo"> Amount</Label>
                  <Input
                    type="number"
                    name="amount"
                    max={`${maxValue}`}
                    placeholder="Amount"
                    value={addFormData.amount}
                    onChange={handleAddAmountChange}
                    className="flex-1 border px-3 py-1 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </ComponentCard>
          
        </div>
      </div>

      <div className="grid grid-cols-1 mt-2 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Fees head">
            <div className="space-y-1">
              <form onSubmit={handleSubmit2} className="space-y-6">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-sm  ">
                  <div className="space-y-6">
                    {/* <div className="text-lg font-bold">
                                  Total Selected Amount: ₹{totalAmount}
                                </div> */}
                    {feesStructure?.data?.fee_structure_info
                      ?.sort((a: any, b: any) => {
                        if (a.fee_head_id === 4) return 1;
                        if (b.fee_head_id === 4) return -1;
                        return 0;
                      })
                      ?.map((item: any, index: number) => {
                        return (
                          <div
                            key={item.fee_head_id}
                            className="flex flex-col "
                          >
                            <div className="flex justify-between gap-1">
                              <label className="flex-1">
                                {index + 1}. {item.fee_head_name}
                              </label>
                              <div
                                className={`flex-1 flex-col ${
                                  item.fee_head_id == 4 ? " ml-30 " : ""
                                } `}
                              >
                                <div className="flex gap-12 justify-items-center">
                                  <span className="items-start">Fees :</span>
                                  <span className="items-end">
                                    ₹ {item.price}
                                  </span>
                                </div>
                                <div className="flex gap-5 justify-items-center">
                                  <span className="items-start">
                                    Due Fees :
                                  </span>
                                  <span
                                    className={
                                      Number(item?.due_amount) === 0
                                        ? "text-green-500 items-end"
                                        : "text-red-500 items-end"
                                    }
                                  >
                                    ₹ {item.due_amount}
                                  </span>
                                </div>
                              </div>
                              <div className=" mr-1">
                                <select
                                  name="payment_mode"
                                  value={paymentMode[item.fee_head_id] || ""}
                                  onChange={(e) => handlePaymentType(e, item)}
                                  className="w-full px-3 py-2  bg-gray-100  pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                                >
                                  <option value="">Mode</option>
                                  <option value="Online">Online</option>
                                  <option value="Cash">Cash</option>
                                  <option value="Cheque">Cheque</option>
                                </select>
                              </div>
                              {item.fee_head_id == 4 ? (
                                ""
                              ) : (
                                <div className=" mr-2 text-gray-500 flex flex-col dark:text-gray-400">
                                  <DatePicker
                                    selected={
                                      selectedDates[item.fee_head_id] || null
                                    }
                                    onChange={(date: Date | null) => {
                                      setSelectedDates((prev) => ({
                                        ...prev,
                                        [item.fee_head_id]: date,
                                      }));
                                    }}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-25 border rounded px-1 py-1"
                                    placeholderText="Choose date"
                                  />
                                </div>
                              )}
                              <div>
                                {item.fee_head_id == 4 ? (
                                  <div className="flex ">
                                    {/* <select
                                      name="fee_head_id"
                                      onChange={(e) =>
                                        handleMonthChange(e, item)
                                      }
                                      className="w-auto px-3 py-3 mr-2 bg-gray-100 pl-2.5 pr-2 text-sm 
                                          hover:border-gray-200 dark:hover:border-gray-800 
                                           border-gray-600 rounded-md dark:bg-gray-900 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                                          dark:text-gray-300 text-gray-700"
                                    >
                                      <option value="">Choose</option>
                                      {options?.map((opt: any, i: number) => (
                                        <option key={i} value={opt.name}>
                                          {opt.name}
                                        </option>
                                      ))}
                                    </select> */}
                                    <DatePicker
                                      name="fee_head_id"
                                      selected={month[item.fee_head_id] || null}
                                      onChange={(date: Date | null) => {
                                        setMonth((prev) => ({
                                          ...prev,
                                          [item.fee_head_id]: date,
                                        }));
                                      }}
                                      dateFormat="MMMM yyyy"
                                      showMonthYearPicker
                                      className="border w-30  border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-md px-1 py-1 mr-2 mt-1 text-sm"
                                      autoComplete="off"
                                      placeholderText="Select Month"
                                    />
                                    <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                                      <DatePicker
                                        selected={
                                          selectedDates[item.fee_head_id] ||
                                          null
                                        }
                                        onChange={(date: Date | null) => {
                                          setSelectedDates((prev) => ({
                                            ...prev,
                                            [item.fee_head_id]: date,
                                          }));
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-25 border mr-2 rounded px-1 py-1"
                                        placeholderText="Choose date"
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </div>

                              <div>
                                <input
                                  type="text"
                                  value={enteredBillno[item.fee_head_id] || ""}
                                  onChange={(e) => handleBillnoChange(e, item)}
                                  className="w-22 px-2 py-0 mt-1 mr-2 border border-blue-400 rounded"
                                  placeholder="Bill-No"
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  max={item?.due_amount}
                                  value={enteredAmounts[item.fee_head_id] || ""}
                                  onChange={(e) => handleAmountChange(e, item)}
                                  className="w-22 px-2 py-1 border border-amber-400 rounded"
                                  placeholder="Amount"
                                />
                              </div>

                              {/* Individual Save Button */}
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRemarksPopup((prev: any) => ({
                                      ...prev,
                                      [item.fee_head_id]:
                                        !prev[item.fee_head_id],
                                    }))
                                  }
                                  className="bg-green-400 hover:bg-green-500 m-1 text-white px-1 py-1 rounded-md text-xs"
                                >
                                  Remark
                                </button>
                              </div>
                              <div>
                                <button
                                  type="button"
                                  disabled={isPending}
                                  //
                                  onClick={() => handleRowSave(item)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                >
                                  {isPending ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    " Save "
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Popup (inline textarea) */}
                            {remarksPopup[item.fee_head_id] && (
                              <div className="mt-2 ml-8 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <label className="block mb-1 font-medium">
                                  Remarks for {item.fee_head_name}
                                </label>
                                <textarea
                                  rows={3}
                                  value={remarksText[item.fee_head_id] || ""}
                                  onChange={(e) =>
                                    setRemarksText((prev: any) => ({
                                      ...prev,
                                      [item.fee_head_id]: e.target.value,
                                    }))
                                  }
                                  className="w-full border rounded px-3 py-2 text-gray-700 dark:text-gray-200"
                                  placeholder="Enter remarks..."
                                />
                                <div className="mt-2 flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRowSave(item)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                  >
                                    Confirm Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRemarksPopup((prev: any) => ({
                                        ...prev,
                                        [item.fee_head_id]: false,
                                      }))
                                    }
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* {paymentMode === "Online" && ( */}
                    {/* <div className="mt-4">
                      <label className="block mb-1 font-medium">Remarks</label>
                      <textarea
                        rows={3}
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray-400 "
                        placeholder="Remarks"
                      />
                    </div> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 hidden">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="space-x-4">
                      <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                        <button
                          type="submit"
                          disabled={isPending}
                          // onClick={mutateClick}
                          className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                        >
                          {isPending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "  Click For Payment "
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

      <BasicTableCourseDetailsAdmin
        fees_structure_table={fees_structure_table}
        refetch={refetch}
        formId={id}
      />
    </>
  );
}
