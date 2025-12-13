import fs from "fs/promises";
import fssync from "fs";
import path from "path";

const logFilePath = path.join(
  process.cwd(),
  "/deleted_row_info/deleted_fee_head.log"
);

export async function logFeeHeadDelete({
  formId,
  feeHeadId,
  deletedById,
  data,
}: {
  formId: number;
  feeHeadId: string;
  deletedById: number;
  data: object;
}) {
  console.log(process.cwd());
  const time = new Date().toISOString();

  const logLine = `[${time}] FeeHead Deleted → Form ID: ${formId}, Fee Head ID: ${feeHeadId}, Deleted By: ${deletedById}, data : ${JSON.stringify(
    data
  )}\n`;

  if (!fssync.existsSync(logFilePath)) {
    fssync.writeFileSync(logFilePath, "");
  }

  await fs.appendFile(logFilePath, logLine);
}
