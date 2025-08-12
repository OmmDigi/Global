// import ZKLib from "zklib";

// async function enrollFingerprint() {
//   const zkInstance = new ZKLib({
//     ip: "192.168.0.144",
//     port: 4370,
//     inport: 4000,
//     timeout: 10000,
//   });

//   try {
//     zkInstance.createSocket(() => {});

//     // Add user first
//     await zkInstance.setUser({
//       uid: 2,
//       userid: "002",
//       name: "John Doe 2",
//       password: "",
//       role: 0,
//       cardno: 0,
//     });

//     // Start enrollment (if available in this library)
//     // await zkInstance.startEnroll(1, 0); // userID, fingerIndex

//     try {
//       zkInstance.executeCmd("CMD_STARTVERIFY", "");
//       console.log("Enrollment command sent");
//     } catch (e) {
//       console.log("Raw command failed:", e.message);
//     }

//     console.log("Enrollment started");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// enrollFingerprint();

import Zkteco from "zkteco-js";

// async function connectAndGetInfo() {
//   try {
//     const zkInstance = new ZKLib("192.168.0.144", 4370); // Replace with your device IP
//     await zkInstance.createSocket();
//     await zkInstance.setUser("120", "120", "Somnath", "123");
//     const info = await zkInstance.getInfo();
//     console.log("Device Information:", info);
//     await zkInstance.disconnect();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // connectAndGetInfo();
