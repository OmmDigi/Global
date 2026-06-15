import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Calendar,
  Check,
  CreditCard,
  Eye,
  IdCard,
  List,
  Pencil,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import { Link } from "react-router";

type Payment = {
  id: number;
  form_id: number;
  student_name: string;
  form_name: string;
  fee_head_name: string;
  amount: string;
  mode: string;
  bill_no: string | null;
  transition_id: string | null;
  payment_date: string | null;
  month: string | null;
  remark: string | null;
  course_name: string;
  batch_month_name: string;
};

type Props = {
  payments: Payment[];
  onUpdateBillNo: (id: number, bill_no: string) => Promise<void>;
};

export default function BasicTablePayments({
  payments,
  onUpdateBillNo,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [billNoInput, setBillNoInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [remarkText, setRemarkText] = useState<string | null>(null);

  const startEdit = (payment: Payment) => {
    setEditingId(payment.id);
    setBillNoInput(payment.bill_no ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setBillNoInput("");
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    await onUpdateBillNo(id, billNoInput);
    setSaving(false);
    setEditingId(null);
  };

  return (
    <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto max-w-full">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "#",
                "Student",
                // "Form",
                "Fee Head",
                "Amount",
                "Bill No",
                "Transaction ID",
                "Month",
                "Remark",
              ].map((h) => (
                <TableCell
                  key={h}
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {payments.length === 0 && (
              <TableRow>
                <TableCell className="px-4 py-6 text-center text-gray-400">
                  No payments found
                </TableCell>
              </TableRow>
            )}
            {payments.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>

                {/* Student — name + form_id + payment_date below */}
                <TableCell className="px-4 py-3 space-y-1 text-theme-sm whitespace-nowrap">
                  <span className="block font-medium text-gray-800 dark:text-white/90">
                    {p.student_name}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <Calendar size={15} />
                    {p.batch_month_name}
                  </span>
                  <Link
                    to={`/courseDetailsAdmin/${p.form_id}`}
                    className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5"
                  >
                    {/* Form #{p.form_id} */}
                    <IdCard size={15} />
                    {p.form_name}
                    <SquareArrowOutUpRight size={12} />
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <CreditCard size={15} />
                    {p.mode}
                  </span>
                  {p.payment_date && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={14} />
                      {new Date(p.payment_date).toLocaleDateString("en-IN")}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <List size={15} />
                    {p.course_name}
                  </span>
                </TableCell>

                {/* <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  {p.mode ?? "-"}
                </TableCell> */}

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  {p.fee_head_name ?? "-"}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-theme-sm font-medium whitespace-nowrap">
                  ₹{parseFloat(p.amount).toFixed(2)}
                </TableCell>

                {/* Bill No — inline edit */}
                <TableCell className="px-4 py-3 text-theme-sm whitespace-nowrap">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={billNoInput}
                        onChange={(e) => setBillNoInput(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:bg-gray-800 dark:border-white/[0.1] dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(p.id)}
                        disabled={saving}
                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {p.bill_no || "-"}
                      </span>
                      <button
                        onClick={() => startEdit(p)}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap max-w-[160px] truncate">
                  {p.transition_id || "-"}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  {p.month
                    ? new Date(p.month).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </TableCell>

                <TableCell className="px-4 py-3 text-theme-sm whitespace-nowrap">
                  {p.remark ? (
                    <button
                      onClick={() => setRemarkText(p.remark)}
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Remark modal */}
      {remarkText !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 relative shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Remark
              </h3>
              <button
                onClick={() => setRemarkText(null)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
              {remarkText}
            </p>
            <div className="mt-5 text-right">
              <button
                onClick={() => setRemarkText(null)}
                className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
