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

export default function StuffAttandance() {
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
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Stuff Attandance" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Stuff Attandance">
            <BasicTableCourses />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
