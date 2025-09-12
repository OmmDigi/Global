import MonthlySalesChart from "../../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import StuffAttandance from "../../../components/ecommerce/StuffAttandance";
import MonthlyIncome from "../../../components/ecommerce/MonthlyIncome";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import Button from "../../../components/ui/button/Button";
import { message } from "antd";
import useSWRMutation from "swr/mutation";

type TeacherRow = {
  id: number;
  course_name: string;
  regular: boolean;
  workshop: boolean;
  extra: string;
};
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();

  // const [data, setData] = useState([
  //   {
  //     id: 1,
  //     name: "Ram",
  //     for_courses: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //     for_workshop: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "b",
  //     for_courses: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //     for_workshop: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "c",
  //     for_courses: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //     for_workshop: [
  //       {
  //         course_id: 2,
  //         course_name: "TEACHERS TRAINING (STT)",
  //         count: 0,
  //       },
  //       {
  //         course_id: 1,
  //         course_name: "TEACHERS TRAINING (MTT)",
  //         count: 0,
  //       },
  //     ],
  //   },
  // ]);

  // /api/v1/attendance/class
  // get Teacher list
  const [submit, setSubmit] = useState(true);
  const [data, setData] = useState<TeacherRow[]>([
    {
      id: 0,
      course_name: "",
      regular: false,
      workshop: false,
      extra: "",
    },
  ]);

  // const { data: teacherList, isLoading: courseLoading } = useSWR(
  //   "api/v1/attendance/class",
  //   getFetcher
  // );
  //     if (courseLoading) {
  //   return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  // }

  // Individual checkbox toggle

  // increment count
  // const handleIncrement = (
  //   user_id: number,
  //   courseId: number,
  //   type: "course" | "workshop"
  // ) => {
  //   setData((prev) =>
  //     prev.map((row) =>
  //       row.id === user_id
  //         ? {
  //             ...row,
  //             [type === "course" ? "for_courses" : "for_workshop"]: row[
  //               type === "course" ? "for_courses" : "for_workshop"
  //             ].map((cls: any) =>
  //               cls.course_id === courseId
  //                 ? { ...cls, count: cls.count + 1 }
  //                 : cls
  //             ),
  //           }
  //         : row
  //     )
  //   );
  // };

  // decrement count
  // const handleDecrement = (
  //   rowId: number,
  //   courseId: number,
  //   type: "course" | "workshop"
  // ) => {
  //   setData((prev) =>
  //     prev.map((row) =>
  //       row.id === rowId
  //         ? {
  //             ...row,
  //             [type === "course" ? "for_courses" : "for_workshop"]: row[
  //               type === "course" ? "for_courses" : "for_workshop"
  //             ].map((cls: any) =>
  //               cls.course_id === courseId && cls.count > 0
  //                 ? { ...cls, count: cls.count - 1 }
  //                 : cls
  //             ),
  //           }
  //         : row
  //     )
  //   );
  // };

  // const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // const toggleDropdown = (id: string) => {
  //   setOpenDropdown(openDropdown === id ? null : id);
  // };
  // get list
  const [hasDashboardPermission, setHasDashboardPermission] = useState(false);
  const [viewTeacherAttendanceTable, setViewTeacherAttendanceTable] =
    useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");
    const permissions = query.get("permissions");

    if (token) {
      localStorage.setItem("token", token);
    }
    if (category) localStorage.setItem("category", category);
    if (permissions) localStorage.setItem("permissions", permissions);

    const localPermissions = localStorage.getItem("permissions");
    if (localPermissions) {
      localPermissions.split(",").forEach((item) => {
        if (item == "1") {
          setHasDashboardPermission(true);
        }
      });
    }

    const localCategory = localStorage.getItem("category");
    if (localCategory) {
      setViewTeacherAttendanceTable(
        localCategory != "Admin" && localCategory != "Stuff"
      );
    }
  }, []);

  const { data: teacherList, isLoading: courseLoading } = useSWR(
    "api/v1/users/class",
    getFetcher,
    {
      isPaused: () => !viewTeacherAttendanceTable,
    }
  );

  useEffect(() => {
    if (teacherList?.data) {
      setData(teacherList.data);
    }
  }, [teacherList]);

  const handleChange = (id: number, field: keyof TeacherRow, value: any) => {
    setSubmit(false);
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const { trigger: update } = useSWRMutation(
    "/api/v1/users/class",
    (url, { arg }) => postFetcher(url, arg)
  );
  if (courseLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleSave = async () => {
    try {
      const response = await update(data as any);
      mutate("api/v1/users/class");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setSubmit(true);
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
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {category == "Admin" ? <MonthlySalesChart /> : null}
          {category == "Admin" ? <StuffAttandance /> : null}
        </div>
        <div className="col-span-12 xl:col-span-5">
          {category == "Admin" ? <MonthlyIncome /> : null}
        </div>
      </div> */}

      {hasDashboardPermission ? (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <MonthlySalesChart />
            <StuffAttandance />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <MonthlyIncome />
          </div>
        </div>
      ) : null}

      {/* for teacher  */}
      {/* <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  WorkShop
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
              {data?.map((order: any) => (
                <TableRow key={order.id}>
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

                  <TableCell>
                    <div className="pl-4 flex flex-col gap-3 relative">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(`course-${order.id}`)}
                          className="px-3 py-2 border rounded-md text-gray-700 dark:text-gray-300 w-full flex justify-between"
                        >
                          Select Class
                          <span className="ml-2">▼</span>
                        </button>
                        <div
                          className={`overflow-hidden ${
                            openDropdown === `course-${order.id}`
                              ? "max-h-[100rem]"
                              : "max-h-0"
                          } mt-1 transition-all duration-500 rounded-md bg-white shadow-lg overflow-y-auto z-10`}
                        >
                          {order.for_courses.map((cls: any, index: number) => (
                            <div
                              key={index}
                              className="overflow-hidden flex justify-between items-center px-3 py-2 hover:bg-gray-100"
                            >
                              <label className="flex items-center gap-2">
                                <span>{cls.course_name}</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleDecrement(
                                      order.id,
                                      cls.course_id,
                                      "course"
                                    )
                                  }
                                  className="px-2 py-0 bg-gray-500 text-white rounded-md"
                                >
                                  -
                                </button>
                                <p>{cls.count}</p>
                                <button
                                  onClick={() =>
                                    handleIncrement(
                                      order.id,
                                      cls.course_id,
                                      "course"
                                    )
                                  }
                                  className="px-2 py-0 bg-gray-500 text-white rounded-md"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="pl-4 flex flex-col gap-3 relative">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(`workshop-${order.id}`)}
                          className="px-3 py-2 border rounded-md text-gray-700 dark:text-gray-300 w-full flex justify-between"
                        >
                          Select Workshop
                          <span className="ml-2">▼</span>
                        </button>

                        <div
                          className={`overflow-hidden ${
                            openDropdown === `workshop-${order.id}`
                              ? "max-h-[100rem]"
                              : "max-h-0"
                          } mt-1 transition-all duration-500 rounded-md bg-white shadow-lg overflow-y-auto z-10`}
                        >
                          {order.for_workshop.map((ws: any, index: number) => (
                            <div
                              key={index}
                              className="overflow-hidden flex justify-between items-center px-3 py-2 hover:bg-gray-100"
                            >
                              <label className="flex items-center gap-2">
                                <span>{ws.course_name}</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleDecrement(
                                      order.id,
                                      ws.course_id,
                                      "workshop"
                                    )
                                  }
                                  className="px-2 py-0 bg-gray-500 text-white rounded-md"
                                >
                                  -
                                </button>
                                <span>{ws.count}</span>
                                <button
                                  onClick={() =>
                                    handleIncrement(
                                      order.id,
                                      ws.course_id,
                                      "workshop"
                                    )
                                  }
                                  className="px-2 py-0 bg-gray-500 text-white rounded-md"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(order.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Save
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:underline">
                        Details
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div> */}
      {viewTeacherAttendanceTable ? (
        <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                    Regular Class
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    WorkShop
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Extra Class
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {teacherList?.data?.map((row: any) => (
                  <TableRow key={row.id}>
                    {/* ID + Name */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                          {row.id}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {row.course_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* ✅ Regular */}
                    <TableCell>
                      <input
                        type="checkbox"
                        defaultChecked={row.regular}
                        onChange={(e) =>
                          handleChange(row.id, "regular", e.target.checked)
                        }
                      />
                    </TableCell>

                    {/* ✅ Workshop */}
                    <TableCell>
                      <input
                        type="checkbox"
                        defaultChecked={row.workshop}
                        // checked={row.workshop}
                        onChange={(e) =>
                          handleChange(row.id, "workshop", e.target.checked)
                        }
                      />
                    </TableCell>

                    {/* ✅ Dropdown */}
                    <TableCell>
                      <select
                        defaultValue={row.extra}
                        onChange={(e) =>
                          handleChange(row.id, "extra", e.target.value)
                        }
                        className="border rounded-md px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className=" items-center gap-2 flex justify-center mt-10">
              <Button
                disabled={submit}
                onClick={handleSave}
                className="text-blue-500 hover:underline"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
