import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher, putFetcher } from "../../../api/fatcher";
import { message } from "antd";
import useSWR, { mutate } from "swr";
import BasicTableVendor from "../../../components/tables/BasicTables/BasicTableVendor";

type FormDataType = {
  id?: number; // optional (if sometimes missing)
  name: string;
  service_type?: string;
  address?: string;
  contact_details?: string;
};
export default function VendorManage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({
 
    name: "",
    service_type: "",
    address: "",
    contact_details: "",
  });

  //   create Seaaion
  const { trigger: create } = useSWRMutation("api/v1/vendor", (url, { arg }) =>
    postFetcher(url, arg)
  );

  //   get vendorList
  const { data: vendorList, isLoading: vendorLoading } = useSWR(
    "api/v1/vendor",
    getFetcher
  );

  //   get single data
  // const {
  //   data: editData,
  //   loading: editLoading,
  //   error: editError,
  // } = useSWR(`api/v1/course/session/${id}`, getFetcher);

  //   get updated data
  const { trigger: update } = useSWRMutation(
    "api/v1/course/vendor",
    (url, { arg }) => putFetcher(url, arg)
  );
  if (vendorLoading) {
    return <div className="text-gray-800 dark:text-gray-200">Loading ...</div>;
  }

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      const response = await getFetcher(`api/v1/vendor/${id}`);
      const userData = response.data;
      setFormData({
        id: id,
        name: userData?.name,
        service_type: userData?.service_type,
        address: userData?.address,
        contact_details: userData?.contact_details,
      });
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }

    jumpToTop();
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
    try {
      const response = await update( formData as any);
      mutate("api/v1/vendor");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);

      setFormData({
        name: "",
        service_type: "",
        address: "",
        contact_details: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
  };

  // const handleActive = async (isActive: boolean, id: number) => {
  //   console.log("isactiveaaaa ", isActive);

  //   try {
  //     const response = await update({
  //       id: id,
  //       is_active: isActive,
  //     });

  //     mutate("api/v1/vendor");
  //     messageApi.open({
  //       type: "success",
  //       content: response.message,
  //     });
  //     console.log("Upload Success:", response);
  //   } catch (error: any) {
  //     messageApi.open({
  //       type: "error",
  //       content: error.response?.data?.message,
  //     });
  //     console.log("Upload Error:", error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create( formData as any);
      //   mutate(
      //     (currentData: any) => [...(currentData || []), response.data],
      //     false
      //   );
      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
       
        name: "",
        service_type: "",
        address: "",
        contact_details: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message
          ? error.response?.data?.message
          : " try again ",
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
      <PageBreadcrumb pageTitle="Vendors" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Vendors">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Vendor name</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="name"
                      onChange={handleChange}
                      value={formData.name}
                      placeholder="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inputTwo">Service type</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="service_type"
                      onChange={handleChange}
                      value={formData.service_type}
                      placeholder="service_type"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Address</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="address"
                      onChange={handleChange}
                      value={formData.address}
                      placeholder="address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inputTwo">Contact details</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="contact_details"
                      onChange={handleChange}
                      value={formData.contact_details}
                      placeholder="contact_details"
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
            <BasicTableVendor
              sessionList={vendorList}
              onEdit={handleEdit}
              // onActive={handleActive}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
