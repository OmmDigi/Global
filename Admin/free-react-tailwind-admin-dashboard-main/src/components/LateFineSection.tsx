import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { message } from "antd";
import ComponentCard from "./common/ComponentCard";
import Label from "./form/Label";
import Input from "./form/input/InputField";
import Checkbox from "./form/input/Checkbox";
import Button from "./ui/button/Button";
import { getFetcher, postFetcher } from "../api/fatcher";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function LateFineSection() {
  const [messageApi, contextHolder] = message.useMessage();
  const [amount, setAmount] = useState("");
  const [fineDate, setFineDate] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const { data } = useSWR("api/v1/settings/late-fine-config", getFetcher);

  useEffect(() => {
    if (data?.data) {
      setAmount(data.data.amount ?? "");
      setFineDate(data.data.fine_date ?? "");
      setSelectedMonths(data.data.applicable_months ?? []);
    }
  }, [data]);

  const { trigger: save, isMutating } = useSWRMutation(
    "api/v1/settings/late-fine-config",
    (url, { arg }) => postFetcher(url, arg)
  );

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await save({
        amount: Number(amount),
        applicable_months: selectedMonths,
        fine_date: Number(fineDate),
      } as any);
      messageApi.open({ type: "success", content: response.message });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message ?? "Try again",
      });
    }
  };

  return (
    <section>
      {contextHolder}
      <ComponentCard title="Late Fine Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="lateFineAmount">Late Fine Amount</Label>
              <Input
                type="number"
                id="lateFineAmount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter late fine amount"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="fineDate">Late Fine Date</Label>
              <Input
                type="number"
                id="fineDate"
                name="fine_date"
                value={fineDate}
                onChange={(e) => setFineDate(e.target.value)}
                placeholder="Day of month (e.g. 10)"
                min="1"
                max="31"
              />
            </div>
          </div>

          <div>
            <Label>Applicable Months</Label>
            <div className="grid grid-cols-3 gap-3 mt-2 sm:grid-cols-4 lg:grid-cols-6">
              {MONTHS.map((month) => (
                <Checkbox
                  key={month}
                  label={month}
                  checked={selectedMonths.includes(month)}
                  onChange={() => toggleMonth(month)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <Button type="submit" disabled={isMutating}>
              Save
            </Button>
          </div>
        </form>
      </ComponentCard>
    </section>
  );
}
