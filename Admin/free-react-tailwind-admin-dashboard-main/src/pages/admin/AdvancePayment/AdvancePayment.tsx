import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import useSWR from "swr";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { useState } from "react";
import { message } from "antd";
import Input from "../../../components/form/input/InputField";
import useSWRMutation from "swr/mutation";
import BasicTableLoan from "../../../components/tables/BasicTables/BasicTableLoan";

export default function AdvancePayment() {
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState<"Stuff" | "Teacher" | "">("Stuff");
  const [id, setId] = useState<number>(0);

  const [formData, setFormData] = useState({
    user_id: "",
    total_amount: "",
    monthly_return_amount: "",
  });
  // Function to capture selected role
  const handleRoleChange = (value: "Stuff" | "Teacher") => {
    setRole(value);
    console.log("Selected Role:", value);
  };
  const { data: attandancelist, isLoading: attandanceLoading } = useSWR(
    `/api/v1/users?category=${role}`,
    getFetcher
  );
  const { data: loanlist } = useSWR(
    `api/v1/users/loan?category=${role}`,
    getFetcher
  );

  const { trigger: create } = useSWRMutation(
    "/api/v1/users/loan",
    (url, { arg }) => postFetcher(url, arg)
  );

  if (attandanceLoading) {
    console.log("loading", attandanceLoading);
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form", formData);
    try {
      const response = await create(formData as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);
      setFormData({
        user_id: "",
        total_amount: "",
        monthly_return_amount: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
      console.log("Upload Error:", error);
    }
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle=" Advance Loan/Payment" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Advance Loan/Payment" desc={``}>
            {/* Radio Buttons */}
            <div className="flex justify-center gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Stuff"
                  checked={role === "Stuff"}
                  onChange={() => handleRoleChange("Stuff")}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Staff</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Teacher"
                  checked={role === "Teacher"}
                  onChange={() => handleRoleChange("Teacher")}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Teacher
                </span>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="w-12/12  mb-4">
                  <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                    Choose your{" "}
                    {role === "Stuff"
                      ? "Stuff for Loan"
                      : " Teacher for Advance"}
                  </label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                  >
                    <option value="">Choose</option>
                    {attandancelist?.data?.map((data: any, index: number) => (
                      <div key={index}>
                        <option value={data?.id}>{data?.name}</option>
                      </div>
                    ))}
                  </select>
                </div>
                <div className="w-12/12  mb-4">
                  <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                    Total advance amount
                  </label>
                  <Input
                    type="number"
                    name="total_amount"
                    placeholder="Total advance amount"
                    value={formData.total_amount}
                    onChange={handleChange}
                    className="flex-1 border px-3 py-1 rounded-md"
                  />
                </div>
                <div className="w-12/12  mb-4">
                  <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                    monthly return amount
                  </label>
                  <Input
                    type="number"
                    name="monthly_return_amount"
                    max={formData.total_amount}
                    placeholder="monthly return amount"
                    value={formData.monthly_return_amount}
                    onChange={handleChange}
                    className="flex-1 border px-3 py-1 rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6">
                <div className="flex items-center gap-5">
                  {id ? (
                    <div
                      // onClick={handleUpdate}
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
            <BasicTableLoan attandancelist={loanlist} role={role} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
