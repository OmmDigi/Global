import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "../../../api/fatcher";
import { message } from "antd";
// import { mutate } from "swr";
import { useEffect, useState } from "react";

import Pagination from "../../form/Pagination";
import DatePicker from "react-datepicker";
import useSWR from "swr";
import dayjs from "dayjs";
import { useSearchParams } from "react-router";

interface IProps {
  inventoryList: any;
  onEdit: (id: number) => void;
  mutate: any;
}

const SEARCH_OPTIONS = [
  { value: "item_name", label: "Item Name" },
  { value: "vendor_name", label: "Vendor Name" },
];

const inputCls =
  "border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

const BasicTableInventory: React.FC<IProps> = ({
  inventoryList,
  onEdit,
  mutate,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [formType, setFormType] = useState<"add" | "consume" | null>(null);
  const [formData, setFormData] = useState({
    transaction_date: "",
    vendors: [{ vendor: "", cost_per_unit: "", quantity: "" }],
    receivers: [
      { receiver_type: "", receiver_value: "", bill_no: "", quantity: "" },
    ],
    remark: "",
  });

  const today = new Date();
  const [itemName, setItemName] = useState("");
  // const [vendor, setVendor] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [id, setId] = useState("");
  const [closingStock, setClosingStock] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [minimum_quantity, setMinimum_quantity] = useState("");

  // vandorlist
  const { data: vendorList } = useSWR("api/v1/vendor", getFetcher);
  // const options = vendorList?.data;
  // create course
  const { trigger: create } = useSWRMutation(
    "api/v2/inventory/item/stock",
    (url, { arg }) => postFetcher(url, arg)
  );

  const handleOpenForm = (
    type: "add" | "consume",
    name: string,
    id: string,
    avilable_quantity: string,
    // vendor: "",
    vendorId: "",
    minimum_quantity: ""
  ) => {
    setFormType(type);
    setItemName(name);
    setId(id);
    setClosingStock(avilable_quantity);
    // setVendor(vendor);
    setVendorId(vendorId);
    setMinimum_quantity(minimum_quantity);
    setFormData({
      transaction_date: `${dayjs(new Date()).format("YYYY-MM-DD")}`,
      vendors: [{ vendor: "", cost_per_unit: "", quantity: "" }],
      receivers: [
        { receiver_type: "", receiver_value: "", bill_no: "", quantity: "" },
      ],

      remark: "",
    });
  };

  const handleVendorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedVendors = [...prev.vendors];
      updatedVendors[index] = {
        ...updatedVendors[index],
        [name]: value,
      };
      return { ...prev, vendors: updatedVendors };
    });
  };
  const handleReceiversChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleReceiversChange", name, value);

    setFormData((prev) => {
      const updatedVendors = [...prev.receivers];
      updatedVendors[index] = {
        ...updatedVendors[index],
        [name]: value,
      };
      return { ...prev, receivers: updatedVendors };
    });
  };
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

  const handleAddMore = () => {
    setFormData((prev) => ({
      ...prev,
      vendors: [
        ...prev.vendors,
        { vendor: "", cost_per_unit: "", quantity: "" },
      ],
    }));
  };

  const handleRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    let payload: any = {};

    if (formType == "consume") {
      const { vendors, ...newFormData } = formData;

      payload = {
        item_id: id,
        vendor_id: vendorId,

        transaction_type: formType,
        ...newFormData,
      };
    } else {
      const { receivers, ...newFormData } = formData;
      payload = { item_id: id, transaction_type: formType, ...newFormData };
    }
    try {
      const response = await create(payload as any);

      messageApi.open({
        type: "success",
        content: response.message,
      });
      mutate();
      setFormData({
        transaction_date: "",
        vendors: [{ vendor: "", cost_per_unit: "", quantity: "" }],
        receivers: [
          { receiver_type: "", receiver_value: "", bill_no: "", quantity: "" },
        ],

        remark: "",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.response?.data?.message,
      });
    }

    setFormType(null); // close form after submit
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [searchBy, setSearchBy] = useState(searchParams.get("search_by") ?? "item_name");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [dateFrom, setDateFrom] = useState<Date | null>(
    searchParams.get("date_from") ? new Date(searchParams.get("date_from")!) : null
  );
  const [dateTo, setDateTo] = useState<Date | null>(
    searchParams.get("date_to") ? new Date(searchParams.get("date_to")!) : null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput) {
          next.set("search", searchInput);
          next.set("search_by", searchBy);
        } else {
          next.delete("search");
          next.delete("search_by");
        }
        next.set("page", "1");
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchBy]);

  const handleSearchByChange = (val: string) => {
    setSearchBy(val);
    setSearchInput("");
  };

  const handleDateChange = (key: "date_from" | "date_to", date: Date | null) => {
    if (key === "date_from") setDateFrom(date);
    else setDateTo(date);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (date) next.set(key, dayjs(date).format("YYYY-MM-DD"));
      else next.delete(key);
      next.set("page", "1");
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {contextHolder}
      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-3">
        <select
          value={searchBy}
          onChange={(e) => handleSearchByChange(e.target.value)}
          className={inputCls}
        >
          {SEARCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={searchBy === "vendor_name" ? "Search by vendor name..." : "Search by item name..."}
          className={`${inputCls} w-48`}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Last Purchased:</span>
          <DatePicker
            selected={dateFrom}
            onChange={(date) => handleDateChange("date_from", date)}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            placeholderText="From date"
            dateFormat="dd/MM/yyyy"
            className={inputCls}
            isClearable
          />
          <span className="text-xs text-gray-400">–</span>
          <DatePicker
            selected={dateTo}
            onChange={(date) => handleDateChange("date_to", date)}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom ?? undefined}
            placeholderText="To date"
            dateFormat="dd/MM/yyyy"
            className={inputCls}
            isClearable
          />
        </div>
      </div>
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
                Stock In Total Rs.
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Stock Out Total Rs.
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Minimum Maintain quantity
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Avilable quantity
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Consume quantity
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
              <TableRow key={index}>
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
                  ₹ {order.total_expense}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  ₹ {order.total_income}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.minimum_quantity}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 ${
                    order.avilable_quantity < order.minimum_quantity
                      ? "text-red-500"
                      : "text-gray-500"
                  }   text-start text-theme-sm`}
                >
                  {order.avilable_quantity}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.consume_quantity}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <button
                    onClick={() =>
                      handleOpenForm(
                        "add",
                        order.item_name,
                        order.id,
                        order.avilable_quantity,
                        order.vendor_name,
                        order.vendor_id
                        // order.minimum_quantity
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
                        order.id,
                        order.avilable_quantity,
                        order.vendor_name,
                        order.vendor_id
                        // order.minimum_quantity
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
                      onClick={() => onEdit(order.id)}
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
            count={page}
            onChange={(p) => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", String(p));
                return next;
              });
            }}
            length={inventoryList?.data?.length ? inventoryList?.data?.length : 1}
          />
        </div>
      </div>

      {formType && (
        <div className="fixed inset-0 dark:bg-black bg-white  bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-xl w-[50%]">
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
              {/* Quantity & Date */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                  <label htmlFor="date">Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      const finalDate = date ?? new Date(); // fallback to today if null
                      setSelectedDate(finalDate);

                      setFormData((prev) => ({
                        ...prev,
                        transaction_date: dayjs(date ?? new Date()).format(
                          "YYYY-MM-DD"
                        ),
                      }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="w-full border rounded px-3 mb-10 py-2"
                    placeholderText="Select a date"
                  />
                </div>
              </div>

              {/* Vendors Section */}
              <div className="space-y-5">
                {formType === "add" ? (
                  <div className="flex justify-end">
                    <button
                      disabled={formType === "add" ? false : true}
                      type="button"
                      onClick={handleAddMore}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      + Add More
                    </button>
                  </div>
                ) : (
                  ""
                )}

                {formData.vendors.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative  "
                  >
                    {/* ❌ Remove Button */}
                    {formData.vendors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}

                    {/* Vendor Select */}
                    <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                      {formType === "add" ? (
                        <>
                          <label className="block text-sm mb-1">
                            Choose Vendor
                          </label>
                          <select
                            name="vendor"
                            value={item.vendor}
                            onChange={(e) => handleVendorChange(index, e)}
                            className="w-full px-3 py-3   bg-gray-100  pl-2.5 pr-2 text-sm  hover:border-gray-200   dark:hover:border-gray-800    border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                          >
                            <option value="">Select</option>
                            {vendorList?.data?.map((data: any) => (
                              <option key={data.id} value={data.id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* Cost Per Unit */}
                    {formType === "add" ? (
                      <>
                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label className="block text-sm mb-1">
                            Cost Per Unit
                          </label>
                          <input
                            type="number"
                            name="cost_per_unit"
                            placeholder="Cost Per Unit"
                            value={item.cost_per_unit}
                            onChange={(e) => handleVendorChange(index, e)}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label htmlFor="quantity"> Quantity</label>
                          <input
                            type="number"
                            name="quantity"
                            max={formType === "add" ? "" : closingStock}
                            placeholder={"Quantity"}
                            value={item.quantity}
                            onChange={(e) => handleVendorChange(index, e)}
                            className="w-full p-2 border rounded"
                          />
                          {formType === "add" ? (
                            ""
                          ) : (
                            <p
                              className={`text-xs ${
                                closingStock < minimum_quantity
                                  ? "text-red-400"
                                  : "text-gray-400"
                              } `}
                            >
                              {`You have Quantity ${closingStock}`}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
                {formType === "consume"
                  ? formData.receivers.map((item, index) => (
                      <div
                        key={index + 1}
                        className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative"
                      >
                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label className="block text-sm mb-1">
                            Choose Receiver Type
                          </label>
                          <select
                            name="receiver_type"
                            value={item.receiver_type}
                            onChange={(e) => handleReceiversChange(index, e)}
                            className="w-full px-3 py-3 bg-gray-100 pl-2.5 pr-2 text-sm hover:border-gray-200 dark:hover:border-gray-800 border-gray-600 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 text-gray-700"
                          >
                            <option value="">Select</option>
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>

                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label className="block text-sm mb-1">
                            Receiver ID(Form ID/ESSL/text)
                          </label>
                          <input
                            type="text"
                            name="receiver_value"
                            placeholder=" Receiver ID(Form ID/ESSL/text)"
                            value={item.receiver_value}
                            onChange={(e) => handleReceiversChange(index, e)}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label htmlFor="quantity"> bill_no</label>
                          <input
                            type="text"
                            name="bill_no"
                            placeholder={"bill_no"}
                            value={item.bill_no}
                            onChange={(e) => handleReceiversChange(index, e)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className=" text-gray-500 flex flex-col dark:text-gray-400">
                          <label htmlFor="quantity"> Quantity</label>
                          <input
                            type="number"
                            name="quantity"
                            max={closingStock}
                            placeholder={"Quantity"}
                            value={item.quantity}
                            onChange={(e) => handleReceiversChange(index, e)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    ))
                  : ""}
              </div>

              {/* Remark */}

              <div className=" text-gray-500 flex flex-col mt-4 dark:text-gray-400">
                <label htmlFor="remark">Remark</label>
                <textarea
                  name="remark"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full p-3 border rounded mb-3"
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
