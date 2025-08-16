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
import BasicTableAttandanceDetails from "../../../components/tables/BasicTables/BasicTableAttandanceDetails";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { PieChart } from "@mui/x-charts/PieChart";
import Chart from "react-google-charts";

export default function StuffAttandancdDetails() {
  const { id } = useParams();
  const [datePicker, setDatePicker] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const onChange: DatePickerProps["onChange"] = (dateString: any) => {
    setDatePicker(dayjs(dateString).format("YYYY-MM"));
    console.log("dateString",dateString);
  };


  const today = new Date();
  const todayDate = dayjs(today).format("YYYY-MM");
  // get Holiday List
  const {
    data: attandanceList,
    loading: attandanceLoading,
    error: attandanceError,
  } = useSWR(
    `api/v1/attendance/${id}?month_year=${datePicker ? datePicker : todayDate}`,
    getFetcher
  );
  if (attandanceLoading) {
    console.log("loading", attandanceLoading);
  }
  console.log("attandanceList", attandanceList);

  const attandanceList_table = attandanceList?.data?.attendance_list;
  const data = [
    ["Task", "Hours per Day"],
    [
      "Present",
      attandanceList?.data?.absent_count
        ? Number(attandanceList?.data?.present_count)
        : 10,
    ],
    [
      "Absent",
      attandanceList?.data?.present_count
        ? Number(attandanceList?.data?.absent_coun)
        : 31,
    ],
  ];

  const options = {
    backgroundColor: "transparent",
    borderRedious: "50%",
    // title: "My Daily Activities",
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    is3D: true, // Enables 3D view
    // slices: {
    //   1: { offset: 0.2 }, // Explodes the second slice
    // },
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  };

  return (
    <>
      {contextHolder}
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Course Details" />
      <h1 className="text-gray-800 dark:text-amber-50 text-3xl mb-15">
        {attandanceList?.data?.name}
      </h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6  ">
          <ComponentCard title="Profile">
            <div className="space-y-6">
              <div className=" font-medium flex justify-between text-gray-500 text-theme-xs dark:text-gray-400 mb-10">
                <div className="flex justify-center items-center ml-20">
                  <img
                    src={
                      attandanceList?.data?.image
                        ? attandanceList?.data?.image
                        : "/images/chat/chat.jpg"
                    }
                    alt="/images/chat/chat.jpg"
                    className="h-40 w-40 rounded-full items-center"
                  />
                </div>
                <div className=" bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Monthly Present/Absent Persent
                      </h3>
                    </div>
                  </div>
                  <div className="relative ">
                    <Chart
                      chartType="PieChart"
                      data={data}
                      options={options}
                      width={"100%"}
                      height={"200px"}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 text-2xl text-gray-500 dark:text-gray-400 ">
                <p>Name : {attandanceList?.data?.name} </p>

                <div>
                  <p>Designation : {attandanceList?.data?.designation} </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 text-2xl text-gray-500 dark:text-gray-400 ">
                <div>
                  <p>Joining Date : {attandanceList?.data?.joining_date} </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 text-2xl text-gray-500 dark:text-gray-400  ">
                <p>
                  Total Leave taken : {attandanceList?.data?.total_taken_leave}
                </p>

                <div>
                  <p>
                    Total Leave Pending :{" "}
                    <span
                      className={`${
                        Number(attandanceList?.data?.total_pending_leave) === 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {attandanceList?.data?.total_pending_leave}
                    </span>{" "}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6"></div>
            </div>
          </ComponentCard>
        </div>
      </div>
      <Space direction="vertical">
        <DatePicker
          onChange={onChange}
          picker="month"
          format="YYYY-MM"
          style={{
            color: "#6B7280", // Tailwind's text-gray-500
            backgroundColor: "#F3F4F6", // Tailwind's bg-gray-100
            borderColor: "#D1D5DB", // Tailwind's border-gray-300
            borderRadius: "0.5rem",
          }}
        />
      </Space>

      <BasicTableAttandanceDetails
        attandanceList_table={attandanceList_table}
      />
    </>
  );
}
