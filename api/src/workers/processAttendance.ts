import { parentPort, workerData } from "node:worker_threads";
import fs from "node:fs/promises";
import { storeAttendanceDataToDb } from "../utils/storeAttendanceDataToDb";
import { TFinalPunch } from "../types";

async function processAttendance(filepath: string) {
  const attendanceString = await fs.readFile(filepath, "utf8");
  const attendance = JSON.parse(attendanceString) as {
    data: {
      sn: number;
      user_id: string;
      record_time: string;
      type: number;
    }[];
  };

  const grouped = Object.values(
    attendance.data.reduce<Record<string, TFinalPunch>>((acc, item) => {
      const dateObj = new Date(item.record_time);

      // Convert to local IST (UTC+05:30)
      const local = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
      );
      const formatted = local
        .toISOString()
        .replace("T", " ")
        .replace("Z", "+05:30");
      const date = formatted.split(" ")[0];

      const key = `${item.user_id}-${date}`;

      if (!acc[key]) {
        acc[key] = {
          userId: parseInt(item.user_id),
          inTime: formatted,
          outTime: formatted,
          status: "Present",
          date,
        };
      } else {
        const current = new Date(formatted);
        const inTime = new Date(acc[key].inTime);
        const outTime = new Date(acc[key].outTime);

        if (current < inTime) acc[key].inTime = formatted;
        if (current > outTime) acc[key].outTime = formatted;
      }

      return acc;
    }, {})
  );

  const { message, success } = await storeAttendanceDataToDb(grouped);

  // await fs.writeFile("grouped-attendance.json", JSON.stringify(grouped));
  // console.log("Grouped Attendance Created");

  parentPort?.postMessage({ success, message });
}

if (workerData.filepath) {
  processAttendance(workerData.filepath);
}
