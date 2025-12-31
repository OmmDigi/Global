const ZKLib = require("zkteco-js");
const { WebSocket } = require("ws");
const path = require("path");
const fs = require("fs");

// const config = {
//   cloud_api_url: "http://localhost:8084",
//   device_id: "ESSL-001",
//   auth_token: "YOUR_SECRET_TOKEN",
// };

// Function to detect if running inside a pkg exe
function isPkg() {
  return process.hasOwnProperty("pkg");
}

// Config file path
let configPath;
if (isPkg()) {
  // When running as .exe → keep config.json outside the exe in the same folder
  configPath = path.join(path.dirname(process.execPath), "config.json");
} else {
  // When running with node → use local config.json
  configPath = path.join(__dirname, "config.json");
}

// Load config
let config = {};
try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    console.log("✅ Loaded config from:", configPath);
  } else {
    console.error("❌ Config file not found:", configPath);
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to read config.json:", err.message);
  process.exit(1);
}

// Example server using config
// console.log("Server starting with config:", config);

// controllers
async function sendUserToDevice(zk, user) {
  try {
    await zk.setUser(
      user.uid,
      user.userid,
      user.name,
      user.password,
      user.role || 0,
      user.cardno || 0
    );
    // console.log(`👤 User ${user.name} added to device`);
  } catch (err) {
    console.error("⚠️ Failed to add user:", err && err.stack ? err.stack : err);
  }
}

async function deleteUserFromDevice(zk, uid) {
  try {
    await zk.deleteUser(uid);
    // console.log(`👤 User ${uid} removed from device`);
  } catch (err) {
    console.error(
      "⚠️ Failed to delete user:",
      err && err.stack ? err.stack : err
    );
  }
}

async function updateEmployeeToDevice(zk, user) {
  try {
    // await zk.deleteUser(user.uid);
    await zk.setUser(
      user.uid,
      user.userid,
      user.name,
      user.password,
      user.role || 0,
      user.cardno || 0
    );
    // console.log(`👤 User ${user.name} updated to device`);
  } catch (err) {
    console.error(
      "⚠️ Failed to update user:",
      err && err.stack ? err.stack : err
    );
  }
}

async function connectDevice(deviceinfo) {
  const zkInstance = new ZKLib(
    deviceinfo.device_ip,
    deviceinfo.device_port,
    10000,
    4000
  );

  try {
    await zkInstance.createSocket();
    console.log("✅ Connected to ESSL device");

    // Pull users from device
    // const users = await zkInstance.getUsers();
    // console.log("📋 Users on device:", users.data);

    // Optional: send logs to cloud
    // const logs = await zkInstance.getAttendances();
    // await sendLogsToServer(logs.data);

    return zkInstance;
  } catch (err) {
    console.error("❌ Failed to connect to device:", err);
    return null;
  }
}

function connectWebSocket() {
  let zk = null;

  const ws = new WebSocket(
    `${config.cloud_api_url.replace(/^http/, "ws")}/device`,
    {
      headers: {
        Authorization: `Bearer ${config.auth_token}`,
        "X-Device-ID": config.device_id,
      },
    }
  );

  ws.on("open", async () => {
    console.log("📡 WebSocket connected to cloud API");
  });

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.action === "connect_device") {
        zk = await connectDevice(data.deviceinfo);
      }

      if (!zk) {
        console.error("❌ Could not start bridge. Check device connection.");
        return;
      }

      if (data.action === "add_employee") {
        sendUserToDevice(zk, data.user);
      } else if (data.action === "delete_employee")
        deleteUserFromDevice(zk, data.uid);
      else if (data.action === "update_employee")
        updateEmployeeToDevice(zk, data.user);
    } catch (err) {
      console.error(
        "⚠️ Invalid message from WebSocket:",
        err && err.stack ? err.stack : err
      );
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket disconnected. Reconnecting in 5s...");
    setTimeout(() => connectWebSocket(), 5000);
  });

  ws.on("error", () => {
    console.error("Unable to connect with cloud essl web socker server");
  });
}

// (async () => {
//   const zk = await connectDevice();
//   if (zk) {
//     connectWebSocket(zk);
//   } else {
//     console.error("❌ Could not start bridge. Check device connection.");
//   }
// })();

connectWebSocket();
