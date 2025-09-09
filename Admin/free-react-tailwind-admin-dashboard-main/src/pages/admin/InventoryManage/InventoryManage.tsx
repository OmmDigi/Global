import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";


import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import BasicTableInventory from "../../../components/tables/BasicTables/BasicTableInventory";
import { Minus, Plus } from "lucide-react";
import useSWR from "swr";

type FormDataType = {
  id?: number; // optional (if sometimes missing)
  item_name: string;
  created_at: string;
  minimum_quantity: string;
};
export default function InventoryManage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [addInventoryItem, setAddInventoryItem] = useState(false);
  const [pageCount, setPageCount] = useState<number>(1);

  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState<FormDataType>({
    // item_id: 0,
    item_name: "",
    created_at: "",
    minimum_quantity: "",
  });

  // const { data: vendorList, isLoading: vendorLoading } = useSWR(
  //   "api/v1/vendor",
  //   getFetcher
  // );
  // get inventory  List
  const {
    data: inventoryList,
    isLoading: inventoryLoding,
    mutate,
  } = useSWR(`api/v2/inventory/item?page=${pageCount}`, getFetcher);

  // create inventory
  const { trigger: create } = useSWRMutation(
    "api/v2/inventory/item",
    (url, { arg }) => postFetcher(url, arg)
  );

  // Update purchaseList

  const { trigger: update } = useSWRMutation(
    "api/v2/inventory/item",
    (url, { arg }) => putFetcher(url, arg)
  );
  if (inventoryLoding) {
    console.log("loading", inventoryLoding);
  }
  // if (vendorLoading) {
  //   return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  // }

  const handleChildData = (data: any) => {
    setPageCount(data);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      const response = await create(formData as any);
      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate();
      setFormData({
        // item_id: 0,
        item_name: "",
        created_at: "",
        minimum_quantity: "",
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

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      const response = await getFetcher(`api/v2/inventory/item/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        item_name: userData?.item_name,
        created_at: userData?.created_at,
        minimum_quantity: userData?.minimum_quantity,
      });
      setAddInventoryItem(true);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData as any);
      mutate("api/v1/inventory/item");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      setAddInventoryItem(false);

      setFormData({
        // item_id: 0,
        item_name: "",
        created_at: "",
        minimum_quantity: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }
  };

  const handleTeacherShow = () => {
    jumpToTop();
    setAddInventoryItem(false);
  };
  const handleTeacherClose = () => {
    setAddInventoryItem(true);
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
      <PageBreadcrumb pageTitle="Inventory Stock" />
      <ComponentCard title="Inventory Stock">
        <div
          onClick={addInventoryItem ? handleTeacherShow : handleTeacherClose}
          className="cursor-pointer text-gray-500 hover:text-gray-500 dark:text-gray-300  flex items-center justify-center"
        >
          {addInventoryItem ? (
            <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
              <Minus className="text-red-500" size={50} />
              <div className="text-2xl"> Add Inventory Item</div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-2">
              <Plus size={50} />
              <div className="text-2xl">Add Inventory Item</div>
            </div>
          )}
        </div>
        {addInventoryItem ? (
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
                {/* <div className="w-12/12  mb-4">
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
                    {vendorList?.data?.map((data: any, index: number) => (
                      <div key={index}>
                        <option value={data?.id}>{data?.name}</option>
                      </div>
                    ))}
                  </select>
                </div> */}
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
        ) : null}
        <BasicTableInventory
          inventoryList={inventoryList}
          onEdit={handleEdit}
          onSendData={handleChildData}
          mutate={mutate}
        />
      </ComponentCard>
    </div>
  );
}
