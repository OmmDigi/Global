import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEsslConfig = () => {
  const configPath = path.resolve(__dirname, "../../essl.config.json");

  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const finalData = JSON.parse(data);
    return finalData;
  } catch {
    return null;
  }
};