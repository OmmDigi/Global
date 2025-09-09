import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { updateEsslConfig } from "../utils/updateEsslConfig";
import { VAddEsslConfig } from "../validator/settings.validator";


export const addEsslConfig = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddEsslConfig.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await updateEsslConfig(value.essl_ip, value.essl_port)

  res
    .status(201)
    .json(new ApiResponse(201, "New ESSL configuration has been submitted."));
});
