const ZKLib = require("zkteco-js");
const { WebSocket } = require("ws");

const config = {
  cloud_api_url: "https://essl.globaltechnicalinstitute.com",
  device_id: "ESSL-001",
  auth_token: "YOUR_SECRET_TOKEN",
};

/**
 * Sync user to multiple devices with rollback support
 * @param {"add"|"update"|"delete"} action - operation type
 * @param {Array} zks - array of zk device connections
 * @param {Object} user - user object { uid, userid, name, password, role, cardno }
 */
async function syncUserToDevices(action, zks, user) {
  let promises;

  if (action === "add" || action === "update") {
    // setUser works for both add & update in zkteco-js
    promises = zks.map((zk) =>
      zk.setUser(
        user.uid,
        user.userid,
        user.name,
        user.password,
        user.role || 0,
        user.cardno || 0
      )
    );
  } else if (action === "delete") {
    promises = zks.map((zk) => zk.deleteUser(user.uid));
  } else {
    throw new Error(`❌ Unknown action: ${action}`);
  }

  // run in parallel
  const results = await Promise.allSettled(promises);

  const failed = results.filter((r) => r.status === "rejected");
  const succeededIndexes = results
    .map((r, i) => (r.status === "fulfilled" ? i : null))
    .filter((i) => i !== null);

  if (failed.length > 0) {
    console.error(`⚠️ Some devices failed during ${action}, rolling back...`);

    if (action === "add" || action === "update") {
      // rollback by deleting from devices where add/update succeeded
      await Promise.allSettled(
        succeededIndexes.map((i) => zks[i].deleteUser(user.uid))
      );
    } else if (action === "delete") {
      // rollback by re-adding user to devices where delete succeeded
      await Promise.allSettled(
        succeededIndexes.map((i) =>
          zks[i].setUser(
            user.uid,
            user.userid,
            user.name,
            user.password,
            user.role || 0,
            user.cardno || 0
          )
        )
      );
    }

    throw new Error(
      `❌ User ${action} failed on one or more devices, rollback done`
    );
  }

  console.log(`✅ User ${action} successful on all devices`);
}

async function connectDevice(deviceinfo) {
  if (!Array.isArray(deviceinfo))
    throw new Error("device info should be an array");

  const zkInstances = [];

  try {
    for (const info of deviceinfo) {
      const zkIns = new ZKLib(info.device_ip, info.device_port, 10000, 4000);
      await zkIns.createSocket();
      zkInstances.push(zkIns);
    }

    console.log("✅ Connected to ESSL devices");

    return zkInstances;
  } catch (err) {
    console.error("❌ Failed to connect to device:", err);
    return null;
  }
}

function connectWebSocket() {
  let zks = null;

  const wsUrl = `${config.cloud_api_url.replace(/^https/, "wss")}/device`;

  const ws = new WebSocket(
    wsUrl,
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
        // get the array of device info ips : [], ports : []
        zks = await connectDevice(data.deviceinfo);
      }

      if (!zks || zks.length === 0) {
        ws.send(JSON.stringify({ action: "connection_failed" }));
        console.error("❌ Could not start bridge. Check device connection.");
        return;
      }

      const syncAction =
        data.action === "add_employee"
          ? "add"
          : data.action === "delete_employee"
          ? "delete"
          : data.action === "update_employee"
          ? "update"
          : null;

      if (syncAction != null) {
        syncUserToDevices(syncAction, zks, data.user);
      }
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
