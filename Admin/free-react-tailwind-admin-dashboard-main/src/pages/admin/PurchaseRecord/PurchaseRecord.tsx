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
import { Upload, X } from "lucide-react";

export default function PurchaseRecord() {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [sessions, setSessions] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [photo, setPhoto] = useState(null);

  const options = [
    { value: "online", label: "Online" },
    { value: "cash", label: "Cash" },
    { value: "cash-online", label: "Cash/Online" },
  ];

  const submit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setTitle("");
    setSessions("");
    setDuration("");
    setPrice("");
    setSelectedValues([]);
    setMessage("");
    setSelectedValues([]);

    console.log("Submitted Values:", {
      selectedValues,
      title,
      sessions,
      duration,
      price,
      paymentMode: options.find((option) => option.value === "online")?.label,
      message,
    });
  };

  const handleFileUpload = (
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
    }
  };

  const removeFile = (type: "photo") => {
    if (type === "photo") {
      setPhoto(null);
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Purchase Record" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Purchase Record">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputTwo">Item Name</Label>
                <Input
                  type="text"
                  id="inputTwo"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="Item Name"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputTwo">Quantity</Label>
                  <Input
                    type="number"
                    id="inputTwo"
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                    placeholder="Quantity"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    id="inputTwo"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    placeholder="Price"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label>Description</Label>
                  <TextArea
                    value={message}
                    // placeholder="info@gmail.com"
                    onChange={(value) => setMessage(value)}
                    rows={6}
                  />
                </div>
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
                        <p className="text-xs font-bold text-gray-500">
                          Paste Your Bill Photo
                        </p>

                        <label className="cursor-pointer">
                          <input
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
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div onClick={submit} className="flex items-center gap-5">
                  <Button size="md" variant="primary">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
            <BasicTableCourses />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
