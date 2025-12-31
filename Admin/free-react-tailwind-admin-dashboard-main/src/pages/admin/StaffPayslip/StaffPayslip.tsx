import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";

import useSWR from "swr";
import { getFetcher } from "../../../api/fatcher";
import dayjs from "dayjs";
import BasicTablePayslip from "../../../components/tables/BasicTables/BasicTablePayslip";
import { useState } from "react";

export default function StaffPayslip() {
  const [role, setRole] = useState<"Stuff" | "Teacher" | "">("Stuff");
  const today = new Date();
  // Function to capture selected role
  const handleRoleChange = (value: "Stuff" | "Teacher") => {
    setRole(value);
  };
  const {
    data: attandancelist,
    isLoading: attandanceLoading,
    error: attandanceError,
  } = useSWR(
    `api/v1/users/payslip?category=${role}&month=${dayjs(today).format(
      "YYYY-MM"
    )}`,
    getFetcher
  );

  if (attandanceLoading) {
    console.log("loading", attandanceLoading);
  }
  if (attandanceError) {
    console.log("stuffError", attandanceError);
  }

  return (
    <div>
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle=" Payslip" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title=" Payslip" desc={``}>
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
            <BasicTablePayslip attandancelist={attandancelist} role={role} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
