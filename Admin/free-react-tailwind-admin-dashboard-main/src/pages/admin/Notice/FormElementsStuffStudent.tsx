import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Radio from "../../../components/form/input/Radio";
import MultiSelect from "../../../components/form/MultiSelect";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableNotice";
import BasicTableNotice from "../../../components/tables/BasicTables/BasicTableNotice";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { message } from "antd";

export default function FormElementsStuffStudent() {
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedValue, setSelectedValue] = useState<string>("Stuff");
  const [dropdownOpen, setDropdownOpen] = useState(
    "Select Stuff Catagory / Catagories"
  );
  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    send_to: [],
    description: "",
  });

  // all employee list
  const {
    data: stufflist,
    loading: stuffLoading,
    error: stuffError,
  } = useSWR("api/v1/users", getFetcher);
  if (stuffLoading) {
    return <div>Loading ...</div>;
  }

  console.log("stufflist",stufflist);
  
  // get course list
  const {
    data: courseList,
    loading: courseLoading,
    error: courseError,
  } = useSWR("api/v1/course", getFetcher);
  if (courseLoading) {
    return <div>Loading ...</div>;
  }
  console.log("courseList", courseList);

  // create Notice
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/notice", (url, { arg }) => postFetcher(url, arg));

  // get Notice List
  const {
    data: noticeList,
    loading: noticeLoading,
    error: noticeError,
  } = useSWR("api/v1/notice", getFetcher);

  if (stuffLoading) {
    console.log("loading", stuffLoading);
  }

  console.log("noticeList", noticeList);

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
    console.log("Selected Radio Value:", value);
    setSelectedValue(value);
    if (value === "Stuff") {
      setDropdownOpen("Select Stuff Catagory / Catagories");
    } else if (value === "Student") {
      setDropdownOpen("Select Student Catagory / Catagories");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await create(formData);
      mutate(
        (currentData: any) => [...(currentData || []), response.data],
        false
      );
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        type: "",
        title: "",
        send_to: [],
        description: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : "Try Again",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value : [],
    }));
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Stuff Notice" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Notice">
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="flex flex-wrap justify-center font-bold items-center gap-20">
                <Radio
                  id="radio1"
                  name="group1"
                  value="Stuff"
                  checked={selectedValue === "Stuff"}
                  onChange={handleRadioChange}
                  label="Stuff"
                />
                <Radio
                  id="radio2"
                  name="group1"
                  value="Student"
                  checked={selectedValue === "Student"}
                  onChange={handleRadioChange}
                  label="Student"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="inputOne">
                    {dropdownOpen ? dropdownOpen : "Select Catagory"}
                  </Label>
                  <MultiSelect
                    options={
                      selectedValue === "Stuff"
                        ? stufflist?.data
                          ? stufflist?.data
                          : " No data"
                        : courseList?.data
                        ? courseList?.data
                        : " No data"
                    }
                    selectedValues={formData.send_to}
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        send_to: selected,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="inputTwo">Notice Title</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="title"
                    onChange={handleChange}
                    value={formData.title}
                    placeholder="Notice Title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={4}
                    className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray-400 border-gray-600 "
                  />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
                    <Button size="md" variant="primary">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <BasicTableNotice noticeList={noticeList} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
