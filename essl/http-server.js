import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import {
  addNewEmployee,
  deleteEmployee,
  updateEmployee,
} from "./controllers/employee.controller.js";
import { globalErrorController } from "./controllers/error.controller.js";
import { clients } from "./constant.js";

dotenv.config();
const app = express();

// Your existing API routes
app.use(express.json());
app.get("/", (req, res) => res.send("Cloud API is running"));

// Create HTTP server manually (required for WebSocket to hook in)
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: "/device" });

wss.on("connection", (ws, req) => {
  const deviceId = req.headers["x-device-id"];
  const authToken = req.headers["authorization"];

  if (authToken !== `Bearer YOUR_SECRET_TOKEN`) {
    ws.close();
    return;
  }

  console.log(`🔌 Device ${deviceId} connected`);

  clients.set(deviceId, ws);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new ErrorHandler(
      400,
      "Essl local server software not running please run it first"
    );
  }
  // we are sending device connection info to the essl localserver so essl local server will connect with the device
  const ips = process.env.ESSL_DEVICE_IP.split(",");
  const ports = process.env.ESSL_DEVICE_PORT.split(",");
  if (ips.length != ports.length)
    throw new Error("Ports And Ips Length Must Be Same");
  const deviceinfo = ips.map((ip, index) => ({
    device_ip: ip,
    device_port: ports[index],
  }));

  ws.send(
    JSON.stringify({
      action: "connect_device",
      deviceinfo,
    })
  );

  ws.on("message", (msg) => {
    // console.log(msg.toString())
    const data = JSON.parse(msg);
    if (data) {
      if (data.action === "connection_failed") {
        clients.delete(deviceId);
      }
    }
    // console.log(`📨 Message from ${deviceId}:`, msg.toString());
  });

  ws.on("close", () => {
    console.log(`❌ Device ${deviceId} disconnected`);
    clients.delete(deviceId);
  });

  ws.on("error", (error) => {
    console.error("❌ ", error.message);
  });
});

// Example: Endpoint to trigger sending employee data to connected device
app.post("/api/v1/employee", addNewEmployee);
app.delete("/api/v1/employee", deleteEmployee);
app.put("/api/v1/employee", updateEmployee);

app.use(globalErrorController);

// Start the server
const PORT = parseInt(process.env.PORT || "8081");
// Start server
app.listen(PORT, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:" + PORT);
});
