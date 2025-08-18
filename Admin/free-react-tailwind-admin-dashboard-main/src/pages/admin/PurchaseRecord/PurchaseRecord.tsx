import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import BasicTablePurchase from "../../../components/tables/BasicTables/BasicTablePurchase";
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

export default function PurchaseRecord() {
  const [messageApi, contextHolder] = message.useMessage();

  const [photo, setPhoto] = useState<string | null>(null);
  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState({
      // id: 0,
    file: "",
    name: "",
    bill_no: "",
    per_item_rate: "",
    company_details: "",
    purchase_date: "",
    expaire_date: "",
    previousBalance: "",
    presentBalance: "",
    quantityReceived: "",
  });

  // all employee list
  const { data: stufflist, isLoading: stuffLoading } = useSWR(
    "api/v1/users",
    getFetcher
  );

  // create Holiday
  const { trigger: create } = useSWRMutation(
    "api/v1/purchase",
    (url, { arg }) => postFetcher(url, arg)
  );

  // get purchaseList
  const { data: purchaseList, isLoading: purchaseLoding } = useSWR(
    "api/v1/purchase",
    getFetcher
  );

  // Update purchaseList

  const { trigger: update } = useSWRMutation(
    "api/v1/purchase",
    (url, { arg }) => putFetcher(url, arg)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stuffLoading) {
      return (
        <div className="text-gray-800 dark:text-gray-200">Loading ...</div>
      );
    }

    console.log("stufflist", stufflist);
    if (purchaseLoding) {
      console.log("loading", purchaseLoding);
    }

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
      console.log("Upload Success:", response);
      setPhoto(null);
      setFormData({
     
    file: "",
    name: "",
    bill_no: "",
    per_item_rate: "",
    company_details: "",
    purchase_date: "",
    expaire_date: "",
    previousBalance: "",
    presentBalance: "",
    quantityReceived: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
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

      console.log("formData2", file);
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
      const response = await getFetcher(`api/v1/purchase/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        name: userData?.name,
        file: userData?.file,
        bill_no: userData?.bill_no,
        per_item_rate: userData?.per_item_rate,
        company_details: userData?.company_details,
        purchase_date: userData?.purchase_date,
        expaire_date: userData?.expaire_date,
        previousBalance: userData?.previousBalance,
        presentBalance: userData?.presentBalance,
        quantityReceived: userData?.quantityReceived,
      });
      setPhoto(userData?.file);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
  };

  const handleUpdate = async () => {
    try {
      const response = await update( formData as any);
      mutate("api/v1/purchase");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);

      setFormData({
      
    file: "",
    name: "",
    bill_no: "",
    per_item_rate: "",
    company_details: "",
    purchase_date: "",
    expaire_date: "",
    previousBalance: "",
    presentBalance: "",
    quantityReceived: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
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
      <PageBreadcrumb pageTitle="Purchase Record" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Purchase Record">
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="space-y-6">
                <div>
                  <Label htmlFor="inputTwo">Item Name</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="name"
                    onChange={handleChange}
                    value={formData?.name}
                    placeholder="Item Name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Bill No</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="bill_no"
                      onChange={handleChange}
                      value={formData?.bill_no}
                      placeholder="Bill No"
                    />
                  </div>
                  <div>
                    <Label>Per Item Rate</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="per_item_rate"
                      onChange={handleChange}
                      value={formData?.per_item_rate}
                      placeholder="Per Item Rate"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label>Company Name , Address , PH No</Label>
                    <textarea
                      id="inputTwo"
                      name="company_details"
                      value={formData?.company_details}
                      onChange={handleChange}
                      placeholder="Company Name , Address , PH No"
                      rows={3}
                      className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray_400 dark:text-gray-400 "
                    />
                  </div>
                  <div>
                    <Label>Date of Purchase</Label>
                    <Input
                      type="date"
                      id="inputTwo"
                      name="purchase_date"
                      onChange={handleChange}
                      value={formData?.purchase_date}
                      placeholder="Date of Purchase"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label>Expaire Date</Label>
                    <Input
                      type="date"
                      id="inputTwo"
                      name="expaire_date"
                      onChange={handleChange}
                      value={formData?.expaire_date}
                      placeholder="Expaire Date"
                    />
                  </div>
                  <div>
                    <Label>Previous Balance</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="previousBalance"
                      onChange={handleChange}
                      value={formData?.previousBalance}
                      placeholder="Previous Balance"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label>Present Balance</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="presentBalance"
                      onChange={handleChange}
                      value={formData?.presentBalance}
                      placeholder="Present Balance"
                    />
                  </div>
                  <div>
                    <Label>Quamtity Received</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="quantityReceived"
                      onChange={handleChange}
                      value={formData?.quantityReceived}
                      placeholder="Expaire Date"
                    />
                  </div>
                </div>
                {/* photo  */}
                <div className="flex justify-center">
                  <div className="w-32 h-40 border-2 border-gray-400 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
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
                            type="image"
                            name="file"
                            // value={formData?.file}
                            accept="file/*"
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
            <BasicTablePurchase
              purchaseList={purchaseList}
              onEdit={handleEdit}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
