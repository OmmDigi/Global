import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTableBatch from "../../../components/tables/BasicTables/BasicTableBatch";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR, { mutate } from "swr";
import MultiSelectName from "../../../components/form/MultiSelectName";

interface Option {
  name: string;
}

export default function Batch() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [options, setOptions] = useState<Option[]>([]);

  const [formData, setFormData] = useState(() => {
    return {
      course_id: "",
      session_id: "",
      month_names: [],
      year: new Date().getFullYear().toString(),
    };
  });

  useEffect(() => {
    if (formData.year !== "") {
      setOptions([
        { name: `JAN - ${formData.year}` },
        { name: `FEB - ${formData.year}` },
        { name: `MAR - ${formData.year}` },
        { name: `APR - ${formData.year}` },
        { name: `MAY - ${formData.year}` },
        { name: `JUN - ${formData.year}` },
        { name: `JULY - ${formData.year}` },
        { name: `AUG - ${formData.year}` },
        { name: `SEPT - ${formData.year}` },
        { name: `OCT - ${formData.year}` },
        { name: `NOV - ${formData.year}` },
        { name: `DEC - ${formData.year}` },
      ]);
    } else {
      setOptions([
        {
          name: "JAN",
        },
        {
          name: "FEB",
        },
        {
          name: "MAR",
        },
        {
          name: "APR",
        },
        {
          name: "MAY",
        },
        {
          name: "JUN",
        },
        {
          name: "JULY",
        },
        {
          name: "AUG",
        },
        {
          name: "SEPT",
        },
        {
          name: "OCT",
        },
        {
          name: "NOV",
        },
        {
          name: "DEC",
        },
      ]);
    }
  }, [formData.year]);

  //   get Course list
  const { data: courseList } = useSWR(
    "api/v1/course?is_active=true&limit=-1",
    getFetcher
  );

  //   get session list
  const { data: sessionList, isLoading: sessionLoading } = useSWR(
    "api/v1/course/session?limit=-1&is_active=true",
    getFetcher
  );

  //   create Batch
  const { trigger: create } = useSWRMutation(
    "api/v1/course/batch",
    (url, { arg }) => postFetcher(url, arg)
  );

  //   get batch list
  const { data: batchList, mutate: mutateBatchList } = useSWR(
    `api/v1/course/batch?page=${pageCount}`,
    getFetcher
  );

  //   get single data
  // const {
  //   data: editData,
  //   loading: editLoading,
  //   error: editError,
  // } = useSWR(`api/v1/course/batch/${id}`, getFetcher);

  //   get updated data
  const { trigger: update } = useSWRMutation(
    "api/v1/course/batch",
    (url, { arg }) => putFetcher(url, arg)
  );
  if (sessionLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }
  if (sessionLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleChildData = (data: any) => {
    setPageCount(data);
  };
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

  const handleUpdate = async () => {
    if (id === 0) {
      messageApi.open({
        type: "error",
        content: "Please select a batch to update",
      });
      return;
    }

    if (formData.month_names.length > 1) {
      messageApi.open({
        type: "error",
        content: "Please select only one Batch Month",
      });
      return;
    }

    const payloadToUpdate: any = {
      id,
      ...formData,
    };

    delete payloadToUpdate.month_names;
    payloadToUpdate["month_name"] = formData.month_names[0];

    try {
      const response = await update(payloadToUpdate as any);
      mutate("api/v1/course/batch");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setFormData({
        course_id: "",
        session_id: "",
        month_names: [],
        year: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleActive = async (isActive: boolean, id: number) => {
    type UpdateFormPayload = {
      id: string | number; // depends on your API, choose one
      is_active: boolean;
    };
    const UpdateFormPayload: UpdateFormPayload = {
      id: id,
      is_active: isActive,
    };
    try {
      const response = await update(UpdateFormPayload as any);

      mutate("api/v1/course/batch");
      messageApi.open({
        type: "success",
        content: response.message,
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create(formData as any);
      mutateBatchList();
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        course_id: "",
        session_id: "",
        month_names: [],
        year: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
      });
    }
  };

  const handleEdit = (id: number) => {
    if (!confirm("Are you sure you want to edit this batch")) return;
    setId(id);
    const editData: any = batchList?.data?.find((data: any) => data?.id === id);
    const yearName = editData?.year ?? "";
    setFormData({
      course_id: editData?.course_id,
      session_id: editData?.session_id,
      month_names:
        yearName !== "" && !editData?.month_name.includes(" - ")
          ? [`${editData?.month_name} - ${yearName}`]
          : ([editData?.month_name] as any),
      year: yearName,
    });

    setOptions([
      {
        name: editData?.month_name,
      },
    ]);
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Batch" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Batch">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Courses
                    </label>
                    <select
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {courseList?.data?.map((data: any, index: number) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Choose your Session
                    </label>
                    <select
                      name="session_id"
                      value={formData.session_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    >
                      <option value="">Choose</option>
                      {sessionList?.data?.map((data: any, index: number) => (
                        <div key={index}>
                          <option value={data?.id}>{data?.name}</option>
                        </div>
                      ))}
                    </select>
                  </div>
                  <div className="w-12/12  mb-4">
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      name="year"
                      type="text"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-gray-100 pl-2.5 pr-2 text-sm hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                    />
                  </div>
                  <div>
                    {/* <Label htmlFor="inputOne">{"S/elect Batch Month"}</Label> */}
                    <MultiSelectName
                      options={options as any}
                      defaultSelected={formData.month_names}
                      label="Select Batch Month"
                      // selectedValues={formData.month_names}
                      onChange={(selected) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          month_names: selected,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
                    {id ? (
                      <div
                        onClick={handleUpdate}
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
            </div>
            <BasicTableBatch
              batchList={batchList}
              onEdit={handleEdit}
              onActive={handleActive}
              onSendData={handleChildData}
              mutateBatchList={mutateBatchList}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
