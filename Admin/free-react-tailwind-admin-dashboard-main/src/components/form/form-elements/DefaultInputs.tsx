import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import MultiSelect from "../MultiSelect";
import Radio from "../input/Radio";
import Button from "../../ui/button/Button";
import BasicTableOne from "../../tables/BasicTables/BasicTableNotice";

export default function DefaultInputs() {
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
    <ComponentCard title="Create New">
      <div className="flex flex-wrap justify-center font-bold items-center gap-20">
        <Radio
          id="radio1"
          name="group1"
          value="option1"
          checked={selectedValue === "option1"}
          onChange={handleRadioChange}
          label="Stuff"
        />
        <Radio
          id="radio2"
          name="group1"
          value="option2"
          checked={selectedValue === "option2"}
          onChange={handleRadioChange}
          label="Student"
        />
      </div>
      <div className="space-y-6">
        <div>
          <MultiSelect
            label={
              dropdownOpen ? dropdownOpen : "Select Stuff Catagory / Catagories"
            }
            options={multiOptions as any}
            defaultSelected={selectedValues}
            // defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>

        <div>
          <Label htmlFor="inputTwo">Notice Title</Label>
          <Input
            type="text"
            id="inputTwo"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Notice Title"
          />
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
      <BasicTableOne />
    </ComponentCard>
  );
}
