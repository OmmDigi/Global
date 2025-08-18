import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";

export default function MaintenanceRecord() {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [sessions, setSessions] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

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

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Maintenance Record" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Maintenance Record">
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
                  <Label htmlFor="inputTwo">Assign To</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    onChange={(e) => setSessions(e.target.value)}
                    value={sessions}
                    placeholder="Sessions"
                  />
                </div>
                {/* <div>
                  <Label>Payment Mode</Label>
                  <Select
                    options={options}
                    placeholder="Select Option"
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                  />
                </div> */}
                <div>
                  <Label htmlFor="inputTwo">Duration</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                    placeholder="Duration"
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputTwo">Duration</Label>
                  <Input
                    type="text"
                    id="inputTwo"
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                    placeholder="Duration"
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
              </div> */}
              <div>
                <Label>Description</Label>
                <TextArea
                  value={message}
                  // placeholder="info@gmail.com"
                  onChange={(value) => setMessage(value)}
                  rows={6}
                />
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div onClick={submit} className="flex items-center gap-5">
                  <Button size="md" variant="primary">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
            {/* <BasicTableCourses /> */}
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
