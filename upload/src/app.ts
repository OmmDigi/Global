import express from "express";
import uploadRoutes from "./routes/upload.routes";
import path from "path";
import { globalErrorController } from "./controllers/error.controller";
import { PUBLIC_FOLDER_NAME } from "./constant";
import dotenv from "dotenv";
import { viewRoute } from "./routes/view.routes";
import cors from "cors";
import { manageRoutes } from "./routes/manage.routes";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local", override: true });
} else {
  dotenv.config({ path: ".env", override: true });
}

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // ✅ Deny, but no error thrown
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  `/${PUBLIC_FOLDER_NAME}`,
  express.static(path.join(__dirname, `../${PUBLIC_FOLDER_NAME}`))
);

app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/view", viewRoute);
app.use("/api/v1/manage", manageRoutes);

app.use(globalErrorController);

export default app;
