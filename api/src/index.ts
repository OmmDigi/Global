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
import { pool } from "./config/db";

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
app.use("/api/v1/settings", settingsRoutes)

initCronJobs();

app.use(globalErrorController);

app.get("/test", async (req, res) => {
  const { rows } = await pool.query(`
  WITH each_form_fee_info AS (
    SELECT
      ffs.form_id,
      ffs.fee_head_id,
      cfh.name AS fee_head_name,
      MAX(ffs.amount) AS total_amount,
      COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) AS any_discount,
      COALESCE(MAX(ffs.amount), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) AS actule_fee_after_discount,
      COALESCE(SUM(p.amount) FILTER (WHERE mode != 'Discount'), 0) AS total_admission_fee_collected,
      COALESCE(MAX(ffs.amount), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode != 'Discount'), 0) AS pending_amount
    FROM form_fee_structure ffs
    
    LEFT JOIN course_fee_head cfh
    ON cfh.id = ffs.fee_head_id
    
    LEFT JOIN payments p
    ON p.form_id = ffs.form_id AND p.fee_head_id = ffs.fee_head_id
    
    GROUP BY ffs.form_id, ffs.fee_head_id, cfh.id
    
    ORDER BY ffs.form_id
)

SELECT
 row_number() OVER () AS sr_no,
 u.name AS student_name,
 ff.form_name,
 c.name AS course_name,
 b.month_name AS batch_name,
 s.name AS session_name,
 c.duration AS month_duration,
 JSON_AGG(effi) FILTER (WHERE effi.form_id IS NOT NULL) AS fee_info,
 (SELECT JSON_AGG(JSON_BUILD_OBJECT('id', id, 'name', name) ORDER BY id) FROM course_fee_head) AS fee_head_info
FROM fillup_forms ff

LEFT JOIN users u ON u.id = ff.student_id
LEFT JOIN enrolled_courses ec ON ec.form_id = ff.id
LEFT JOIN course c ON c.id = ec.course_id
LEFT JOIN batch b ON b.id = ec.batch_id
LEFT JOIN session s ON s.id = ec.session_id

LEFT JOIN each_form_fee_info effi ON effi.form_id = ff.id

GROUP BY u.id, c.id, ff.id, s.id, b.id

ORDER BY ff.id`);

  res.json(rows);
})

const PORT = parseInt(process.env.PORT || "4001");
const HOST = process.env.HOST ?? "127.0.0.1";

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`);
});