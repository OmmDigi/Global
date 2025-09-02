import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Minus, Plus } from "lucide-react";

// import BasicTablePurchase from "../../../components/tables/BasicTables/BasicTablePurchase";
import { Upload, X } from "lucide-react";
import { uploadFiles } from "../../../utils/uploadFile";
import {
  getFetcher,
  postFetcher,
  putFetcher,
  uploadUrl,
} from "../../../api/fatcher";
import useSWRMutation from "swr/mutation";
import useSWR, { mutate } from "swr";
import { message } from "antd";
import BasicTableAmc from "../../../components/tables/BasicTables/BasicTableAmc";

type FormDataType = {
  id?: number; // optional (if sometimes missing)
  file: string;
  product_name: string;
  contract_from: string;
  contract_to: string;
  time_duration: string;
  company_name: string;
  renewal_date: string;
  expiry_date: string;
};
export default function AmcRecord() {
  const [messageApi, contextHolder] = message.useMessage();
  const [amcRecord, setAmcRecord] = useState(false);

  // const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
  //   null,
  //   null,
  // ]);
  // const [startDate, endDate] = dateRange;

  const [photo, setPhoto] = useState<string | null>(null);
  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState<FormDataType>({
    // id: 0,
    file: "",
    product_name: "",
    contract_from: "",
    contract_to: "",
    time_duration: "",
    company_name: "",
    renewal_date: "",
    expiry_date: "",
  });

  // all employee list

  // create Holiday
  const { trigger: create } = useSWRMutation(
    "api/v1/inventory/amc",
    (url, { arg }) => postFetcher(url, arg)
  );

  // get purchaseList
  const { data: amcList,  } = useSWR(
    "api/v1/inventory/amc",
    getFetcher
  );

  // Update purchaseList

  const { trigger: update } = useSWRMutation(
    "api/v1/inventory/amc",
    (url, { arg }) => putFetcher(url, arg)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await create(formData as any);
      mutate(
        (currentData: any) => [...(currentData || []), response.data],
        false
      );
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setPhoto(null);
      setFormData({
        file: "",
        product_name: "",
        contract_from: "",
        contract_to: "",
        time_duration: "",
        company_name: "",
        renewal_date: "",
        expiry_date: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
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
      [name]: value,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (type === "photo") {
          setPhoto(result);
        }
      };

      reader.readAsDataURL(file);

      uploadFiles({
        url: `${uploadUrl}api/v1/upload/multiple`,
        files: [file],
        folder: "profile_image",

        onUploaded(result) {
          setFormData((prev) => ({
            ...prev,
            file: result[0].downloadUrl,
          }));
        },
      });
    }
  };

  const removeFile = (type: "photo") => {
    if (type === "photo") {
      setPhoto(null);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      const response = await getFetcher(`api/v1/inventory/amc/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        product_name: userData?.product_name,
        file: userData?.file,
        contract_from: userData?.contract_from,
        contract_to: userData?.contract_to,
        time_duration: userData?.time_duration,
        company_name: userData?.company_name,
        renewal_date: userData?.renewal_date,
        expiry_date: userData?.expiry_date,
      });
      setAmcRecord(true);
      setPhoto(userData?.file);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/purchase");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setId(0);
      setPhoto(null);
      setFormData({
        file: "",
        product_name: "",
        contract_from: "",
        contract_to: "",
        time_duration: "",
        company_name: "",
        renewal_date: "",
        expiry_date: "",
      });
      setAmcRecord(false);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };
  const handleTeacherShow = () => {
    jumpToTop();
    setAmcRecord(false);
  };
  const handleTeacherClose = () => {
    setAmcRecord(true);
  };
  const jumpToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="AMC Record" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="AMC Record">
            <div
              onClick={amcRecord ? handleTeacherShow : handleTeacherClose}
              className="cursor-pointer text-gray-500 hover:text-gray-500 dark:text-gray-300  flex items-center justify-center"
            >
              {amcRecord ? (
                <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
                  <Minus className="text-red-500" size={50} />
                  <div className="text-2xl"> Add AMC Record </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
                  <Plus size={50} />
                  <div className="text-2xl">Add AMC Record </div>
                </div>
              )}
            </div>
            {amcRecord ? (
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="inputTwo">Product name</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="product_name"
                      onChange={handleChange}
                      value={formData?.product_name}
                      placeholder="Item Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                      <Label>Company Name </Label>
                      <Input
                        id="inputTwo"
                        type="text"
                        name="company_name"
                        value={formData?.company_name}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray_400 dark:text-gray-400 "
                      />
                    </div>
                    <div>
                      <Label>Amc Time Duration</Label>
                      <Input
                        type="text"
                        id="inputTwo"
                        name="time_duration"
                        onChange={handleChange}
                        value={formData?.time_duration}
                        placeholder="Amc Time Duration"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                      <Label>Contract from</Label>
                      <Input
                        type="date"
                        id="inputTwo"
                        name="contract_from"
                        onChange={handleChange}
                        value={formData?.contract_from}
                        placeholder="Date of Purchase"
                      />
                    </div>
                    <div>
                      <Label>Contract to</Label>
                      <Input
                        type="date"
                        id="inputTwo"
                        name="contract_to"
                        onChange={handleChange}
                        value={formData?.contract_to}
                        placeholder="Expaire Date"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                      <Label>Renewal date</Label>
                      <Input
                        type="date"
                        id="inputTwo"
                        name="renewal_date"
                        onChange={handleChange}
                        value={formData?.renewal_date}
                        placeholder="Date of Purchase"
                      />
                    </div>
                    <div>
                      <Label>Warrenty expiry date</Label>
                      <Input
                        type="date"
                        id="inputTwo"
                        name="expiry_date"
                        onChange={handleChange}
                        value={formData?.expiry_date}
                        placeholder="Expaire Date"
                      />
                    </div>
                  </div>

                  {/* photo  */}
                  <div className="ml-4 flex  justify-center">
                    <div className="w-32 h-40 border-2 border-gray-400 flex flex-col items-center justify-center bg-gray-50">
                      {photo ? (
                        <div className="relative w-full h-full">
                          <img
                            src={photo}
                            alt="Candidate"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFile("photo")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload
                            size={24}
                            className="mx-auto mb-2 text-gray-400"
                          />
                          <p className="text-xs text-gray-500">
                            Paste Your Photo
                          </p>
                          <label className="cursor-pointer">
                            <input
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "photo")}
                              className="hidden"
                            />
                            <span className="text-xs text-blue-500 hover:text-blue-700">
                              Upload
                            </span>
                          </label>
                        </div>
                      )}
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
                </div>
              </form>
            ) : null}
            <BasicTableAmc amcList={amcList} onEdit={handleEdit} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
