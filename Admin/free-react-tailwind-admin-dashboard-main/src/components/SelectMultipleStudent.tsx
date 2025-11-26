import { useEffect, useState, useTransition } from "react";
import Button from "./ui/button/Button";
import { useSearchParams } from "react-router";
// import { useNonSelectedFormids } from "../zustand/useNonSelectedFormids";
// import { useSWRConfig } from "swr";
import { useSelectedFormIds } from "../zustand/useSelectedFormIds";
import ChooseCourseBatchDialog from "./ChooseCourseBatchDialog";
import useSWRMutation from "swr/mutation";
import { putFetcher } from "../api/fatcher";
import { AxiosError } from "axios";
import { message } from "antd";
import { useSWRConfig } from "swr";
import { mutate } from "swr";
import { Loader } from "lucide-react";

export default function SelectMultipleStudent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSelected, setIsSelected] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { form_ids, clear, addNewFormid } = useSelectedFormIds();

  const { trigger: changeCourse, isMutating: isChangingCourse } =
    useSWRMutation("api/v1/admission/change-course", (url, { arg }) =>
      putFetcher(url, arg)
    );

  const { cache } = useSWRConfig();
  const admissionList = cache.get(
    `api/v1/admission?${searchParams.toString()}`
  );

  // const { data, isLoading, error } = useSWR(`api/v1/admission?${searchParams.toString()}`);

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
    session_id: number
  ) => {

    if(!confirm("Are you sure you want to continue? Once you click OK, this action cannot be undone.")) return;

    try {
      const response = await changeCourse({
        course_id,
        batch_id,
        session_id,
        form_ids,
      } as any);
      messageApi.open({
        type: "success",
        content: response?.message,
      });
      mutate(`api/v1/admission?${searchParams.toString()}`);
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
  }, [searchParams.toString()])

  useEffect(() => {
    startTransition(() => {
      if (admissionList?.data?.data && isSelected) {
        addNewFormid(
          admissionList?.data?.data?.map((item: any) => item.form_id)
        );
      } else {
        clear();
      }
    });
  }, [admissionList?.data?.data?.length, isSelected]);

  return (
    <>
      <div className="z-50 fixed top-50">{contextHolder}</div>
      {isDialogOpen ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-auto gap-1.5 bg-white p-10 rounded-2xl shadow-2xl">
            <ChooseCourseBatchDialog
              setIsDialogOpen={setIsDialogOpen}
              onFormSubmit={onChooseCourseBatchFormSubmit}
              isFormSubmiting={isChangingCourse}
            />
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {isPending ? (
            <Loader className="animate-spin text-white" size={18}/>
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

        <div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={form_ids.length == 0 || isChangingCourse}
          >
            Shift Course / Batch
          </Button>
        </div>
      </div>
    </>
  );
}
