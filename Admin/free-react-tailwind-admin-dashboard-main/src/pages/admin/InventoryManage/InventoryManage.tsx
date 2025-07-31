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

export default function InventoryManage() {
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
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

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
    <div className="flex flex-col gap-6">
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Inventory Manage" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6 ">
          <ComponentCard title="Stock In">
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
                  <Label>Date</Label>
                  <Input
                    type="date"
                    id="inputTwo"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    placeholder="Price"
                  />
                </div>
              </div>
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
          </ComponentCard>
        </div>
        <div className="space-y-6 ">
          <ComponentCard title="Stock Out">
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
                  <Label>Date</Label>
                  <Input
                    type="date"
                    id="inputTwo"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    placeholder="Price"
                  />
                </div>
              </div>
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
          </ComponentCard>
        </div>
      </div>
      <BasicTableCourses />
    </div>
  );
}
