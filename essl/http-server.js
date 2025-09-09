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
import { getEsslConfig } from "./utils/getEsslConfig.js";

dotenv.config();

const app = express();

// Your existing API routes
app.use(express.json());
app.get("/", (_, res) => {
  const config = getEsslConfig();
  res.json(config)
});

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

  // Fixed: Check WebSocket state properly
  if (!ws || ws.readyState !== ws.OPEN) {
    console.error("WebSocket connection not in OPEN state");
    ws.close();
    return;
  }

  // we are sending device connection info to the essl localserver so essl local server will connect with the device
  try {
    // const ips = process.env.ESSL_DEVICE_IP?.split(",") || [];
    // const ports = process.env.ESSL_DEVICE_PORT?.split(",") || [];

    const config = getEsslConfig();
    if (!config) {
      throw new Error("No essl config found");
    }

    // if (ips.length !== ports.length) {
    //   throw new Error("Ports And Ips Length Must Be Same");
    // }

    // const deviceinfo = ips.map((ip, index) => ({
    //   device_ip: ip.trim(),
    //   device_port: ports[index].trim(),
    // }));

    const deviceinfo = [
      {
        device_ip: config.ESSL_DEVICE_IP,
        device_port: config.ESSL_DEVICE_PORT,
      },
    ];

    ws.send(
      JSON.stringify({
        action: "connect_device",
        deviceinfo,
      })
    );
  } catch (error) {
    console.error("Error processing device info:", error.message);
    ws.close();
    return;
  }

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data && data.action === "connection_failed") {
        console.log(`Connection failed for device ${deviceId}`);
        clients.delete(deviceId);
      }
      console.log(`📨 Message from ${deviceId}:`, data);
    } catch (error) {
      console.error("Error parsing message:", error.message);
    }
  });

  ws.on("close", () => {
    console.log(`❌ Device ${deviceId} disconnected`);
    clients.delete(deviceId);
  });

  ws.on("error", (error) => {
    console.error(`❌ WebSocket error for ${deviceId}:`, error.message);
    clients.delete(deviceId);
  });
});

// API routes
app.post("/api/v1/employee", addNewEmployee);
app.delete("/api/v1/employee", deleteEmployee);
app.put("/api/v1/employee", updateEmployee);

app.use(globalErrorController);

const PORT = parseInt(process.env.PORT || "8081");
const HOST = process.env.HOST ?? "0.0.0.0"; // Changed to accept all interfaces

// Fixed: Use the server instance that has WebSocket attached
server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`🔌 WebSocket server ready on ws://${HOST}:${PORT}/device`);
});
