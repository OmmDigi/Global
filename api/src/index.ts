import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { globalErrorController } from "./controllers/error.controller";
import { usersRoutes } from "./routes/users.routes";
import { courseRoutes } from "./routes/course.routes";
import { noticeRoute } from "./routes/notice.route";
import { admissionRoute } from "./routes/admission.routes";
import { paymentRoute } from "./routes/payment.routes";
import { attendanceRoute } from "./routes/attendance.routes";
import { holidayRoutes } from "./routes/holiday.routes";
import { leaveRoute } from "./routes/leave.routes";
import { vendorRoute } from "./routes/vendor.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { purchaseRoute } from "./routes/purchase.routes";
import { inventoryRoutes } from "./routes/inventory.routes";
import { excelRoute } from "./routes/excel.routes";
import { initCronJobs } from "./cron-jobs";
import { inventoryRouteV2 } from "./routes/v2/inventory.routes";
import { settingsRoutes } from "./routes/settings.routes";

const app: Application = express();

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local", override: true });
} else {
  dotenv.config({ path: ".env", override: true });
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:8080"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../public/views"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notice", noticeRoute);
app.use("/api/v1/admission", admissionRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/holiday", holidayRoutes);
app.use("/api/v1/attendance", attendanceRoute);
app.use("/api/v1/leave", leaveRoute);
app.use("/api/v1/vendor", vendorRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/excel", excelRoute);
app.use("/api/v2/inventory", inventoryRouteV2);
app.use("/api/v1/settings", settingsRoutes);

initCronJobs();

app.use(globalErrorController);

app.get("/test", (req, res) => {
    const filepath = path.resolve(
    __dirname,
    "../../attendance-logs/attendance-logs.json"
  );
  res.send(filepath)
  // const workerProcessPath = path.resolve(__dirname, "./workers/processAttendance.ts");
  
  // const worker = new Worker(workerProcessPath, {
  //   workerData: { filepath },
  //   execArgv: ["-r", "ts-node/register"],
  // });

  // // Listen for messages from the worker
  // worker.on("message", (result) => {
  //   console.log("Message From Worker Thread, : ", result);
  // });

  // // Handle errors from the worker
  // worker.on("error", (error) => {
  //   console.log("Error in worker thread", error);
  // });

  // // Handle worker exit (optional)
  // worker.on("exit", (code) => {
  //   if (code !== 0) {
  //     console.error(`Worker stopped with exit code ${code}`);
  //   }
  // });

  // res.send("Processing done");
});

const PORT = parseInt(process.env.PORT || "4001");
const HOST = process.env.HOST ?? "127.0.0.1";

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`);
});
