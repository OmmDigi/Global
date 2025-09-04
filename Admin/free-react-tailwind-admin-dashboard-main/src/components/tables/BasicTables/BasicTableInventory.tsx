import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import useSWRMutation from "swr/mutation";
import { postFetcher } from "../../../api/fatcher";
import { message } from "antd";
// import { mutate } from "swr";
import { useEffect, useState } from "react";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Pagination from "../../form/Pagination";
import DatePicker from "react-datepicker";

interface IProps {
  inventoryList: any;
  onEdit: (id: number) => void;
  onSendData: any;
  mutate: any;
}

// Define the table data using the interface

const BasicTableInventory: React.FC<IProps> = ({
  inventoryList,
  onEdit,
  onSendData,
  mutate,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [formType, setFormType] = useState<"add" | "consume" | null>(null);
  const [formData, setFormData] = useState({
    quantity: 0,
    transaction_date: "",
    cost_per_unit: "",
    remark: "",
  });
  const [itemName, setItemName] = useState("");
  const [id, setId] = useState("");
  const [closingStock, setClosingStock] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // create course
  const { trigger: create } = useSWRMutation(
    "api/v1/inventory/item/stock/add",
    (url, { arg }) => postFetcher(url, arg)
  );

  const handleOpenForm = (
    type: "add" | "consume",
    name: string,
    id: string,
    closing_stock: string
  ) => {
    setFormType(type);
    setItemName(name);
    setId(id);
    setClosingStock(closing_stock);
    setFormData({
      quantity: 0,
      transaction_date: "",
      cost_per_unit: "",
      // total_value: "",
      remark: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = [
      {
        item_id: id,
        transaction_type: formType,
        ...formData,
      },
    ];

    try {
      const response = await create(payload as any);

      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate();
      setFormData({
        quantity: 0,
        transaction_date: "",
        cost_per_unit: "",
        // total_value: "",
        remark: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }

    // Here you would POST to your API
    // fetch("/api/stock", { method: "POST", body: JSON.stringify(payload) });

    setFormType(null); // close form after submit
  };

  // for delete
  // const { trigger: deleteUser, isMutating } = useSWRMutation(
  //   "api/v1/purchase",
  //   (url, { arg }: { arg: number }) => deleteFetcher(`${url}/${arg}`) // arg contains the id
  // );
  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteUser(id);
  //     message.success("User deleted successfully");
  //     mutate("api/v1/purchase");
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     message.error("Failed to delete user");
  //   }
  // };
  const [count, setCount] = useState(1);
  useEffect(() => {
    onSendData(count);
  }, [count, onSendData]);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {contextHolder}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Item Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Vendor Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Last Purchased Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Current Price / Unit
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Previous Price / Unit
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Minimum Maintain
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Opeaning Stock
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Closing Stock
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                &nbsp;
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                &nbsp;
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {inventoryList?.data?.map((order: any, index: number) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="block font-medium text-gray-500 text-theme-xs dark:text-gray-400]">
                      {index + 1}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.item_name}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.vendor_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.last_transaction_date}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  ₹ {order.cost_per_unit_current}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  ₹ {order.cost_per_unit_prev}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.minimum_quantity}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.opening_stock}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.closing_stock}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <button
                    onClick={() =>
                      handleOpenForm(
                        "add",
                        order.item_name,
                        order.item_id,
                        order.closing_stock
                      )
                    }
                    className="px-4 py-3 rounded-3xl text-xl bg-green-200 text-gray-900"
                  >
                    Stock In
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3  text-gray-900 text-start text-theme-sm dark:text-gray-900">
                  <button
                    onClick={() =>
                      handleOpenForm(
                        "consume",
                        order.item_name,
                        order.item_id,
                        order.closing_stock
                      )
                    }
                    className="px-4 py-3 rounded-3xl text-xl bg-gray-400 text-gray-900"
                  >
                    Stock Out
                  </button>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(order.item_id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-8">
          <Pagination
            count={count}
            onChange={setCount}
            length={
              inventoryList?.data?.length ? inventoryList?.data?.length : 1
            }
          />
        </div>
      </div>

      {formType && (
        <div className="fixed inset-0 dark:bg-black bg-white  bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-xl w-96">
            <h1 className="text-2xl font-bold mb-4 text-center  text-gray-700   dark:text-gray-200">
              {" "}
              {itemName}
            </h1>
            <h2 className="text-lg font-bold mb-2  text-gray-500 text-start  dark:text-gray-400">
              {formType === "add" ? "Stock In" : "Stock Out"}
            </h2>

            {/* Quantity */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <Label htmlFor="inputOne">
                    {formType === "add" ? "Added Quantity" : "Issued Quantity"}
                  </Label>
                  <Input
                    type="number"
                    name="quantity"
                    max={formType === "add" ? "" : closingStock}
                    placeholder={
                      formType === "add" ? "Added Quantity" : "Issued Quantity"
                    }
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-0 border rounded "
                  />
                  <p className=" text-xs text-red-300">
                    {formType === "add"
                      ? ""
                      : `You have Quantity ${closingStock}`}
                  </p>
                </div>
                {/* Date */}
                {/* <div>
                  <Label htmlFor="inputOne">Date</Label>
                  <Input
                    type="date"
                    name="transaction_date"
                    value={formData.transaction_date}
                    onChange={handleChange}
                    className="w-full p-0 border rounded mb-3"
                  />
                </div> */}
                <div>
                  <Label htmlFor="date">Date</Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      setSelectedDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        transaction_date: date
                          ? date.toISOString().split("T")[0]
                          : "",
                      }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="w-full text-gray-500  border rounded px-3 py-2"
                    placeholderText="Select a date"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-2">
                <div>
                  <Label htmlFor="inputOne">Cost Per Unit</Label>
                  <Input
                    type="number"
                    name="cost_per_unit"
                    placeholder="Cost Per Unit"
                    value={formData.cost_per_unit}
                    onChange={handleChange}
                    className="w-full p-0 border rounded mb-3"
                  />
                </div>
                {/* total_value */}
                {/* <div>
                <Label htmlFor="inputOne">Total Value</Label>
                <Input
                  type="number"
                  name="total_value"
                  placeholder="Total Value"
                  value={formData.total_value}
                  onChange={handleChange}
                  className="w-full p-0 border rounded mb-3"
                />
              </div> */}
              </div>

              {/* cost_per_unit */}

              {/* Remark */}
              <div>
                <Label htmlFor="inputOne">Remark</Label>
                <textarea
                  name="remark"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full p-3 border rounded mb-3 text-gray-400 "
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setFormType(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-400 text-white text-lg font-semibold px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicTableInventory;
