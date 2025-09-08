import fs from "fs";

export async function updateEnv(
  envPath: string,
  key_value: { key: string; value: string }[]
) {
  return new Promise((resolve, reject) => {
    fs.readFile(envPath, (err, data) => {
      if (err) {
        return reject(err);
      }

      let envFile = data.toString();
      for (const item of key_value) {
        const regex = new RegExp(`^${item.key}=.*`, "m");

        if (regex.test(envFile)) {
          // Replace existing key
          envFile = envFile.replace(regex, `${item.key}=${item.value}`);
        } else {
          // Append new key
          envFile += `\n${item.key}=${item.value}`;
        }
      }

      fs.writeFile(envPath, envFile, "utf-8", (wError) => {
        if (wError) {
          return reject(err);
        }

        resolve("Update Done");
      });
    });
  });
}

export async function getEnv(envPath: string, key: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    fs.readFile(envPath, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }

      // Split by lines and reduce into an object
      const envVars: Record<string, string> = {};
      data.split("\n").forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return; // skip comments/empty lines
        const [k, ...rest] = trimmed.split("=");
        envVars[k] = rest.join("=").trim();
      });

      resolve(envVars[key]);
    });
  });
}
