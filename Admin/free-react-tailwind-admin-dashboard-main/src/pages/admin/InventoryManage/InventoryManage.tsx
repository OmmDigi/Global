import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/form/Select";
import BasicTableCourses from "../../../components/tables/BasicTables/BasicTableCourses";
import BasicTablePurchase from "../../../components/tables/BasicTables/BasicTablePurchase";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import BasicTableInventory from "../../../components/tables/BasicTables/BasicTableInventory";

export default function InventoryManage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState<number>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState(
    {
      item_name: "",
      vendor_id: "",
      created_at: "",
      minimum_quantity: "",
    },
  );

  const {
    data: vendorList,
    loading: vendorLoading,
    error: vendorError,
  } = useSWR("api/v1/vendor", getFetcher);
  if (vendorLoading) {
    return <div>Loading ...</div>;
  }
  console.log("vendorList", vendorList);

  // create inventory
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/inventory/item/add", (url, { arg }) =>
    postFetcher(url, arg)
  );

  // get inventory  List
  const {
    data: inventoryList,
    loading: inventoryLoding,
    error: inventoryeError,
  } = useSWR("api/v1/inventory/item", getFetcher);

  if (inventoryLoding) {
    console.log("loading", inventoryLoding);
  }
  console.log("inventoryList", inventoryList);

  // Update purchaseList

  const {
    trigger: update,
    data,
    error,
    isMutating,
  } = useSWRMutation("api/v1/inventory/item/edit", (url, { arg }) => putFetcher(url, arg));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("formdataaa", formData);
    const multiForm = [formData]
    try {
      const response = await create(multiForm);
      mutate(
        (currentData: any) => [...(currentData || []), response.data],
        false
      );
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);
      setFormData({
        item_name: "",
        vendor_id: "",
        created_at: "",
        minimum_quantity: "",
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

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      const response = await getFetcher(`api/v1/inventory/item/${id}`);
      const userData = response.data;
      setFormData({
        item_id: id,
        item_name: userData?.item_name,
        vendor_id: userData?.vendor_id,
        created_at: userData?.created_at,
        minimum_quantity: userData?.minimum_quantity,
      });
      setPhoto(userData?.file);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData);
      mutate("api/v1/inventory/item");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);

      setFormData({
        item_name: "",
        vendor_id: "",
        created_at: "",
        minimum_quantity: "",
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
    <div className="flex flex-col gap-6">
      {contextHolder}
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Inventory Manage" />
      <ComponentCard title="Inventory Manage">
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
                name="item_name"
                onChange={handleChange}
                value={formData?.item_name}
                placeholder="Item Name"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-12/12  mb-4">
                <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                  Choose Vendor
                </label>
                <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                >
                  <option value="">Select</option>
                  {vendorList?.data?.map((data, index) => (
                    <div key={index}>
                      <option value={data?.id}>{data?.name}</option>
                    </div>
                  ))}
                </select>
              </div>
              <div>
                <Label>Item Addition Date</Label>
                <Input
                  type="date"
                  id="inputTwo"
                  name="created_at"
                  onChange={handleChange}
                  value={formData?.created_at}
                  placeholder="Date of Purchase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
             
              <div>
                <Label>Minimum Quantity to maintain *</Label>
                <Input
                  type="number"
                  id="inputTwo"
                  name="minimum_quantity"
                  onChange={handleChange}
                  value={formData?.minimum_quantity}
                  placeholder="Minimum Quantity to maintain"
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
          </div>
        </form>
        <BasicTableInventory  inventoryList={inventoryList} onEdit={handleEdit} />
      </ComponentCard>
    </div>
  );
}
