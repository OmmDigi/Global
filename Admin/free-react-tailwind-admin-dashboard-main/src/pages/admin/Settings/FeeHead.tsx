import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import useSWRMutation from "swr/mutation";
import { postFetcher } from "../../../api/fatcher";
import { message } from "antd";
import BackupDatabaseSection from "../../../components/BackupDatabaseSection";

type FormDataType = {
  id?: number; // optional (if sometimes missing)
  essl_ip: string;
  essl_port: number;
};

export default function Settings() {
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState<FormDataType>({
    essl_ip: "192.168.0.144",
    essl_port: 4370,
  });

  //   create Seaaion
  const { trigger: create } = useSWRMutation(
    "api/v1/settings/essl-config",
    (url, { arg }) => postFetcher(url, arg)
  );

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await create(formData as any);

      messageApi.open({
        type: "success",
        content: response.message,
      });

      setFormData({
        // id: 0,
        essl_ip: "",
        essl_port: 0,
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

  return (
    <div className="space-y-3.5">
      {contextHolder}
      <PageMeta
        title=" Dashboard Form Elements Dashboard |  "
        description="This is  Dashboard Form Elements Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Settings" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Settings">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Essl IP</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="essl_ip"
                      onChange={handleChange}
                      value={formData.essl_ip}
                      placeholder="192.168.0.144"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inputTwo">Essl Port</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="essl_port"
                      onChange={handleChange}
                      value={formData.essl_port}
                      placeholder="4370"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-5">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* <BasicTableFeesHead
              sessionList={sessionList}
              onEdit={handleEdit}
              onActive={handleActive}
            /> */}
          </ComponentCard>
        </div>
      </div>

      <BackupDatabaseSection />
    </div>
  );
}
