import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import { message, Radio } from "antd";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";
import Input from "../../../components/form/input/InputField";

export default function CourseDetailsAdmin() {
  const [messageApi, contextHolder] = message.useMessage();

  // const [feesStructure, setFeesStructure] = useState("");
  const [enteredAmounts, setEnteredAmounts] = useState<any>({});
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [maxValue, setMaxValue] = useState(0);
  const [formData, setFormData] = useState({
    fee_head_id: "",
    amount: "",
  });
  const { id } = useParams();

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

  // admin payment
  const { trigger: create } = useSWRMutation(
    `api/v1/payment/add`,
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

  const onChange = (e: any) => {
    setPaymentMode(e.target.value);
  };

  const handleSubmit2 = async (e: any) => {
    e.preventDefault();

    const fee_structure_info = feesStructure?.data?.fee_structure_info?.map(
      (item: any) => ({
        fee_head_id: item.fee_head_id,
        custom_min_amount: enteredAmounts[item.fee_head_id] || 0,
      })
    );

    const finalFormData = {
      form_id: id,
      payment_mode: paymentMode,
      payment_details: paymentDetails ? paymentDetails : null,
      fee_structure_info,
    };

    // setFormData2(finalFormData);
    try {
      const response = await create(finalFormData as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      refetch();
      // refatch(`api/v1/admission/${id}`, undefined, { revalidate: true });
      // const response = await getFetcher(`{api/v1/admission/${id}}`);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }

    setEnteredAmounts({});
    setPaymentMode("");
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

  const fees_structure_table = feesStructure?.data?.payments_history;
  return (
    <>
      {contextHolder}
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Course Details" />
      <h1 className="text-gray-800 dark:text-amber-50 text-3xl mb-15">
        {feesStructure?.data?.form_name}
      </h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[35%_65%]">
        <div className="space-y-6  ">
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
                 {feesStructure?.data?.total_discount 
                 ? 
                 <div >
                  <Label htmlFor={`inputTwo`} className={`${
                   Number(feesStructure?.data?.total_discount) === 0
                   ? "dark:text-green-500 text-orange-500"
                   : "dark:text-orange-400 text-orange-500"
                   }` }>
                    Total Discount : {feesStructure?.data?.total_discount}
                  </Label>
                </div>
                      : ""}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6"></div>
            </div>
          </ComponentCard>
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
                    className="w-auto px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
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
        </div>
        <div className="space-y-6 ">
          <ComponentCard title="Fees head">
            <div className="space-y-6">
              <form onSubmit={handleSubmit2} className="space-y-6">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-sm  ">
                  <div className="space-y-6">
                    {/* <div className="text-lg font-bold">
                                  Total Selected Amount: ₹{totalAmount}
                                </div> */}
                    {feesStructure?.data?.fee_structure_info?.map(
                      (item: any, index: number) => {
                        // const isAmountEditable = item?.min_amount < item?.amount;
                        return (
                          <div
                            key={item.fee_head_id}
                            className="flex flex-col "
                          >
                            <div className="flex justify-between gap-1">
                              <label className="flex-1">
                                {index + 1}. {item.fee_head_name}
                              </label>
                              <label className="flex-1">
                                Fees : ₹ {item.price}
                              </label>{" "}
                              <label className="flex-1">
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
                              </label>
                              <div>
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
                                  onChange={(e) => handleAmountChange(e, item)}
                                  className="w-32 px-2 py-1 border rounded"
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
                        );
                      }
                    )}

                    <Radio.Group
                      onChange={onChange}
                      value={paymentMode}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 40,
                      }}
                    >
                      <Radio value="Online" style={{ color: "white" }}>
                        Online
                      </Radio>
                      <Radio value="Cash" style={{ color: "white" }}>
                        Cash
                      </Radio>
                      <Radio value="Cheque" style={{ color: "white" }}>
                        Cheque
                      </Radio>
                    </Radio.Group>
                    {paymentMode === "Online" && (
                      <div className="mt-4">
                        <label className="block mb-1 font-medium">
                          Enter Transaction Number
                        </label>
                        <input
                          type="text"
                          value={paymentDetails}
                          onChange={(e) => setPaymentDetails(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md shadow-sm"
                          placeholder="e.g., qwerteeyejd25534"
                        />
                      </div>
                    )}
                    {paymentMode === "Cash" && (
                      <div className="mt-4">
                        <label className="block mb-1 font-medium">
                          Enter Receipt Number
                        </label>
                        <input
                          type="text"
                          value={paymentDetails}
                          onChange={(e) => setPaymentDetails(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md shadow-sm"
                          placeholder="e.g., 55555"
                        />
                      </div>
                    )}
                    {paymentMode === "Cheque" && (
                      <div className="mt-4">
                        <label className="block mb-1 font-medium">
                          Enter Cheque Number
                        </label>
                        <input
                          type="text"
                          value={paymentDetails}
                          onChange={(e) => setPaymentDetails(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md shadow-sm"
                          placeholder="e.g., CHQ123456"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="space-x-4">
                      <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                        <button
                          type="submit"
                          // onClick={mutateClick}
                          className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                        >
                          Click For Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {/* <button
                onClick={mutateClick}
                className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
              >
                Click
              </button> */}
            </div>
          </ComponentCard>
        </div>
      </div>
      <BasicTableCourseDetailsAdmin
        fees_structure_table={fees_structure_table}
      />
    </>
  );
}
