import { exec } from "node:child_process";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { updateEsslConfig } from "../utils/updateEsslConfig";
import { VAddEsslConfig } from "../validator/settings.validator";
import path from "node:path";
import fs from "fs";
import { parse } from "url";

export const addEsslConfig = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddEsslConfig.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await updateEsslConfig(value.essl_ip, value.essl_port);

  res
    .status(201)
    .json(new ApiResponse(201, "New ESSL configuration has been submitted."));
});

export const backupDatabase = asyncErrorHandler(async (req, res) => {
  // Parse PostgreSQL connection URL
  const dbUrl = process.env.POSTGRES_URL;
  if (!dbUrl) throw new ErrorHandler(400, "Postgress url is required");
  const config = parse(dbUrl);

  if (!config.auth) throw new ErrorHandler(400, "Invalid postgres url");
  if (!config.pathname) throw new ErrorHandler(400, "Invalid postgres url");

  const [user, password] = config.auth.split(":");
  const host = config.hostname;
  const port = config.port;
  const dbName = config.pathname.replace("/", "");

  // Create backup directory
  const backupDir = "./db-backups";
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const fileName = `backup_${Date.now()}.sql`;
  const filePath = path.join(backupDir, fileName);

  // Set password env variable required by pg_dump
  process.env.PGPASSWORD = password;

  // Build pg_dump command
  const cmd = `pg_dump -U ${user} -h ${host} -p ${port} ${dbName} > ${filePath}`;

  await new Promise((resolve, reject) => {
    exec(cmd, (error, _, stderr) => {
      if (error || stderr) {
        return reject(error);
      }
      resolve("Backup created successfully");
    });
  });

  res.json({
    message: "Backup created successfully",
    file: fileName,
    path: filePath,
  });
});
