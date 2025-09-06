import fs from "fs";

export function updateEnv(
  envPath: string,
  key_value: { key: string; value: string }[]
) {
  let envFile = fs.readFileSync(envPath, "utf-8");
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

  fs.writeFileSync(envPath, envFile);
}
