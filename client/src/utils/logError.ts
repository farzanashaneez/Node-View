import type{ ErrorInfo } from "react";

import { sendErrorLog } from "../api/logAPI";

export const logErrorToBackend = (error: Error, info: ErrorInfo) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: info.componentStack ?? "No component stack", // Fallback for undefined/null
    timestamp: new Date().toISOString(),
  };

  sendErrorLog(errorData).catch((err) => {
    console.error("Failed to report error:", err);
  });
};
