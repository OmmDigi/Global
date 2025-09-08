import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { getEnv, updateEnv } from "../utils/updateEnv";
import { VAddEsslConfig } from "../validator/settings.validator";
import path from "path";

const envPath = path.resolve(__dirname, "../../../essl/.env");

export const addEsslConfig = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddEsslConfig.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await updateEnv(envPath, [
    { key: "ESSL_DEVICE_IP", value: value.essl_ip },
    { key: "ESSL_DEVICE_PORT", value: value.essl_port },
  ]);

  res
    .status(201)
    .json(new ApiResponse(201, "New ESSL configuration has been submitted."));
});

export const getEsslConfig = asyncErrorHandler(async (_, res) => {
  const IP = await getEnv(envPath, "ESSL_DEVICE_IP");
  const PORT = await getEnv(envPath, "ESSL_DEVICE_PORT");

  res.status(200).json(
    new ApiResponse(200, "Essl Config Info", {
      essl_ip: IP,
      essl_port: PORT,
    })
  );
});
