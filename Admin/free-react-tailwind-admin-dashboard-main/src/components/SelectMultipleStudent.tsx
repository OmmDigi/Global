import { useEffect, useRef, useState, useTransition } from "react";
import Button from "./ui/button/Button";
import { useSearchParams } from "react-router";
// import { useNonSelectedFormids } from "../zustand/useNonSelectedFormids";
// import { useSWRConfig } from "swr";
import { useSelectedForms } from "../zustand/useSelectedForms";
import ChooseCourseBatchDialog from "./ChooseCourseBatchDialog";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../api/fatcher";
import { AxiosError } from "axios";
import { message } from "antd";
import useSWR, { mutate } from "swr";
import { Loader } from "lucide-react";

export default function SelectMultipleStudent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSelected, setIsSelected] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const type = useRef<"promote" | "move">("move");

  const { data: selectedForms, clear, addItem } = useSelectedForms();

  const { trigger: changeCourse, isMutating: isChangingCourse } =
    useSWRMutation("api/v1/admission/change-course", (url, { arg }) =>
      putFetcher(url, arg),
    );

  const { trigger: promotStudent, isMutating: isPromotingStudent } =
    useSWRMutation("api/v1/admission/promot", (url, { arg }) =>
      postFetcher(url, arg),
    );

  const { data: admissionList } = useSWR(
    ["api/v1/admission", searchParams.toString()],
    ([url, params]) => {
      // Ensure your fetcher appends the query params correctly
      const fullUrl = params ? `${url}?${params}` : url;
      return getFetcher(fullUrl);
    },
  );

  const onCheckBoxChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;

    if (!checked) {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.delete("limit");
      urlSearchParams.delete("select-all");
      setSearchParams(urlSearchParams);
      return setIsSelected(checked);
    }

    if (!confirm("Are you sure you want to select all ?")) return;

    if (
      !searchParams.has("course") &&
      !searchParams.has("session") &&
      !searchParams.has("batch")
    ) {
      return alert("Please filter admission first");
    }

    setIsSelected(checked);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("limit", "-1");
    urlSearchParams.set("select-all", "true");

    setSearchParams(urlSearchParams);
  };

  const onChooseCourseBatchFormSubmit = async (
    course_id: number,
    batch_id: number,
    session_id: number,
    // admission_date: string,
    // course_starting_month: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to ${type.current === "move" ? '"Move"' : '"Copy"'}? Once you click OK, this action cannot be undone.`,
      )
    )
      return;

    try {
      if (type.current === "move") {
        const response = await changeCourse({
          course_id,
          batch_id,
          session_id,
          form_ids: selectedForms.map((item) => item.form_id),
          // admission_date,
          // course_starting_month,
        } as any);
        messageApi.open({
          type: "success",
          content: response?.message,
        });
      } else {
        const response = await promotStudent({
          course_id,
          batch_id,
          session_id,
          student_ids: selectedForms.map((item) => item.student_id),
          // admission_date,
          // course_starting_month,
        } as any);
        messageApi.open({
          type: "success",
          content: response?.message,
        });
      }
      mutate(["api/v1/admission", searchParams.toString()]);
      clear();
      const urlSearchParams = new URLSearchParams(searchParams);
      // urlSearchParams.delete("limit");
      urlSearchParams.delete("select-all");
      setSearchParams(urlSearchParams);
    } catch (error) {
      const err = error as AxiosError<any>;
      messageApi.open({
        type: "error",
        content: err.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    const isSelectedAll = (searchParams.get("select-all") ?? "false") == "true";
    setIsSelected(isSelectedAll);
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!isSelected) {
      clear();
    }
  }, [isSelected]);

  useEffect(() => {
    if (Array.isArray(admissionList?.data?.admissionData) && isSelected) {
      startTransition(() => {
        addItem(
          admissionList.data.admissionData.map((item: any) => ({
            form_id: item.form_id,
            student_id: item.student_id,
          })),
        );
      });
    }
  }, [admissionList?.data?.admissionData?.length, isSelected]);

  return (
    <>
      <div className="z-50 fixed top-50">{contextHolder}</div>
      {isDialogOpen ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-auto gap-1.5 bg-white p-10 rounded-2xl shadow-2xl">
            <ChooseCourseBatchDialog
              setIsDialogOpen={setIsDialogOpen}
              onFormSubmit={onChooseCourseBatchFormSubmit}
              isFormSubmiting={isChangingCourse || isPromotingStudent}
              type={type.current}
            />
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {isPending ? (
            <Loader className="animate-spin text-white" size={18} />
          ) : (
            <input
              checked={isSelected}
              disabled={isPending}
              id="select-all"
              type="checkbox"
              className="cursor-pointer"
              onChange={onCheckBoxChanged}
            />
          )}

          <label htmlFor="select-all" className="text-white cursor-pointer">
            Select All
          </label>
        </span>

        <div className="space-x-2.5">
          <Button
            onClick={() => {
              type.current = "move";
              setIsDialogOpen(true);
            }}
            disabled={
              selectedForms.length == 0 ||
              isChangingCourse ||
              isPromotingStudent
            }
          >
            Move
          </Button>

          <Button
            onClick={() => {
              type.current = "promote";
              setIsDialogOpen(true);
            }}
            disabled={
              selectedForms.length == 0 ||
              isChangingCourse ||
              isPromotingStudent
            }
          >
            Copy
          </Button>
        </div>
      </div>
    </>
  );
}
