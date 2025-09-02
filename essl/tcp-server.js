import net from "net";
import dotenv from "dotenv";
// import cron from "node-cron";
import { AttendanceQueue } from "./services/AttendanceQueue.js";

dotenv.config();
const queue = new AttendanceQueue();

// =====================
// ADMS TCP SERVER FOR GETTING REALTIME PUNCH DATA
// =====================
const tcpServer = net.createServer((socket) => {
  let rawData = "";

  socket.on("data", (chunk) => {
    rawData += chunk.toString();

    if (rawData.includes("\r\n\r\n") || rawData.includes("Connection: close")) {
      const parts = rawData.split("\r\n\r\n");
      const headers = parts[0];
      const body = parts[1] || "";

      const isPost = headers.startsWith("POST");
      const isAttlog = headers.includes("table=ATTLOG");

      if (isPost && isAttlog) {
        const lines = body.trim().split("\n");
        const parsedLogs = lines.map((line) => {
          const parts = line.trim().split(/\s+/);
          return {
            userId: Number(parts[0]),
            time: parts[1] + " " + parts[2],
          };
        });

        (async () => {
          console.log(parsedLogs)
          await queue.addToQueue(parsedLogs);
        })();
      }

      const response = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/plain",
        "Content-Length: 2",
        "",
        "OK",
      ].join("\r\n");

      socket.write(response);
      socket.end();
    }
  });

  socket.on("error", console.error);
});

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = parseInt(process.env.TCP_NET_PORT || "8081");

// Start server
tcpServer.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`);
});