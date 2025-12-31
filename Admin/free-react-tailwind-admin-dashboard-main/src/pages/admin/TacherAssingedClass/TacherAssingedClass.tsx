import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import useSWR from "swr";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import Label from "../../../components/form/Label";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

type Course = {
  id: number;
  course_name: string;
  regular: boolean;
  workshop: boolean;
  extra: string;
};

type TeacherRow = {
  id: number;
  for_courses: Course[];
};
export default function TacherAssingedClass() {
  const [messageApi, contextHolder] = message.useMessage();
  const [submit, setSubmit] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [data, setData] = useState<TeacherRow[]>([]);

  // for getting list
  const {
    data: teacherList,
    isLoading: courseLoading,
    mutate: triggerGet,
  } = useSWR(
    `api/v1/attendance/class?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`,
    getFetcher
  );

  useEffect(() => {
    if (teacherList?.data) {
      setData(teacherList.data);
    }
  }, [teacherList]);

  useEffect(() => {
    triggerGet(
      `api/v1/attendance/class?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`
    );
  }, [selectedDate]);

  // for save data
  const { trigger: update } = useSWRMutation(
    `api/v1/attendance/class?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`,
    (url, { arg }) => postFetcher(url, arg)
  );
  if (courseLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  // increment count
  //   const handleIncrement = (
  //     user_id: number,
  //     courseId: number,
  //     type: "course" | "workshop"
  //   ) => {
  //     setData((prev) =>
  //       prev.map((row) =>
  //         row.id === user_id
  //           ? {
  //               ...row,
  //               [type === "course" ? "for_courses" : "for_workshop"]: row[
  //                 type === "course" ? "for_courses" : "for_workshop"
  //               ].map((cls: any) =>
  //                 cls.course_id === courseId
  //                   ? { ...cls, count: cls.count + 1 }
  //                   : cls
  //               ),
  //             }
  //           : row
  //       )
  //     );
  //   };

  // decrement count
  //   const handleDecrement = (
  //     rowId: number,
  //     courseId: number,
  //     type: "course" | "workshop"
  //   ) => {
  //     setData((prev) =>
  //       prev.map((row) =>
  //         row.id === rowId
  //           ? {
  //               ...row,
  //               [type === "course" ? "for_courses" : "for_workshop"]: row[
  //                 type === "course" ? "for_courses" : "for_workshop"
  //               ].map((cls: any) =>
  //                 cls.course_id === courseId && cls.count > 0
  //                   ? { ...cls, count: cls.count - 1 }
  //                   : cls
  //               ),
  //             }
  //           : row
  //       )
  //     );
  //   };

  const handleChange = (
    teacherId: number,
    courseId: number,
    field: keyof Course,
    value: any
  ) => {
    setSubmit(teacherId);

    setData((prev) => {
      const updated = prev.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              for_courses: teacher.for_courses.map((course) =>
                course.id === courseId ? { ...course, [field]: value } : course
              ),
            }
          : teacher
      );

      return updated;
    });
  };

  // Save only that teacher’s row
  const handleSave = async (teacherId: number) => {
    const updatedTeacher = data.find((teacher) => teacher.id === teacherId);

    try {
      const response = await update(updatedTeacher as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setSubmit(0);
      // setData([]);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  return (
    <>
      {contextHolder}
      {/* for teacher  */}

      <PageMeta
        title=" Dashboard Ecommerce Dashboard |  "
        description="This is  Dashboard Ecommerce Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Teacher Assinged Class" />

      <div className="flex justify-center flex-col items-center mb-10">
        <Label> Date</Label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          dateFormat="dd/MM/yyyy"
          className="border rounded-md px-2 py-1 text-lg dark:bg-gray-800 dark:text-white "
          calendarClassName="!bg-white dark:!bg-gray-200"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Teacher name
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Class
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {teacherList?.data?.map((order: any) => (
                <TableRow key={order.id} className="py-10">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.id}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      {order?.for_courses?.map((row: any) => (
                        <div className="flex justify-around gap-10 py-1">
                          <div className="flex flex-col justify-center items-start w-40">
                            {/* <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                            {row.id}
                          </div> */}
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {row.course_name}
                              </span>
                            </div>
                          </div>

                          {/* ✅ Regular */}
                          <div className="flex flex-col justify-end">
                            <Label>Regular Class</Label>
                            <input
                              type="checkbox"
                              defaultChecked={row.regular}
                              onChange={(e) =>
                                handleChange(
                                  order.id,
                                  row.id,
                                  "regular",
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          {/* ✅ Workshop */}
                          <div className="flex flex-col justify-end">
                            <Label>Workshop</Label>
                            <input
                              type="checkbox"
                              defaultChecked={row.workshop}
                              onChange={(e) =>
                                handleChange(
                                  order.id,
                                  row.id,
                                  "workshop",
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          {/* ✅ Dropdown */}
                          <div className="flex flex-col justify-end">
                            <Label>Extra Class</Label>
                            <select
                              defaultValue={row.extra}
                              onChange={(e) =>
                                handleChange(
                                  order.id,
                                  row.id,
                                  "extra",
                                  e.target.value
                                )
                              }
                              className="border rounded-md px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            >
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={submit === order.id ? false : true}
                        onClick={() => handleSave(order.id)}
                        className={`text-blue-500 text-lg font-bold  ${
                          submit === order.id
                            ? "hover:scale-120"
                            : "text-gray-500 cursor-not-allowed "
                        } hover:underline`}
                      >
                        Save
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
