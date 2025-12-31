import path from "path";
import fs from "fs";

export const updateEsslConfig = async (ip: string, port: number) => {
  const configPath = path.resolve(__dirname, "../../../essl.config.json");

  const esslConfig = {
    ESSL_DEVICE_IP: ip,
    ESSL_DEVICE_PORT: port,
  };

  return await new Promise<{success : boolean, message : string}>((resolve, reject) => {
    fs.writeFile(configPath, JSON.stringify(esslConfig), "utf-8", (err) => {
      if (err) {
        return reject({
          success: false,
          message: err.message,
        });
      }
      resolve({
        success: true,
        message: "Essl config file successfully updated",
      });
    });
  });
};
