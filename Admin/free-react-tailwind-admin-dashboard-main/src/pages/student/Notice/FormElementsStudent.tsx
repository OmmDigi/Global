import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Radio from "../../../components/form/input/Radio";
import MultiSelect from "../../../components/form/MultiSelect";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import BasicTableNotice from "../../../components/tables/studentTable/BasicTableNotice";

export default function FormElementsStudent() {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("option1");
  const [dropdownOpen, setDropdownOpen] = useState("");

  const handleRadioChange = (value: string) => {
    console.log("Selected Radio Value:", value);

    setSelectedValue(value);
    if (value === "option1") {
      setDropdownOpen("Select Stuff Catagory / Catagories");
    } else if (value === "option2") {
      setDropdownOpen("Select Student Catagory / Catagories");
    }
  };

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];
  const submit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedValue("option1");
    setTitle("");
    setMessage("");
    setSelectedValues([]);
    setDropdownOpen("");
    console.log("Submitted Values:", {
      selectedValues,
      title,
      message,
      selectedValue,
    });
  };
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Notice / Message" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6 ">
          <ComponentCard title="Notice / Message List">
            
           
            <BasicTableNotice />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
