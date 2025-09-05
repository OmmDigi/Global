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
app.use("/api/v2/inventory", inventoryRouteV2)

initCronJobs();

// app.get("/pay", async (req, res) => {
//   // res.render('payment-confirm', {
//   //   orderId: "OM25083015144279540489",
//   //   transactionId: "OM25083015144281540439",
//   //   amount: "2999",
//   //   paymentDate: "August 30, 2025",
//   //   // Student Information
//   //   studentName: "John Doe",

//   //   // Course Information
//   //   courseTitle: "Complete Web Development Bootcamp",
//   //   courseStartDate: "September 15, 2025",
//   //   courseDuration: "6 months",

//   //   // Links
//   //   dashboardUrl: "https://yourwebsite.com/dashboard",
//   //   courseUrl: "https://yourwebsite.com/courses/web-development",

//   //   // Support Information
//   //   supportEmail: "support@yourwebsite.com",
//   //   supportPhone: "+91-9876543210",

//   //   // Company Branding
//   //   companyName: "Your Learning Platform",

//   //   // Additional Features
//   //   whatsappGroup: true, // Boolean - shows WhatsApp group mention

//   //   // Social Media Links (all optional)
//   //   socialLinks: {
//   //     website: "https://yourwebsite.com",
//   //     facebook: "https://facebook.com/yourpage",
//   //     instagram: "https://instagram.com/yourpage",
//   //     linkedin: "https://linkedin.com/company/yourcompany"
//   //   }
//   // });

//   const data = {
//     recipientName: "Global Technical Institute",
//     generatedTime: new Date().toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//     items: [
//       {
//         companyName: "ABC Corporation",
//         name: "Server Maintenance Contract",
//         renewalDate: "2024-12-31",
//         daysRemaining: 30,
//       },
//       {
//         companyName: "XYZ Industries",
//         name: "Network Equipment AMC",
//         renewalDate : "2024-11-20",
//         daysRemaining: -5, // Overdue
//       },
//     ],
//   };

//   // await sendEmail('locbilla@gmail.com', 'AMC_ALERT', data)
//   // res.send("Email Done")
//   res.render("amc-notification.ejs", data);
// });

app.use(globalErrorController);

const PORT = parseInt(process.env.PORT || "4001");
const HOST = process.env.HOST ?? "127.0.0.1";

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`);
});