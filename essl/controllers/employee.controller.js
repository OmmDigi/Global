import { clients } from "../constant.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import {
  VCreateEmployee,
  VDeleteEmployee,
} from "../validator/employee.validator.js";
import { WebSocket } from "ws";

export const addNewEmployee = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateEmployee.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const device_id = value.device_id;
  const user = value.user;

  const ws = clients.get(device_id);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new ErrorHandler(
      400,
      "Essl local server software not running please run it first"
    );
  }

  ws.send(JSON.stringify({ action: "add_employee", user }));
  res.status(201).json(new ApiResponse(200, "Sent to device"));
});

export const deleteEmployee = asyncErrorHandler(async (req, res) => {
  const { error, value } = VDeleteEmployee.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const device_id = value.device_id;
  // const uid = value.uid;
  const user = value.user;

  const ws = clients.get(device_id);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new ErrorHandler(400, "Essl Device not connected");
  }

  ws.send(JSON.stringify({ action: "delete_employee", user }));
  res.status(201).json(new ApiResponse(200, "User removed from device"));
});

export const updateEmployee = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateEmployee.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const device_id = value.device_id;
  const user = value.user;

  const ws = clients.get(device_id);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new ErrorHandler(400, "Essl Device not connected");
  }

  ws.send(JSON.stringify({ action: "update_employee", user }));
  res
    .status(201)
    .json(new ApiResponse(200, "User update request sent to the device"));
});
