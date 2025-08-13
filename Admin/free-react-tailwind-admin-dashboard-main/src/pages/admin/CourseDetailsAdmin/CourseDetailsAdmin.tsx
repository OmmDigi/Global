import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { Link, useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { message, Radio, RadioChangeEvent } from "antd";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import BasicTableCourses from "../../../components/tables/studentTable/BasicTableCourses";
import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";
const style: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  gap: 40,
  fontSize: "16px",
};

export default function CourseDetailsAdmin() {
  const [messageApi, contextHolder] = message.useMessage();

  // const [feesStructure, setFeesStructure] = useState("");
  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  const [formData2, setFormData2] = useState({
    form_id: "",
    payment_mode: "",
    payment_details: "",
    fee_structure_info: [],
  });
  const { id } = useParams();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");
    if (token) localStorage.setItem("token", token);
    if (category) localStorage.setItem("category", category);

    console.log("Token:", window.location.search);
    console.log("Category:", category);
  }, []);

  //   get Fees head
  const {
    data: feesStructure,
    loading: feesStructureLoading,
    error: feesStructureError,
    mutate: refetch,
  } = useSWR(`api/v1/admission/${id}`, getFetcher);
  if (feesStructureLoading) {
    return <div>Loading ...</div>;
  }
  console.log("feesStructure", feesStructure);

  // admin payment
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation(`api/v1/payment/add`, (url, { arg }) =>
    postFetcher(url, arg)
  );

  const handleAmountChange = (e, item) => {
    const value = e.target.value;
    const id = item.fee_head_id;

    setEnteredAmounts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleSubmit2 = async (e: any) => {
    e.preventDefault();

    const fee_structure_info = feesStructure?.data?.fee_structure_info?.map(
      (item) => ({
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
    console.log("Submitted FormData:", finalFormData);
    try {
      const response = await create(finalFormData);
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
      console.log("Upload Error:", error);
    }

    setEnteredAmounts({});
    setPaymentMode("");
  };

  // const mutateClick = () => {
  //   mutate();
  // };

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
                    {/* <div className="text-lg font-bold">
                                  Total Selected Amount: ₹{totalAmount}
                                </div> */}
                    {feesStructure?.data?.fee_structure_info?.map(
                      (item, index) => {
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
                              <input
                              disabled={Number(item?.due_amount) === 0 ? true : false}
                                type="number"
                                // value={formData2.fee_structure_info.fee_head_id}
                                onChange={(e) => handleAmountChange(e, item)}
                                className="w-32 px-2 py-1 border rounded"
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                    {/* <Radio.Group
                      style={{ ...style, color: "red" }}
                      onChange={onChange}
                      value={paymentMode}
                      options={[
                        { value: "Online", label: "Online" },
                        { value: "Cash", label: "Cash" },
                        { value: "Cheque", label: "Cheque" },
                      ]}
                    /> */}
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
                          Enter Tranjuction Number
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
