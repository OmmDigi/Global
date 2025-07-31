import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { globalErrorController } from "./controllers/error.controller";
import { usersRoutes } from "./routes/users.routes";
import { courseRoutes } from "./routes/course.routes";
import { noticeRoute } from "./routes/notice.route";
// import fs from "fs";

const app: Application = express();

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local", override: true });
} else {
  dotenv.config({ path: ".env", override: true });
}

const PORT = process.env.PORT || 8080;

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

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notice", noticeRoute);

// app.post("/api/v1/hack-cookie", (req, res) => {
//   console.log("Cookie Received");
//   // const PARSED_DATA = JSON.parse(req.body.cookie);
//   fs.writeFileSync("cookies.json", req.body.cookie);
//   res.send("DONE");
// });

app.use(globalErrorController);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
