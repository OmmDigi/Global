import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Upload, X } from "lucide-react";
import BasicTableCreateEmployee from "../../../components/tables/BasicTables/BasicTableCreateEmoloyee";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import {
  getFetcher,
  postFetcher,
  putFetcher,
  uploadUrl,
} from "../../../api/fatcher";
import { uploadFiles } from "../../../utils/uploadFile";
import useSWR, { mutate } from "swr";
export default function CreateEmployee() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<number>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [id, setId] = useState<number>();
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    joining_date: "",
    designation: "",
    email: "",
    ph_no: "",
    password: "",
    category: "Teacher",
    description: "",
  });

  // create employee
  const {
    trigger: create,
    data: dataCreate,
    error: dataError,
    isMutating: dataIsloading,
  } = useSWRMutation("api/v1/users/create", (url, { arg }) =>
    postFetcher(url, arg)
  );

  // edit employee
  const {
    trigger: update,
    data,
    error,
    isMutating,
  } = useSWRMutation("api/v1/users", (url, { arg }) => putFetcher(url, arg));
  console.log("dataUpdate", data);

  // single data for edit
  const {
    data: editData,
    loading: editLoading,
    error: editError,
  } = useSWR(`api/v1/users/${id}`, getFetcher);

  // all employee list
  const {
    data: stufflist,
    loading: stuffLoading,
    error: stuffError,
  } = useSWR("api/v1/users", getFetcher);

  if (stuffLoading) {
    console.log("loading", stuffLoading);
  }
  if (stuffError) {
    console.log("stuffError", stuffError);
  }
  console.log("stufflist", stufflist);

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
    setFormData((prev) => ({
      ...prev,
      category: "Teacher",
    }));

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
      console.log("Upload Success:", response);
      setPhoto(null);
      setFormData({
        image: "",
        name: "",
        joining_date: "",
        designation: "",
        email: "",
        ph_no: "",
        password: "",
        category: "Teacher",
        description: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
      console.log("Upload Error:", error);
    }
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
        url: `${uploadUrl}/api/v1/upload/multiple`,
        files: [file],
        folder: "profile_image",
        onUploading(percent) {
          setLoading(percent);
        },
        onUploaded(result) {
          setFormData((prev) => ({
            ...prev,
            image: result[0].downloadUrl,
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

  console.log("userData", editData);

  const handleEdit = async (id: number) => {
    try {
      setId(id);
      jumpToTop();

      const response = await getFetcher(`api/v1/users/${id}`);
      const userData = response.data;
      setPhoto(userData?.image);
      setFormData({
        id: id,
        image: userData?.image,
        name: userData?.name,
        joining_date: userData?.joining_date,
        designation: userData?.designation,
        email: userData?.email,
        ph_no: userData?.ph_no,
        password: userData?.password,
        category: userData?.category,
        description: userData?.description,
      });

      console.log("Edit data loaded:", userData);
    } catch (error) {
      console.error("Failed to fetch user data for edit:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await update(formData);
      mutate("api/v1/users");
      messageApi.open({
        type: "success",
        content: response.message,
      });
      console.log("Upload Success:", response);
      setPhoto(null);
      setFormData({
        image: "",
        name: "",
        joining_date: "",
        designation: "",
        email: "",
        ph_no: "",
        password: "",
        category: "Teacher",
        description: "",
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
      <PageBreadcrumb pageTitle="Cteate Employee" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Create New Employee">
            <div className="space-y-6">
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div className="ml-4 flex  justify-center">
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
                            type="file"
                            name="file"
                            // value={formData.image}
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

                <div>
                  <Label htmlFor="inputTwo">Employee Name</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Employee Name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Joining Date</Label>
                    <Input
                      type="date"
                      id="inputTwo"
                      name="joining_date"
                      onChange={handleChange}
                      value={formData.joining_date}
                      placeholder="Joining Date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inputTwo">Designation</Label>
                    <Input
                      type="text"
                      id="inputTwo"
                      name="designation"
                      onChange={handleChange}
                      value={formData.designation}
                      placeholder="Designation"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="inputTwo">Email</Label>
                    <Input
                      type="email"
                      id="inputTwo"
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <Label>PH No</Label>
                    <Input
                      type="number"
                      id="inputTwo"
                      name="ph_no"
                      onChange={handleChange}
                      value={formData.ph_no}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      id="inputTwo"
                      name="password"
                      onChange={handleChange}
                      value={formData.password}
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-start mt-1 dark:text-gray-400 text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      type="select"
                      id="inputTwo"
                      name="category"
                      onChange={handleChange}
                      value={formData.category}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700 "
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Stuff">Stuff</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={4}
                    className="w-full border rounded px-4 py-2 text-gray-700 dark:text-gray-400 "
                  />
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
            <BasicTableCreateEmployee
              stufflist={stufflist}
              onEdit={handleEdit}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
