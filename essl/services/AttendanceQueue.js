import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { readFile, writeFile } = fs.promises;

export class AttendanceQueue {
  constructor() {
    this.queueFile = path.join(__dirname, "attendance_queue.json");
    this.processing = false;
  }

  async addToQueue(data) {
    try {
      let queue = [];
      try {
        const fileData = await readFile(this.queueFile, "utf8");
        queue = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist, start with empty queue
      }

      queue.push({
        data,
        timestamp: new Date().toISOString(),
        attempts: 0,
      });

      await writeFile(this.queueFile, JSON.stringify(queue, null, 2));
      await this.processQueue();
    } catch (error) {
      console.error("Error adding to queue:", error);
    }
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    try {
      let queue = [];
      try {
        const fileData = await readFile(this.queueFile, "utf8");
        queue = JSON.parse(fileData);
      } catch (err) {
        this.processing = false;
        return;
      }

      const successfulItems = [];
      const failedItems = [];

      for (const item of queue) {
        try {
          await this.sendToExpressServer(item.data);
          successfulItems.push(item);
        } catch (error) {
          item.attempts++;
          if (item.attempts < 5) {
            // Max 5 retries
            failedItems.push(item);
          }
        }
      }

      // Update queue with only failed items
      await writeFile(this.queueFile, JSON.stringify(failedItems, null, 2));
    } catch (error) {
      console.error("Error processing queue:", error);
    }

    this.processing = false;
  }

  async sendToExpressServer(data) {
    // Your existing API call logic
    const dataToSend = JSON.stringify({
      password: process.env.PUNCH_ATTENDANCE_PASSWORD,
      data: data,
    });

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/attendance`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataToSend,
        timeout: 5000,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }
}
