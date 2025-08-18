import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState, useTransition } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { message, Radio } from "antd";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import BasicTableCourseDetailsAdmin from "../../../components/tables/BasicTables/BasicTableCourseDetailsAdmin";

export default function CourseDetails() {
  const navigate = useNavigate();
  // const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  const [formData2, setFormData2] = useState({
    form_id: "",
    fee_structure_info: [],
  });
  const { id } = useParams();

  const {
    data: feesStructure,
    loading: feesStructureLoading,
    error: feesStructureError,
    mutate: refetch,
  } = useSWR(`api/v1/users/admission/${id}`, getFetcher);
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

  const {
    trigger: create2,
    data: paymentCreate,
    error: paymentError,
    isMutating: paymentIsloading,
  } = useSWRMutation("api/v1/payment/create-order", (url, { arg }) =>
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

  // api/v1/payment/create-order
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log("formData2:", formData2);
    const fee_structure_info = feesStructure?.data?.fee_structure_info?.map(
      (item) => ({
        fee_head_id: item.fee_head_id,
        custom_min_amount: enteredAmounts[item.fee_head_id] || 0,
      })
    );

    const finalFormData = {
      form_id: id,
      fee_structure_info,
    };

    // setFormData2(finalFormData);
    console.log("Submitted FormData:", finalFormData);
    startTransition(async () => {
      try {
        const response = await create2(finalFormData);
        messageApi.open({
          type: "success",
          content: response.message,
        });
        refetch();
        window.location.href = response?.data?.payment_page_url;
      } catch (error) {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Try Again",
        });
        console.log("Upload Error:", error);
      }
    });
  };

  // const mutateClick = () => {
  //   mutate();
  // };

  const fees_structure_table = feesStructure?.data?.payments_history;
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Course Details" />
      <div className=" max-w-full overflow-x-auto">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* <EcommerceMetrics /> */}
          {/* <ComponentCard title="Student DashBoard">
            <BasicTableNotice />
          </ComponentCard> */}

          {/* <h1 className="text-gray-800 dark:text-amber-50 text-7xl">{id}</h1> */}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[35%_65%]">
          <div className="space-y-6  ">
            <ComponentCard title="Profile">
              <div className="space-y-6">
                <div className=" font-medium flex justify-center text-gray-500 text-theme-xs dark:text-gray-400 mb-10">
                  <img
                   src={feesStructure?.data?.student_image ? feesStructure?.data?.student_image : "/images/chat/chat.jpg"}
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
                                <div>
                                  <input
                                    disabled={
                                      Number(item?.due_amount) === 0
                                        ? true
                                        : false
                                    }
                                    type="number"
                                    min={item?.min_amount}
                                    max={item?.price}
                                    // value={formData2.fee_structure_info.fee_head_id}
                                    onChange={(e) =>
                                      handleAmountChange(e, item)
                                    }
                                    className="w-32 px-2 py-1 border rounded"
                                  />
                                  {item?.min_amount > 0 &&
                                  item?.due_amount > 0 ? (
                                    <p className="text-xs text-red-300">
                                      {" "}
                                      Minimum to pay {item?.min_amount}
                                    </p>
                                  ) : null}
                                </div>
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
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="space-x-4">
                        <div className="flex flex-wrap justify-center font-bold items-center gap-10">
                          <button
                            disabled={isPending}
                            type="submit"
                            // onClick={mutateClick}
                            className="bg-blue-200 p-4 hover:bg-blue-400 hover:text-gray-100 text-lg rounded-4xl"
                          >
                            {isPending ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              " Click For Payment"
                            )}
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
      </div>
    </>
  );
}
