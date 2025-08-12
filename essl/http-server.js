import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { addNewEmployee, deleteEmployee, updateEmployee } from "./controllers/employee.controller.js";
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

  ws.on("message", (msg) => {
    console.log(`📨 Message from ${deviceId}:`, msg.toString());
  });

  ws.on("close", () => {
    console.log(`❌ Device ${deviceId} disconnected`);
    clients.delete(deviceId);
  });
});

// Example: Endpoint to trigger sending employee data to connected device
app.post("/api/v1/employee", addNewEmployee);
app.delete("/api/v1/employee", deleteEmployee);
app.put("/api/v1/employee", updateEmployee);


app.use(globalErrorController);

// Start the server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
