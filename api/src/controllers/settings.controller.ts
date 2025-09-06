import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { updateEnv } from "../utils/updateEnv";
import { VAddEsslConfig } from "../validator/settings.validator";

import path from "path";

const envPath = path.resolve(__dirname, "../../../essl/.env");

export const addEsslConfig = asyncErrorHandler(async (req, res) => {
    const { error, value } = VAddEsslConfig.validate(req.body ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    updateEnv(envPath, [{ key: 'ESSL_DEVICE_IP', value: value.essl_ip }, { key: 'ESSL_DEVICE_PORT', value: value.essl_port }])

    res.status(201).json(new ApiResponse(201, "New ESSL configuration has been submitted."))
});
