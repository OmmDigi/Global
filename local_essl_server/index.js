const ZKLib = require("zkteco-js");
const { WebSocket } = require("ws");

const config = {
  device_ip: "192.168.0.144",
  device_port: 4370,
  cloud_api_url: "http://localhost:8081",
  device_id: "ESSL-001",
  auth_token: "YOUR_SECRET_TOKEN",
};

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
    console.log(`👤 User ${user.name} added to device`);
  } catch (err) {
    console.error("⚠️ Failed to add user:", err && err.stack ? err.stack : err);
  }
}

async function deleteUserFromDevice(zk, uid) {
  try {
    await zk.deleteUser(uid);
    console.log(`👤 User ${uid} removed from device`);
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
    console.log(`👤 User ${user.name} updated to device`);
  } catch (err) {
    console.error(
      "⚠️ Failed to update user:",
      err && err.stack ? err.stack : err
    );
  }
}

async function connectDevice() {
  const zkInstance = new ZKLib(
    config.device_ip,
    config.device_port,
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
    zk = await connectDevice();
  });

  ws.on("message", (msg) => {
    if (!zk) {
      console.error("❌ Could not start bridge. Check device connection.");
      return;
    }
    try {
      const data = JSON.parse(msg);
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
