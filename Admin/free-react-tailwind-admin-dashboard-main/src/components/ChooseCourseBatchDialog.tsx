import React, { ChangeEvent, useState } from "react";
import useSWR from "swr";
import { getFetcher } from "../api/fatcher";
import Button from "./ui/button/Button";
import { Loader } from "lucide-react";

interface IProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFormSubmit: (
    course_id: number,
    batch_id: number,
    session_id: number
  ) => void;
  isFormSubmiting?: boolean;
}

export default function ChooseCourseBatchDialog({
  setIsDialogOpen,
  onFormSubmit,
  isFormSubmiting,
}: IProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  // const [changeSession, setChangeSession] = useState<any>(0);
  const [formData, setFormData] = useState({
    courseName: "",
    sessionName: "",
    batchName: "",
  });

  // get Course list
  const { data: courseList } = useSWR(`api/v1/course/dropdown`, getFetcher);

  //   const { data: feeHeadList } = useSWR(`api/v1/course/fee-head`, getFetcher);

  const handleCourseChange = (e: any) => {
    const { name, value } = e.target;
    // setCourse(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const courseId = parseInt(e.target.value);

    setSelectedCourseId(courseId as any);
  };

  const handleSessionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // setChangeSession(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // setBatch(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedCourse = Array.isArray(courseList?.data)
    ? courseList?.data?.find((course: any) => course.id == selectedCourseId)
    : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (onFormSubmit) {
          onFormSubmit(
            parseInt(formData.courseName),
            parseInt(formData.batchName),
            parseInt(formData.sessionName)
          );
        }
      }}
    >
      <div className="mb-4">
        <label className="block text-lg font-bold text-gray-700 mb-1">
          Choose your Courses <span className="text-red-500">*</span>
        </label>
        <select
          name="courseName"
          value={formData.courseName}
          onChange={handleCourseChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Option</option>
          {courseList?.data?.map((data: any, index: number) => (
            <option key={index} value={`${data?.id}`}>
              {data?.course_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-10">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Choose your Session <span className="text-red-500">*</span>
          </label>
          <select
            name="sessionName"
            // disabled={id ? true : false}
            defaultValue={formData.sessionName}
            onChange={handleSessionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Option</option>

            {selectedCourse?.session?.map((session: any, index: number) => (
              <option key={index} value={`${session?.session_id}`}>
                {session.session_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Choose your Batch <span className="text-red-500">*</span>
          </label>
          <select
            name="batchName"
            // disabled={id ? true : false}
            defaultValue={formData.batchName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Option</option>
            {selectedCourse?.batch
              ?.filter((batch: any) => batch.session_id == formData.sessionName)
              .map((batch: any, index: number) => (
                <option key={index} value={`${batch.batch_id}`}>
                  {batch.month_name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button disabled={isFormSubmiting}>
          {isFormSubmiting ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          type="button"
          disabled={isFormSubmiting}
          onClick={() => setIsDialogOpen(false)}
          variant="outline"
          className="!text-white hover:!text-black"
        >
          Close
        </Button>
      </div>
    </form>
  );
}
