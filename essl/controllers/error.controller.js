import { ApiResponse } from "../utils/ApiResponse.js";

const DBERRORS = {
  42703: "undefined_column",
  42601: "syntax_error",
};

const backErrorResponse = (err, res, mode) => {
  if (err.isOperational) {
    //these errors will throw by me
    res
      .status(err.statusCode)
      .json(
        new ApiResponse(
          err.statusCode,
          err.message,
          mode == "dev" ? err : null,
          err.key
        )
      );
  } else if (err.code) {
    if (DBERRORS[err.code]) {
      return res
        .status(400)
        .json(new ApiResponse(400, DBERRORS[err.code], err, err.key));
    }

    res.status(400).json(new ApiResponse(400, err.message, err, err.key));
  } else {
    res
      .status(500)
      .json(new ApiResponse(500, "Internal Server Error", err, err.key));
  }
};

export const globalErrorController = (err, req, res, next) => {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log({
    error: err,
    url: req.url,
    method: req.method,
    time: formatted,
  });
  backErrorResponse(err, res, "prod");
};
